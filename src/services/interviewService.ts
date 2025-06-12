
import { supabase } from "@/integrations/supabase/client";

export const getUserInterviewResults = async (userId: string) => {
  const { data, error } = await supabase
    .from('interview_results')
    .select(`
      *,
      interviews (
        job_role,
        domain,
        experience,
        question_type,
        created_at,
        completed_at
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching interview results:', error);
    throw error;
  }

  return data || [];
};
