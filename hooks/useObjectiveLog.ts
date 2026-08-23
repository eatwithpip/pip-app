import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { type Objective } from '@/constants/goals';
import { GOAL_WINDOW_WEEKS } from '@/constants/goalWindow';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { toDateString, WEEKDAY_LETTERS } from '@/hooks/useWeeklyGoalStats';

export interface ObjectiveDay {
  date: string;
  label: string;
  completed: boolean;
  disabled: boolean;
}

function startOfDay(d: Date) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(d: Date, days: number) {
  const date = new Date(d);
  date.setDate(date.getDate() + days);
  return date;
}

// Monday–Sunday of the calendar week containing today, so the row never
// visually starts/ends mid-week regardless of what day it is.
function currentWeekDates() {
  const today = startOfDay(new Date());
  const monday = addDays(today, today.getDay() === 0 ? -6 : 1 - today.getDay());
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

// A day is only loggable within the goal's 12-week active window — this
// naturally disables the tail of the first calendar week when the goal
// was selected mid-week, and the head of the last calendar week when the
// window ends mid-week, without needing to special-case "week 1"/"week 12".
function isWithinGoalWindow(day: Date, selectedAt: string) {
  const start = startOfDay(new Date(selectedAt));
  const end = addDays(start, GOAL_WINDOW_WEEKS * 7 - 1);
  return day >= start && day <= end;
}

// So a screen can render an empty week (correct weekday letters, all
// unchecked) before any objective_logs rows exist or have loaded.
export function emptyObjectiveWeek(selectedAt: string): ObjectiveDay[] {
  return currentWeekDates().map(d => ({
    date: toDateString(d),
    label: WEEKDAY_LETTERS[d.getDay()],
    completed: false,
    disabled: !isWithinGoalWindow(d, selectedAt),
  }));
}

// Whether the objective's target has been met — for a daily objective
// that's just today's checkbox, for a weekly one it's targetCount
// check-ins within the current calendar week. Monthly targets aren't
// evaluable from a 7-day window, so they never report achieved here.
export function isObjectiveAchieved(objective: Objective, days: ObjectiveDay[]) {
  if (objective.targetFrequency === 'daily') {
    const today = days.find(d => d.date === toDateString(new Date()));
    return !!today?.completed;
  }
  if (objective.targetFrequency === 'weekly') {
    const completedCount = days.filter(d => d.completed).length;
    return completedCount >= objective.targetCount;
  }
  return false;
}

export function useObjectiveLog(goalId: string, selectedAt: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const weekDates = currentWeekDates();
  const dateStrs = weekDates.map(toDateString);
  const rangeStart = dateStrs[0];
  const rangeEnd = dateStrs[6];
  const queryKey = ['objective-log', user?.id, goalId, rangeEnd];

  const query = useQuery<ObjectiveDay[]>({
    queryKey,
    queryFn: async () => {
      if (!user) return emptyObjectiveWeek(selectedAt);
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
        disabled: !isWithinGoalWindow(d, selectedAt),
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
