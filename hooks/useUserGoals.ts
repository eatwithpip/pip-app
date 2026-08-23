import { useQuery } from '@tanstack/react-query';

import { type ExperienceLevel } from '@/constants/difficulty';
import { useAuth } from '@/context/AuthContext';
import { GOALS, type Goal } from '@/constants/goals';
import { supabase } from '@/lib/supabase';

export type EscalationCheckpoint = 0 | 4 | 8;

export type UserGoal = Goal & {
  selectedAt: string;
  difficulty: ExperienceLevel | null;
  difficultyStartedAt: string;
  lastEscalationCheckpoint: EscalationCheckpoint;
};

export function useUserGoals() {
  const { user } = useAuth();

  return useQuery<UserGoal[]>({
    queryKey: ['user-goals', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_goals')
        .select('goal_id, created_at, difficulty, difficulty_started_at, last_escalation_checkpoint')
        .eq('user_id', user.id);

      if (error) throw error;
      return (data ?? [])
        .map(row => {
          const goal = GOALS.find(g => g.id === row.goal_id);
          return goal
            ? {
                ...goal,
                selectedAt: row.created_at,
                difficulty: row.difficulty,
                difficultyStartedAt: row.difficulty_started_at,
                lastEscalationCheckpoint: row.last_escalation_checkpoint as EscalationCheckpoint,
              }
            : undefined;
        })
        .filter((g): g is UserGoal => !!g);
    },
    enabled: !!user,
  });
}
