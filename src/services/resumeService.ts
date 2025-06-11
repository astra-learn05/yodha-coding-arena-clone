
import { supabase } from "@/integrations/supabase/client";

export interface PersonalInfo {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  user_id: string;
  institution_name: string;
  degree: string;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  gpa: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkExperience {
  id: string;
  user_id: string;
  company_name: string;
  position: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResumeSkill {
  id: string;
  user_id: string;
  skill_name: string;
  skill_category: string | null;
  proficiency_level: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  project_name: string;
  description: string | null;
  technologies_used: string[] | null;
  project_url: string | null;
  github_url: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface PositionOfResponsibility {
  id: string;
  user_id: string;
  position_title: string;
  organization: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_title: string;
  description: string | null;
  issuing_organization: string | null;
  date_achieved: string | null;
  created_at: string;
}

export interface HobbyActivity {
  id: string;
  user_id: string;
  activity_name: string;
  description: string | null;
  created_at: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo | null;
  education: Education[];
  workExperience: WorkExperience[];
  skills: ResumeSkill[];
  projects: Project[];
  positions: PositionOfResponsibility[];
  achievements: Achievement[];
  hobbies: HobbyActivity[];
}

export const getResumeData = async (userId: string): Promise<ResumeData> => {
  try {
    // Fetch personal info
    const { data: personalInfo } = await supabase
      .from('personal_info')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    // Fetch education
    const { data: education } = await supabase
      .from('education')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    // Fetch work experience
    const { data: workExperience } = await supabase
      .from('work_experience')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    // Fetch resume skills
    const { data: skills } = await supabase
      .from('resume_skills')
      .select('*')
      .eq('user_id', userId)
      .order('skill_category', { ascending: true });

    // Fetch projects
    const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    // Fetch positions of responsibility
    const { data: positions } = await supabase
      .from('positions_of_responsibility')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    // Fetch achievements
    const { data: achievements } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('date_achieved', { ascending: false });

    // Fetch hobbies and activities
    const { data: hobbies } = await supabase
      .from('hobbies_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return {
      personalInfo: personalInfo || null,
      education: education || [],
      workExperience: workExperience || [],
      skills: skills || [],
      projects: projects || [],
      positions: positions || [],
      achievements: achievements || [],
      hobbies: hobbies || []
    };
  } catch (error) {
    console.error('Error fetching resume data:', error);
    throw error;
  }
};
