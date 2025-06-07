
import { supabase } from "@/integrations/supabase/client";

export const checkAndAwardPathBadges = async (userId: string) => {
  try {
    // Check if user has already earned badges to avoid duplicates
    const { data: existingBadges } = await supabase
      .from('user_badges')
      .select('badge_id')
      .eq('user_id', userId);

    const earnedBadgeIds = existingBadges?.map(b => b.badge_id) || [];

    // Get all available badges
    const { data: badges } = await supabase
      .from('badge_types')
      .select('*');

    if (!badges) return;

    // Award logic based on your requirements
    for (const badge of badges) {
      if (!earnedBadgeIds.includes(badge.id)) {
        // Example: Award first completion badge
        if (badge.name === 'First Completion') {
          await supabase
            .from('user_badges')
            .insert({
              id: crypto.randomUUID(),
              user_id: userId,
              badge_id: badge.id
            });
        }
      }
    }
  } catch (error) {
    console.error('Error in checkAndAwardPathBadges:', error);
  }
};
