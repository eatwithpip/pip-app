import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { supabase, type Profile } from '@/lib/supabase';

export function useProfile() {
  const { user } = useAuth();

  return useQuery<Profile | null>({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // PGRST116 = row not found — not an error, just means not onboarded yet
      if (error && error.code !== 'PGRST116') throw error;
      return data ?? null;
    },
    enabled: !!user,
  });
}

export function useInvalidateProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return () => queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
}
