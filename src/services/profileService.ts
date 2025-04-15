import { supabase } from "@/integrations/supabase/client";

// Types for profile data
export type Profile = {
  id: string;
  real_name: string;
  cgpa: number;
  created_at: string;
  updated_at: string;
  bio: string | null;
  college_name: string | null;
  location: string | null;
  profile_picture_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
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

export type Certificate = {
  id: string;
  user_id: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  credential_url?: string;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  technologies?: string[];
  start_date: string;
  end_date?: string;
  project_url?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
};

export type WorkExperience = {
  id: string;
  user_id: string;
  company: string;
  position: string;
  location?: string;
  start_date: string;
  end_date?: string;
  description: string;
  technologies?: string[];
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
  console.log("Updating profile with ID:", id);
  console.log("Update data:", profile);
  
  // Ensure CGPA is a valid number
  const updates = {
    ...profile,
    cgpa: typeof profile.cgpa === 'number' ? profile.cgpa : parseFloat(String(profile.cgpa))
  };
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }

  console.log("Profile updated successfully:", data);
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
  // First check if skill already exists to avoid duplicates
  const { data: existingSkills } = await supabase
    .from('user_skills')
    .select('*')
    .eq('user_id', userId)
    .eq('skill_name', skillName);
    
  // If skill already exists, return it
  if (existingSkills && existingSkills.length > 0) {
    return existingSkills[0];
  }

  // Otherwise add the new skill
  const { data, error } = await supabase
    .from('user_skills')
    .insert({ user_id: userId, skill_name: skillName })
    .select()
    .single();

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

// Find and remove a skill by name
export const removeUserSkillByName = async (userId: string, skillName: string): Promise<boolean> => {
  // First find the skill by name
  const { data: skills } = await supabase
    .from('user_skills')
    .select('id')
    .eq('user_id', userId)
    .eq('skill_name', skillName);
  
  if (!skills || skills.length === 0) {
    console.log(`Skill "${skillName}" not found for user ${userId}`);
    return false;
  }
  
  // Then delete it using the id
  return removeUserSkill(skills[0].id);
};

// Sync user skills - add new ones, remove old ones
export const syncUserSkills = async (userId: string, skills: string[]): Promise<boolean> => {
  try {
    console.log("Syncing skills for user:", userId);
    console.log("New skills list:", skills);
    
    // Get current skills
    const currentSkills = await getUserSkills(userId);
    const currentSkillNames = currentSkills.map(s => s.skill_name);
    
    console.log("Current skills:", currentSkillNames);
    
    // Skills to add (in new list but not in current)
    const skillsToAdd = skills.filter(skill => !currentSkillNames.includes(skill));
    console.log("Skills to add:", skillsToAdd);
    
    // Skills to remove (in current but not in new list)
    const skillsToRemove = currentSkills.filter(skill => !skills.includes(skill.skill_name));
    console.log("Skills to remove:", skillsToRemove.map(s => s.skill_name));
    
    // Add new skills
    const addPromises = skillsToAdd.map(skill => addUserSkill(userId, skill));
    await Promise.all(addPromises);
    
    // Remove old skills
    const removePromises = skillsToRemove.map(skill => removeUserSkill(skill.id));
    await Promise.all(removePromises);
    
    return true;
  } catch (error) {
    console.error("Error syncing user skills:", error);
    return false;
  }
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

// Get certificates for a user
export const getUserCertificates = async (userId: string): Promise<Certificate[]> => {
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('user_id', userId)
    .order('issue_date', { ascending: false });

  if (error) {
    console.error('Error fetching user certificates:', error);
    return [];
  }

  return data || [];
};

// Add a certificate
export const addCertificate = async (userId: string, certificate: Omit<Certificate, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Certificate | null> => {
  const { data, error } = await supabase
    .from('certificates')
    .insert({ 
      user_id: userId,
      ...certificate
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding certificate:', error);
    return null;
  }

  return data;
};

// Update a certificate
export const updateCertificate = async (certificateId: string, certificate: Partial<Certificate>): Promise<Certificate | null> => {
  const { data, error } = await supabase
    .from('certificates')
    .update(certificate)
    .eq('id', certificateId)
    .select()
    .single();

  if (error) {
    console.error('Error updating certificate:', error);
    return null;
  }

  return data;
};

// Delete a certificate
export const deleteCertificate = async (certificateId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('certificates')
    .delete()
    .eq('id', certificateId);

  if (error) {
    console.error('Error deleting certificate:', error);
    return false;
  }

  return true;
};

// Get projects for a user
export const getUserProjects = async (userId: string): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Error fetching user projects:', error);
    return [];
  }

  return data || [];
};

// Add a project
export const addProject = async (userId: string, project: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Project | null> => {
  const { data, error } = await supabase
    .from('projects')
    .insert({ 
      user_id: userId,
      ...project
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding project:', error);
    return null;
  }

  return data;
};

// Update a project
export const updateProject = async (projectId: string, project: Partial<Project>): Promise<Project | null> => {
  const { data, error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', projectId)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    return null;
  }

  return data;
};

// Delete a project
export const deleteProject = async (projectId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) {
    console.error('Error deleting project:', error);
    return false;
  }

  return true;
};

// Get work experiences for a user
export const getUserWorkExperiences = async (userId: string): Promise<WorkExperience[]> => {
  const { data, error } = await supabase
    .from('work_experience')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Error fetching user work experiences:', error);
    return [];
  }

  return data || [];
};

// Add a work experience
export const addWorkExperience = async (userId: string, workExperience: Omit<WorkExperience, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<WorkExperience | null> => {
  const { data, error } = await supabase
    .from('work_experience')
    .insert({ 
      user_id: userId,
      ...workExperience
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding work experience:', error);
    return null;
  }

  return data;
};

// Update a work experience
export const updateWorkExperience = async (workExperienceId: string, workExperience: Partial<WorkExperience>): Promise<WorkExperience | null> => {
  const { data, error } = await supabase
    .from('work_experience')
    .update(workExperience)
    .eq('id', workExperienceId)
    .select()
    .single();

  if (error) {
    console.error('Error updating work experience:', error);
    return null;
  }

  return data;
};

// Delete a work experience
export const deleteWorkExperience = async (workExperienceId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('work_experience')
    .delete()
    .eq('id', workExperienceId);

  if (error) {
    console.error('Error deleting work experience:', error);
    return false;
  }

  return true;
};
