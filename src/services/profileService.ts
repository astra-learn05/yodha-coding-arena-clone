
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  real_name: string;
  cgpa: number;
  bio: string | null;
  college_name: string | null;
  location: string | null;
  profile_picture_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  leetcode_url: string | null;
  hackerrank_url: string | null;
  gfg_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_name: string;
  created_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string | null;
  icon_name: string | null;
  background_color: string | null;
  text_color: string | null;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

export interface Assessment {
  id: string;
  name: string;
  code: string;
  status: string;
  start_time: string;
  end_time: string | null;
  duration_minutes: number;
}

export interface UserAssessmentResult {
  id: string;
  user_id: string;
  assessment_id: string;
  submission_id: string;
  total_score: number;
  total_marks: number;
  percentage: number;
  is_cheated: boolean;
  completed_at: string;
  created_at: string;
  assessment?: Assessment;
}

export const getProfileById = async (id: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }

    if (!data) {
      return null;
    }

    return {
      ...data,
      cgpa: data.cgpa ? Number(data.cgpa) : 0
    } as Profile;
  } catch (error) {
    console.error('Error in getProfileById:', error);
    throw error;
  }
};

export const getProfileByPRN = async (prn: string): Promise<Profile | null> => {
  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('prn', prn)
      .single();

    if (userError || !userData) {
      console.error('Error fetching user by PRN:', userError);
      return null;
    }

    return getProfileById(userData.id);
  } catch (error) {
    console.error('Error in getProfileByPRN:', error);
    return null;
  }
};

export const updateProfile = async (id: string, profileData: Partial<Profile>): Promise<Profile> => {
  try {
    const updateData = {
      ...profileData,
      cgpa: profileData.cgpa ? Number(profileData.cgpa) : undefined,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    return {
      ...data,
      cgpa: data.cgpa ? Number(data.cgpa) : 0
    } as Profile;
  } catch (error) {
    console.error('Error in updateProfile:', error);
    throw error;
  }
};

export const getUserBadges = async (userId: string): Promise<UserBadge[]> => {
  try {
    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        *,
        badge:badge_types(*)
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user badges:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserBadges:', error);
    return [];
  }
};

export const getUserSkills = async (userId: string): Promise<UserSkill[]> => {
  try {
    const { data, error } = await supabase
      .from('user_skills')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user skills:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserSkills:', error);
    return [];
  }
};

export const addUserSkill = async (userId: string, skillName: string): Promise<UserSkill> => {
  try {
    const { data, error } = await supabase
      .from('user_skills')
      .insert({
        id: crypto.randomUUID(),
        user_id: userId,
        skill_name: skillName
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding user skill:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in addUserSkill:', error);
    throw error;
  }
};

export const deleteUserSkill = async (skillId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_skills')
      .delete()
      .eq('id', skillId);

    if (error) {
      console.error('Error deleting user skill:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteUserSkill:', error);
    throw error;
  }
};

export const getUserAssessmentResults = async (userId: string): Promise<UserAssessmentResult[]> => {
  try {
    const { data, error } = await supabase
      .from('results')
      .select(`
        *,
        assessment:assessments(*)
      `)
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching user assessment results:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserAssessmentResults:', error);
    return [];
  }
};
