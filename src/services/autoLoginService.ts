
import { supabase } from "@/integrations/supabase/client";

export const autoLogin = async (userId: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('auto-login', {
      body: { userId }
    });

    if (error) {
      console.error('Auto-login error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in autoLogin:', error);
    throw error;
  }
};
