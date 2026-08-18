import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { type Objective } from '@/constants/goals';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { rollingWeekDates, toDateString, WEEKDAY_LETTERS } from '@/hooks/useWeeklyGoalStats';

export interface ObjectiveDay {
  date: string;
  label: string;
  completed: boolean;
}

// So a screen can render an empty week (correct weekday letters, all
// unchecked) before any objective_logs rows exist or have loaded.
export function emptyObjectiveWeek(): ObjectiveDay[] {
  return rollingWeekDates().map(d => ({
    date: toDateString(d),
    label: WEEKDAY_LETTERS[d.getDay()],
    completed: false,
  }));
}

// Whether the objective's target has been met for the current rolling
// week. Only meaningful for weekly-target objectives — a daily
// objective's target is already represented by each day's own
// checkbox, and monthly targets aren't evaluable from a 7-day window.
export function isObjectiveAchieved(objective: Objective, days: ObjectiveDay[]) {
  if (objective.targetFrequency !== 'weekly') return false;
  const completedCount = days.filter(d => d.completed).length;
  return completedCount >= objective.targetCount;
}

export function useObjectiveLog(goalId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const weekDates = rollingWeekDates();
  const dateStrs = weekDates.map(toDateString);
  const rangeStart = dateStrs[0];
  const rangeEnd = dateStrs[6];
  const queryKey = ['objective-log', user?.id, goalId, rangeEnd];

  const query = useQuery<ObjectiveDay[]>({
    queryKey,
    queryFn: async () => {
      if (!user) return emptyObjectiveWeek();
      const { data, error } = await supabase
        .from('objective_logs')
        .select('log_date, completed')
        .eq('user_id', user.id)
        .eq('goal_id', goalId)
        .gte('log_date', rangeStart)
        .lte('log_date', rangeEnd);

      if (error) throw error;

      const byDate = new Map((data ?? []).map(row => [row.log_date, row.completed]));
      return weekDates.map((d, i) => ({
        date: dateStrs[i],
        label: WEEKDAY_LETTERS[d.getDay()],
        completed: byDate.get(dateStrs[i]) ?? false,
      }));
    },
    enabled: !!user,
  });

  const toggleDay = useMutation({
    mutationFn: async ({ date, completed }: { date: string; completed: boolean }) => {
      if (!user) return;
      const { error } = await supabase.from('objective_logs').upsert(
        {
          user_id: user.id,
          goal_id: goalId,
          log_date: date,
          completed,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,goal_id,log_date' }
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['objective-log', user?.id, goalId] });
    },
  });

  return { ...query, toggleDay };
}
