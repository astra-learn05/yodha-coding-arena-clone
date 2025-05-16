import { supabaseClient } from "@/lib/supabase";

export interface Profile {
  id: string;
  user_id: string;
  prn: string;
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
  geeksforgeeks_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  background_color: string;
  text_color: string;
  created_at: string;
  updated_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  created_at: string;
  updated_at: string;
  badge?: Badge;
}

export interface Skill {
  id: string;
  user_id: string;
  skill_name: string;
  created_at: string;
  updated_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  credential_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  technologies: string[];
  start_date: string;
  end_date: string | null;
  project_url: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkExperience {
  id: string;
  user_id: string;
  company: string;
  position: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  description: string;
  technologies: string[];
  created_at: string;
  updated_at: string;
}

export interface Training {
  id: string;
  user_id: string;
  title: string;
  institution: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  certificate_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: string;
  user_id: string;
  title: string;
  platform: string;
  score: number | null;
  date_taken: string;
  url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Publication {
  id: string;
  user_id: string;
  title: string;
  publication_name: string;
  publication_date: string;
  authors: string[];
  doi?: string;
  url?: string;
  created_at: string;
  updated_at: string;
}

export const getProfileById = async (id: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching profile by ID:', error);
      return null;
    }

    return data as Profile;
  } catch (err) {
    console.error('Error in getProfileById:', err);
    return null;
  }
};

export const getProfileByPRN = async (prn: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('prn', prn)
      .single();

    if (error) {
      console.error('Error fetching profile by PRN:', error);
      return null;
    }

    return data as Profile;
  } catch (err) {
    console.error('Error in getProfileByPRN:', err);
    return null;
  }
};

export const updateProfile = async (
  id: string,
  updates: Partial<Profile>
): Promise<Profile | null> => {
  try {
    const { data, error } = await supabaseClient
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }

    return data as Profile;
  } catch (err) {
    console.error('Error in updateProfile:', err);
    return null;
  }
};

export const getUserBadges = async (userId: string): Promise<UserBadge[]> => {
  try {
    const { data, error } = await supabaseClient
      .from('user_badges')
      .select('*, badge:badges(*)')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) {
      console.error('Error fetching user badges:', error);
      return [];
    }

    return data as UserBadge[];
  } catch (err) {
    console.error('Error in getUserBadges:', err);
    return [];
  }
};

export const getUserSkills = async (userId: string): Promise<Skill[]> => {
  try {
    const { data, error } = await supabaseClient
      .from('skills')
      .select('*')
      .eq('user_id', userId)
      .order('skill_name', { ascending: true });

    if (error) {
      console.error('Error fetching user skills:', error);
      return [];
    }

    return data as Skill[];
  } catch (err) {
    console.error('Error in getUserSkills:', err);
    return [];
  }
};

export const getUserCertificates = async (userId: string): Promise<Certificate[]> => {
  try {
    const { data, error } = await supabaseClient
      .from('certificates')
      .select('*')
      .eq('user_id', userId)
      .order('issue_date', { ascending: false });

    if (error) {
      console.error('Error fetching user certificates:', error);
      return [];
    }

    return data as Certificate[];
  } catch (err) {
    console.error('Error in getUserCertificates:', err);
    return [];
  }
};

export const getUserProjects = async (userId: string): Promise<Project[]> => {
  try {
    const { data, error } = await supabaseClient
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching user projects:', error);
      return [];
    }

    return data as Project[];
  } catch (err) {
    console.error('Error in getUserProjects:', err);
    return [];
  }
};

export const getUserWorkExperiences = async (userId: string): Promise<WorkExperience[]> => {
  try {
    const { data, error } = await supabaseClient
      .from('work_experience')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching user work experience:', error);
      return [];
    }

    return data as WorkExperience[];
  } catch (err) {
    console.error('Error in getUserWorkExperiences:', err);
    return [];
  }
};

export const getUserTrainings = async (userId: string): Promise<Training[]> => {
  try {
    const { data, error } = await supabaseClient
      .from('trainings')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching user trainings:', error);
      return [];
    }

    return data as Training[];
  } catch (err) {
    console.error('Error in getUserTrainings:', err);
    return [];
  }
};

export const getUserAssessments = async (userId: string): Promise<Assessment[]> => {
  try {
    const { data, error } = await supabaseClient
      .from('assessments')
      .select('*')
      .eq('user_id', userId)
      .order('date_taken', { ascending: false });

    if (error) {
      console.error('Error fetching user assessments:', error);
      return [];
    }

    return data as Assessment[];
  } catch (err) {
    console.error('Error in getUserAssessments:', err);
    return [];
  }
};

export const addCertificate = async (certificate: Omit<Certificate, 'id' | 'created_at' | 'updated_at' >): Promise<Certificate | null> => {
  try {
    const { data, error } = await supabaseClient
      .from('certificates')
      .insert([certificate])
      .select('*')
      .single();

    if (error) {
      console.error('Error adding certificate:', error);
      return null;
    }

    return data as Certificate;
  } catch (err) {
    console.error('Error in addCertificate:', err);
    return null;
  }
};

export const updateCertificate = async (id: string, updates: Partial<Certificate>): Promise<Certificate | null> => {
  try {
    const { data, error } = await supabaseClient
      .from('certificates')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating certificate:', error);
      return null;
    }

    return data as Certificate;
  } catch (err) {
    console.error('Error in updateCertificate:', err);
    return null;
  }
};

export const deleteCertificate = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabaseClient
      .from('certificates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting certificate:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error in deleteCertificate:', err);
    return false;
  }
};

export const addProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project | null> => {
  try {
    const { data, error } = await supabaseClient
      .from('projects')
      .insert([project])
      .select('*')
      .single();

    if (error) {
      console.error('Error adding project:', error);
      return null;
    }

    return data as Project;
  } catch (err) {
    console.error('Error in addProject:', err);
    return null;
  }
};

export const updateProject = async (id: string, updates: Partial<Project>): Promise<Project | null> => {
  try {
    const { data, error } = await supabaseClient
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating project:', error);
      return null;
    }

    return data as Project;
  } catch (err) {
    console.error('Error in updateProject:', err);
    return null;
  }
};

export const deleteProject = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabaseClient
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error in deleteProject:', err);
    return false;
  }
};

export const addWorkExperience = async (workExperience: Omit<WorkExperience, 'id' | 'created_at' | 'updated_at'>): Promise<WorkExperience | null> => {
  try {
    const { data, error } = await supabaseClient
      .from('work_experience')
      .insert([workExperience])
      .select('*')
      .single();

    if (error) {
      console.error('Error adding work experience:', error);
      return null;
    }

    return data as WorkExperience;
  } catch (err) {
    console.error('Error in addWorkExperience:', err);
    return null;
  }
};

export const updateWorkExperience = async (id: string, updates: Partial<WorkExperience>): Promise<WorkExperience | null> => {
  try {
    const { data, error } = await supabaseClient
      .from('work_experience')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating work experience:', error);
      return null;
    }

    return data as WorkExperience;
  } catch (err) {
    console.error('Error in updateWorkExperience:', err);
    return null;
  }
};

export const deleteWorkExperience = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabaseClient
      .from('work_experience')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting work experience:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error in deleteWorkExperience:', err);
    return false;
  }
};

export const getUserPublications = async (userId: string): Promise<Publication[]> => {
  try {
    const { data, error } = await supabaseClient
      .from('publications')
      .select('*')
      .eq('user_id', userId)
      .order('publication_date', { ascending: false });

    if (error) {
      console.error('Error fetching user publications:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error in getUserPublications:', err);
    return [];
  }
};

export {
  getProfileById,
  getProfileByPRN,
  updateProfile,
  getUserBadges,
  getUserSkills,
  getUserCertificates,
  getUserProjects,
  getUserWorkExperiences,
  getUserTrainings,
  getUserAssessments,
  addCertificate,
  updateCertificate,
  deleteCertificate,
  addProject,
  updateProject,
  deleteProject,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  getUserPublications,
};
