import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/context/AuthContext';
import { GOALS, type Goal } from '@/constants/goals';
import { supabase } from '@/lib/supabase';

export function useUserGoals() {
  const { user } = useAuth();

  return useQuery<Goal[]>({
    queryKey: ['user-goals', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_goals')
        .select('goal_id')
        .eq('user_id', user.id);

      if (error) throw error;
      return (data ?? [])
        .map(row => GOALS.find(g => g.id === row.goal_id))
        .filter((g): g is Goal => !!g);
    },
    enabled: !!user,
  });
}
