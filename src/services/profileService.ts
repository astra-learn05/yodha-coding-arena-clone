
import { supabase } from "@/integrations/supabase/client";

// Types for profile data
export type Profile = {
  id: string;
  real_name: string;
  cgpa: number;
  created_at: string;
  updated_at: string;
};

export type UserSkill = {
  id: string;
  user_id: string;
  skill_name: string;
  created_at: string;
};

export type BadgeType = {
  id: string;
  name: string;
  description: string | null;
  icon_name: string;
  background_color: string;
  text_color: string;
  created_at: string;
};

export type UserBadge = {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: BadgeType;
};

export type UserStreak = {
  id: string;
  user_id: string;
  current_streak: number;
  max_streak: number;
  last_activity_date: string | null;
  created_at: string;
  updated_at: string;
};

// Fetch profile by PRN (using the users table to lookup)
export const getProfileByPRN = async (prn: string): Promise<Profile | null> => {
  // First get the user ID from the users table using PRN
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('prn', prn)
    .maybeSingle();

  if (userError || !userData) {
    console.error('Error fetching user by PRN:', userError);
    return null;
  }

  // Now fetch the profile using the user ID
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userData.id)
    .maybeSingle();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
    return null;
  }

  return profileData;
};

// Fetch profile by ID
export const getProfileById = async (id: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
};

// Update profile
export const updateProfile = async (id: string, profile: Partial<Profile>): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }

  return data;
};

// Get skills for a user
export const getUserSkills = async (userId: string): Promise<UserSkill[]> => {
  const { data, error } = await supabase
    .from('user_skills')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user skills:', error);
    return [];
  }

  return data || [];
};

// Add a skill
export const addUserSkill = async (userId: string, skillName: string): Promise<UserSkill | null> => {
  const { data, error } = await supabase
    .from('user_skills')
    .insert({ user_id: userId, skill_name: skillName })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error adding skill:', error);
    return null;
  }

  return data;
};

// Remove a skill
export const removeUserSkill = async (skillId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('user_skills')
    .delete()
    .eq('id', skillId);

  if (error) {
    console.error('Error removing skill:', error);
    return false;
  }

  return true;
};

// Get badges for a user
export const getUserBadges = async (userId: string): Promise<UserBadge[]> => {
  const { data, error } = await supabase
    .from('user_badges')
    .select(`
      *,
      badge:badge_id(*)
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user badges:', error);
    return [];
  }

  return data || [];
};

// Get user streak
export const getUserStreak = async (userId: string): Promise<UserStreak | null> => {
  const { data, error } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user streak:', error);
    return null;
  }

  return data;
};
