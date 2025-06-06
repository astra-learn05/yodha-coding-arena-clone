
import { supabase } from "@/integrations/supabase/client";

export interface GamificationData {
  id: string;
  user_id: string;
  total_coins: number;
  current_level: number;
  coins_in_current_level: number;
  created_at: string;
  updated_at: string;
}

export const getUserGamificationData = async (userId: string): Promise<GamificationData | null> => {
  try {
    const { data, error } = await supabase
      .from('user_gamification')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching gamification data:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error in getUserGamificationData:', err);
    return null;
  }
};

export const awardCoinsForQuestion = async (userId: string, difficulty: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .rpc('award_coins_for_question', {
        p_user_id: userId,
        p_difficulty: difficulty
      });

    if (error) {
      console.error('Error awarding coins:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error in awardCoinsForQuestion:', err);
    return false;
  }
};

export const getLevelInfo = (level: number) => {
  const levels = [
    { level: 1, name: "Novice", color: "from-gray-400 to-gray-600", coinsRequired: 0 },
    { level: 2, name: "Apprentice", color: "from-green-400 to-green-600", coinsRequired: 100 },
    { level: 3, name: "Skilled", color: "from-blue-400 to-blue-600", coinsRequired: 200 },
    { level: 4, name: "Expert", color: "from-purple-400 to-purple-600", coinsRequired: 300 },
    { level: 5, name: "Master", color: "from-orange-400 to-orange-600", coinsRequired: 400 },
    { level: 6, name: "Grandmaster", color: "from-red-400 to-red-600", coinsRequired: 500 },
    { level: 7, name: "Legend", color: "from-yellow-400 to-yellow-600", coinsRequired: 600 },
  ];

  return levels.find(l => l.level === level) || levels[0];
};
