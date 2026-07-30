import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

function todayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function useDailyLog() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const logDate = todayDateString();
  const queryKey = ['daily-log', user?.id, logDate];

  const query = useQuery<Record<string, number>>({
    queryKey,
    queryFn: async () => {
      if (!user) return {};
      const { data, error } = await supabase
        .from('daily_logs')
        .select('goal_id, score')
        .eq('user_id', user.id)
        .eq('log_date', logDate);

      if (error) throw error;
      return Object.fromEntries((data ?? []).map(row => [row.goal_id, row.score]));
    },
    enabled: !!user,
  });

  const submit = useMutation({
    mutationFn: async (scores: Record<string, number>) => {
      if (!user) return;
      const rows = Object.entries(scores).map(([goal_id, score]) => ({
        user_id: user.id,
        goal_id,
        log_date: logDate,
        score,
        updated_at: new Date().toISOString(),
      }));
      if (rows.length === 0) return;

      const { error } = await supabase
        .from('daily_logs')
        .upsert(rows, { onConflict: 'user_id,goal_id,log_date' });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return { ...query, submit };
}
