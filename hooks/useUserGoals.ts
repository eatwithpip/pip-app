import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/context/AuthContext';
import { GOALS, type Goal } from '@/constants/goals';
import { supabase } from '@/lib/supabase';

export type UserGoal = Goal & { selectedAt: string };

export function useUserGoals() {
  const { user } = useAuth();

  return useQuery<UserGoal[]>({
    queryKey: ['user-goals', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_goals')
        .select('goal_id, created_at')
        .eq('user_id', user.id);

      if (error) throw error;
      return (data ?? [])
        .map(row => {
          const goal = GOALS.find(g => g.id === row.goal_id);
          return goal ? { ...goal, selectedAt: row.created_at } : undefined;
        })
        .filter((g): g is UserGoal => !!g);
    },
    enabled: !!user,
  });
}
