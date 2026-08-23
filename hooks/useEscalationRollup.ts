import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { toDateString } from '@/hooks/useWeeklyGoalStats';

export interface RollupWeek {
  weekStart: string;
  objectiveCompletedCount: number;
  mymopAvg: number | null;
  mymopCheckIns: number;
}

// Monday of the calendar week containing `d` — matches Postgres's
// date_trunc('week', ...) used by the goal_weekly_rollup view, and the
// Monday–Sunday convention already used by hooks/useObjectiveLog.ts.
function mondayOf(d: Date) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + (date.getDay() === 0 ? -6 : 1 - date.getDay()));
  return date;
}

const WEEKS_OF_HISTORY = 13; // covers both the week-4 and week-8 checkpoints

// Weekly objective-completion / MYMOP rollup per goal, sourced from the
// goal_weekly_rollup view (supabase/schema.sql) so the 4-week/8-week
// escalation checks don't require pulling raw daily rows client-side.
export function useEscalationRollup() {
  const { user } = useAuth();

  const currentWeekStart = toDateString(mondayOf(new Date()));
  const rangeStart = toDateString(
    (() => {
      const d = mondayOf(new Date());
      d.setDate(d.getDate() - WEEKS_OF_HISTORY * 7);
      return d;
    })()
  );

  return useQuery<Record<string, RollupWeek[]>>({
    queryKey: ['goal-weekly-rollup', user?.id, currentWeekStart],
    queryFn: async () => {
      if (!user) return {};

      const { data, error } = await supabase
        .from('goal_weekly_rollup')
        .select('goal_id, week_start, objective_completed_count, mymop_avg, mymop_check_ins')
        .eq('user_id', user.id)
        .gte('week_start', rangeStart);

      if (error) throw error;

      const byGoal: Record<string, RollupWeek[]> = {};
      for (const row of data ?? []) {
        const week: RollupWeek = {
          weekStart: row.week_start,
          objectiveCompletedCount: row.objective_completed_count,
          mymopAvg: row.mymop_avg,
          mymopCheckIns: row.mymop_check_ins,
        };
        (byGoal[row.goal_id] ??= []).push(week);
      }
      return byGoal;
    },
    enabled: !!user,
  });
}
