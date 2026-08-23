import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DIFFICULTY_OPTIONS, type ExperienceLevel } from '@/constants/difficulty';
import { type Goal, type Objective } from '@/constants/goals';
import { useAuth } from '@/context/AuthContext';
import { type RollupWeek } from '@/hooks/useEscalationRollup';
import { type UserGoal } from '@/hooks/useUserGoals';
import { toDateString } from '@/hooks/useWeeklyGoalStats';
import { supabase } from '@/lib/supabase';

const TIER_ORDER: ExperienceLevel[] = ['beginner', 'intermediate', 'advanced'];
const CHECKPOINTS: (4 | 8)[] = [4, 8];

function mondayOf(d: Date) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + (date.getDay() === 0 ? -6 : 1 - date.getDay()));
  return date;
}

function addDays(d: Date, days: number) {
  const date = new Date(d);
  date.setDate(date.getDate() + days);
  return date;
}

// Objectives on the goal at every tier above `difficulty`, easiest first.
function nextTiersFor(goal: Goal, difficulty: ExperienceLevel | null): Objective[] {
  const currentIndex = difficulty ? TIER_ORDER.indexOf(difficulty) : -1;
  return TIER_ORDER.slice(currentIndex + 1)
    .map(level => {
      const option = DIFFICULTY_OPTIONS.find(d => d.id === level);
      return goal.objectives.find(o => o.difficultyLevel === option?.objectiveDifficulty);
    })
    .filter((o): o is Objective => !!o);
}

export interface PendingCheckpoint {
  checkpoint: 4 | 8;
  nextTiers: Objective[];
}

// Whether `goal` has an unresolved escalation checkpoint (week 4 or week
// 8) ready to show, based on the trailing 4-week block of weekly rollup
// data for whichever checkpoint comes next. Escalation only ever happens
// at a checkpoint, so each 4-week block is "pure" for a single objective
// tier — no need to reason about a tier change mid-block.
export function getPendingCheckpoint(
  goal: UserGoal,
  objective: Objective | undefined,
  weeks: RollupWeek[] | undefined
): PendingCheckpoint | undefined {
  if (!objective || goal.difficulty === 'advanced') return undefined;

  const checkpoint = CHECKPOINTS.find(c => c > goal.lastEscalationCheckpoint);
  if (!checkpoint) return undefined;

  const goalStart = mondayOf(new Date(goal.selectedAt));
  if (Date.now() < addDays(goalStart, checkpoint * 7).getTime()) return undefined;

  const blockWeekStarts = Array.from({ length: 4 }, (_, i) =>
    toDateString(addDays(goalStart, (checkpoint - 4 + i) * 7))
  );
  const blockWeeks = blockWeekStarts.map(ws => weeks?.find(w => w.weekStart === ws));

  const objectiveRoute = blockWeeks.every(w => {
    if (!w) return false;
    if (objective.targetFrequency === 'daily') return w.objectiveCompletedCount >= 1;
    if (objective.targetFrequency === 'weekly') return w.objectiveCompletedCount >= objective.targetCount;
    return false; // monthly targets aren't evaluable from weekly buckets
  });
  const mymopRoute = blockWeeks.every(w => w?.mymopAvg != null && w.mymopAvg >= 4);

  if (!objectiveRoute && !mymopRoute) return undefined;

  const nextTiers = nextTiersFor(goal, goal.difficulty);
  if (nextTiers.length === 0) return undefined;

  return { checkpoint, nextTiers };
}

export function useEscalateGoalDifficulty(goalId: string, checkpoint: 4 | 8) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['user-goals', user?.id] });
    queryClient.invalidateQueries({ queryKey: ['goal-weekly-rollup', user?.id] });
  };

  const accept = useMutation({
    mutationFn: async (difficulty: ExperienceLevel) => {
      if (!user) return;
      const { error } = await supabase
        .from('user_goals')
        .update({
          difficulty,
          difficulty_started_at: new Date().toISOString(),
          last_escalation_checkpoint: checkpoint,
        })
        .eq('user_id', user.id)
        .eq('goal_id', goalId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const decline = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const { error } = await supabase
        .from('user_goals')
        .update({ last_escalation_checkpoint: checkpoint })
        .eq('user_id', user.id)
        .eq('goal_id', goalId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { accept, decline };
}
