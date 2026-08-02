import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

const WEEKDAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; // indexed by Date#getDay()

export interface GoalWeekStats {
  thisWeekAvg?: number;
  lastWeekAvg?: number;
  trend?: 'up' | 'down' | 'flat';
  checkedInDays: number;
  days: { label: string; score: number | null }[];
}

function toDateString(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function dateDaysAgo(daysAgo: number) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - daysAgo);
  return d;
}

// The rolling 7-day window ending today, oldest first.
function rollingWeekDates() {
  return Array.from({ length: 7 }, (_, i) => dateDaysAgo(6 - i));
}

// So a screen can render an empty/no-data week (correct weekday letters,
// null scores) before any daily_logs rows exist or have loaded.
export function emptyRollingWeekDays() {
  return rollingWeekDates().map(d => ({ label: WEEKDAY_LETTERS[d.getDay()], score: null }));
}

function average(scores: number[]) {
  if (scores.length === 0) return undefined;
  return scores.reduce((sum, s) => sum + s, 0) / scores.length;
}

export function useWeeklyGoalStats() {
  const { user } = useAuth();

  const thisWeekDates = rollingWeekDates();
  const lastWeekDates = thisWeekDates.map(d => {
    const prev = new Date(d);
    prev.setDate(prev.getDate() - 7);
    return prev;
  });

  const thisWeekDateStrs = thisWeekDates.map(toDateString);
  const lastWeekDateStrs = lastWeekDates.map(toDateString);
  const rangeStart = lastWeekDateStrs[0];
  const rangeEnd = thisWeekDateStrs[6];

  return useQuery<Record<string, GoalWeekStats>>({
    queryKey: ['weekly-goal-stats', user?.id, rangeEnd],
    queryFn: async () => {
      if (!user) return {};

      const { data, error } = await supabase
        .from('daily_logs')
        .select('goal_id, log_date, score')
        .eq('user_id', user.id)
        .gte('log_date', rangeStart)
        .lte('log_date', rangeEnd);

      if (error) throw error;

      const byGoal = new Map<string, Map<string, number>>();
      for (const row of data ?? []) {
        const byDate = byGoal.get(row.goal_id) ?? new Map<string, number>();
        byDate.set(row.log_date, row.score);
        byGoal.set(row.goal_id, byDate);
      }

      const stats: Record<string, GoalWeekStats> = {};
      for (const [goalId, byDate] of byGoal) {
        const thisWeekScores = thisWeekDateStrs
          .map(date => byDate.get(date))
          .filter((s): s is number => s !== undefined);
        const lastWeekScores = lastWeekDateStrs
          .map(date => byDate.get(date))
          .filter((s): s is number => s !== undefined);

        const thisWeekAvg = average(thisWeekScores);
        const lastWeekAvg = average(lastWeekScores);

        let trend: GoalWeekStats['trend'];
        if (thisWeekAvg !== undefined && lastWeekAvg !== undefined) {
          if (thisWeekAvg > lastWeekAvg) trend = 'up';
          else if (thisWeekAvg < lastWeekAvg) trend = 'down';
          else trend = 'flat';
        }

        stats[goalId] = {
          thisWeekAvg,
          lastWeekAvg,
          trend,
          checkedInDays: thisWeekScores.length,
          days: thisWeekDates.map((d, i) => ({
            label: WEEKDAY_LETTERS[d.getDay()],
            score: byDate.get(thisWeekDateStrs[i]) ?? null,
          })),
        };
      }

      return stats;
    },
    enabled: !!user,
  });
}
