import { mockUser } from "./userService";

export interface Profile {
  id: string;
  user_id: string;
  real_name: string;
  email: string;
  prn: string;
  cgpa: number;
  profile_picture_url: string | null;
  bio: string | null;
  college_name: string | null;
  location: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  leetcode_url: string | null;
  hackerrank_url: string | null;
  geeksforgeeks_url: string | null;
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

export const getProfileById = async (id: string): Promise<Profile | null> => {
  // Mock implementation
  const profile = mockProfiles.find((profile) => profile.id === id);
  return profile || null;
};

export const getProfileByPRN = async (prn: string): Promise<Profile | null> => {
  // Mock implementation
  const profile = mockProfiles.find((profile) => profile.prn === prn);
  return profile || null;
};

export const updateProfile = async (
  id: string, 
  data: { 
    realName: string; 
    cgpa: number;
    bio: string | null;
    collegeName: string | null;
    location: string | null;
    profilePictureUrl: string | null;
    linkedinUrl: string | null;
    githubUrl: string | null;
    leetcodeUrl: string | null;
    hackerrankUrl: string | null;
    geeksforgeeksUrl: string | null;
  }
) => {
  console.log("Updating profile", id, data);
  return {
    id,
    user_id: "user123",
    real_name: data.realName,
    email: "student@example.com",
    prn: "PRN12345",
    cgpa: data.cgpa,
    profile_picture_url: data.profilePictureUrl,
    bio: data.bio,
    college_name: data.collegeName,
    location: data.location,
    linkedin_url: data.linkedinUrl,
    github_url: data.githubUrl,
    leetcode_url: data.leetcodeUrl,
    hackerrank_url: data.hackerrankUrl,
    geeksforgeeks_url: data.geeksforgeeksUrl,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

export const getUserBadges = async (userId: string) => {
  // Mock implementation
  console.log("Fetching badges for user", userId);
  return mockBadges;
};

export const getUserCertificates = async (userId: string): Promise<Certificate[]> => {
  // Mock implementation
  console.log("Fetching certificates for user", userId);
  return mockCertificates.filter(certificate => certificate.user_id === userId);
};

export const getUserProjects = async (userId: string): Promise<Project[]> => {
  // Mock implementation
  console.log("Fetching projects for user", userId);
  return mockProjects.filter(project => project.user_id === userId);
};

export const getUserWorkExperiences = async (userId: string): Promise<WorkExperience[]> => {
  // Mock implementation
  console.log("Fetching work experience for user", userId);
  return mockWorkExperiences.filter(experience => experience.user_id === userId);
};

export const addCertificate = async (certificate: Omit<Certificate, 'id' | 'created_at' | 'updated_at'>): Promise<Certificate> => {
  // Mock implementation
  console.log("Adding certificate", certificate);
  const newCertificate: Certificate = {
    id: `cert-${Math.random()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...certificate
  };
  mockCertificates.push(newCertificate);
  return newCertificate;
};

export const updateCertificate = async (id: string, updates: Partial<Certificate>): Promise<Certificate | null> => {
  // Mock implementation
  console.log("Updating certificate", id, updates);
  const certificateIndex = mockCertificates.findIndex(certificate => certificate.id === id);
  if (certificateIndex === -1) {
    return null;
  }
  mockCertificates[certificateIndex] = {
    ...mockCertificates[certificateIndex],
    ...updates,
    updated_at: new Date().toISOString()
  };
  return mockCertificates[certificateIndex];
};

export const deleteCertificate = async (id: string): Promise<boolean> => {
  // Mock implementation
  console.log("Deleting certificate", id);
  const certificateIndex = mockCertificates.findIndex(certificate => certificate.id === id);
  if (certificateIndex === -1) {
    return false;
  }
  mockCertificates.splice(certificateIndex, 1);
  return true;
};

export const addProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> => {
  // Mock implementation
  console.log("Adding project", project);
  const newProject: Project = {
    id: `project-${Math.random()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...project
  };
  mockProjects.push(newProject);
  return newProject;
};

export const updateProject = async (id: string, updates: Partial<Project>): Promise<Project | null> => {
  // Mock implementation
  console.log("Updating project", id, updates);
  const projectIndex = mockProjects.findIndex(project => project.id === id);
  if (projectIndex === -1) {
    return null;
  }
  mockProjects[projectIndex] = {
    ...mockProjects[projectIndex],
    ...updates,
    updated_at: new Date().toISOString()
  };
  return mockProjects[projectIndex];
};

export const deleteProject = async (id: string): Promise<boolean> => {
  // Mock implementation
  console.log("Deleting project", id);
  const projectIndex = mockProjects.findIndex(project => project.id === id);
  if (projectIndex === -1) {
    return false;
  }
  mockProjects.splice(projectIndex, 1);
  return true;
};

export const addWorkExperience = async (experience: Omit<WorkExperience, 'id' | 'created_at' | 'updated_at'>): Promise<WorkExperience> => {
  // Mock implementation
  console.log("Adding work experience", experience);
  const newExperience: WorkExperience = {
    id: `exp-${Math.random()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...experience
  };
  mockWorkExperiences.push(newExperience);
  return newExperience;
};

export const updateWorkExperience = async (id: string, updates: Partial<WorkExperience>): Promise<WorkExperience | null> => {
  // Mock implementation
  console.log("Updating work experience", id, updates);
  const experienceIndex = mockWorkExperiences.findIndex(experience => experience.id === id);
  if (experienceIndex === -1) {
    return null;
  }
  mockWorkExperiences[experienceIndex] = {
    ...mockWorkExperiences[experienceIndex],
    ...updates,
    updated_at: new Date().toISOString()
  };
  return mockWorkExperiences[experienceIndex];
};

export const deleteWorkExperience = async (id: string): Promise<boolean> => {
  // Mock implementation
  console.log("Deleting work experience", id);
  const experienceIndex = mockWorkExperiences.findIndex(experience => experience.id === id);
  if (experienceIndex === -1) {
    return false;
  }
  mockWorkExperiences.splice(experienceIndex, 1);
  return true;
};

interface Badge {
  id: string;
  badge_id: string;
  user_id: string;
  earned_at: string;
}

interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  background_color: string;
  text_color: string;
}

export const mockBadges: Badge[] = [
  {
    id: "badge1",
    badge_id: "award1",
    user_id: "user123",
    earned_at: new Date().toISOString(),
  },
  {
    id: "badge2",
    badge_id: "code1",
    user_id: "user123",
    earned_at: new Date().toISOString(),
  },
];

export const mockBadgeDefinitions: BadgeDefinition[] = [
  {
    id: "award1",
    name: "Completionist",
    description: "Completed first learning path",
    icon_name: "Award",
    background_color: "#E0E7FF",
    text_color: "#4F46E5",
  },
  {
    id: "code1",
    name: "Code Warrior",
    description: "Solved 10 coding challenges",
    icon_name: "Code",
    background_color: "#D1FAE5",
    text_color: "#065F46",
  },
];

export const mockCertificates: Certificate[] = [
  {
    id: "cert1",
    user_id: "user123",
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    issue_date: "2022-01-01",
    expiry_date: "2025-01-01",
    credential_url: "https://example.com/cert1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cert2",
    user_id: "user123",
    title: "Google Cloud Certified Professional Cloud Architect",
    issuer: "Google Cloud",
    issue_date: "2023-01-01",
    expiry_date: null,
    credential_url: "https://example.com/cert2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockProjects: Project[] = [
  {
    id: "project1",
    user_id: "user123",
    title: "E-commerce Platform",
    description: "Developed a fully functional e-commerce platform using React, Node.js, and MongoDB.",
    technologies: ["React", "Node.js", "MongoDB"],
    start_date: "2022-01-01",
    end_date: "2022-06-01",
    project_url: "https://example.com/project1",
    image_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "project2",
    user_id: "user123",
    title: "Mobile Task Manager",
    description: "Created a mobile task manager app using React Native.",
    technologies: ["React Native", "Firebase"],
    start_date: "2023-01-01",
    end_date: null,
    project_url: null,
    image_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockWorkExperiences: WorkExperience[] = [
  {
    id: "exp1",
    user_id: "user123",
    company: "TechCorp Inc",
    position: "Software Engineer",
    location: "San Francisco, CA",
    start_date: "2021-01-01",
    end_date: "2022-01-01",
    description: "Developed and maintained web applications using React and Node.js.",
    technologies: ["React", "Node.js", "JavaScript"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "exp2",
    user_id: "user123",
    company: "Innovate Solutions",
    position: "Frontend Developer",
    location: "New York, NY",
    start_date: "2022-01-01",
    end_date: null,
    description: "Worked on the frontend development of a large-scale e-commerce platform.",
    technologies: ["React", "Redux", "TypeScript"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockProfiles: Profile[] = [
  {
    id: "1",
    user_id: "user123",
    real_name: "Jane Smith",
    email: "jane.smith@example.com",
    prn: "PRN12345",
    cgpa: 8.7,
    profile_picture_url: null,
    bio: "Computer Science student interested in AI and machine learning.",
    college_name: "Engineering College of Technology",
    location: "Mumbai, India",
    linkedin_url: "https://linkedin.com/in/janesmith",
    github_url: "https://github.com/janesmith",
    leetcode_url: "https://leetcode.com/janesmith",
    hackerrank_url: "https://hackerrank.com/janesmith",
    geeksforgeeks_url: "https://geeksforgeeks.org/user/janesmith",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  },
];
