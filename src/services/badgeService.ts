
import { supabase } from "@/integrations/supabase/client";
import { isLearningPathCompleted, areAllLearningPathsCompleted } from "./learningPathService";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  background_color: string;
  text_color: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

// Get all badges for a user
export const getUserBadges = async (userId: string): Promise<UserBadge[]> => {
  const { data, error } = await supabase
    .from('user_badges')
    .select(`
      *,
      badge:badge_id (
        *
      )
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user badges:', error);
    return [];
  }

  return data || [];
};

// Check and award learning path completion badges
export const checkAndAwardPathBadges = async (userId: string): Promise<void> => {
  try {
    // First check if all paths are completed for the supreme badge
    const allPathsCompleted = await areAllLearningPathsCompleted(userId);
    
    // Check individual path completions
    const beginnerCompleted = await isLearningPathCompleted(userId, 'easy');
    const intermediateCompleted = await isLearningPathCompleted(userId, 'medium');
    const advancedCompleted = await isLearningPathCompleted(userId, 'hard');
    
    // Get existing badges to avoid duplicates
    const existingBadges = await getUserBadges(userId);
    const existingBadgeIds = new Set(existingBadges.map(badge => badge.badge_id));
    
    // Get badge type IDs from the database
    const { data: badgeTypes } = await supabase
      .from('badge_types')
      .select('*');
      
    if (!badgeTypes) return;
    
    const bronzeBadge = badgeTypes.find(badge => badge.name === 'Bronze Coder');
    const silverBadge = badgeTypes.find(badge => badge.name === 'Silver Coder');
    const goldBadge = badgeTypes.find(badge => badge.name === 'Gold Coder');
    const supremeBadge = badgeTypes.find(badge => badge.name === 'Supreme Coder');
    
    // Award badges based on completion
    if (beginnerCompleted && bronzeBadge && !existingBadgeIds.has(bronzeBadge.id)) {
      await awardBadge(userId, bronzeBadge.id);
    }
    
    if (intermediateCompleted && silverBadge && !existingBadgeIds.has(silverBadge.id)) {
      await awardBadge(userId, silverBadge.id);
    }
    
    if (advancedCompleted && goldBadge && !existingBadgeIds.has(goldBadge.id)) {
      await awardBadge(userId, goldBadge.id);
    }
    
    if (allPathsCompleted && supremeBadge && !existingBadgeIds.has(supremeBadge.id)) {
      await awardBadge(userId, supremeBadge.id);
    }
  } catch (error) {
    console.error('Error checking and awarding badges:', error);
  }
};

// Award a badge to a user
const awardBadge = async (userId: string, badgeId: string): Promise<void> => {
  const { error } = await supabase
    .from('user_badges')
    .insert({
      user_id: userId,
      badge_id: badgeId
    });

  if (error) {
    console.error('Error awarding badge:', error);
  }
};
