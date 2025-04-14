
export interface UserData {
  username: string;
  realName: string;
  cgpa: number;
  stats: {
    solved: number;
    totalProblems: number;
    easyProblems: number;
    mediumProblems: number;
    hardProblems: number;
    streak: number;
    rank?: number; 
    achievements?: number;
  };
  submissions: Submission[];
  recentActivity?: RecentActivity[];
  badges?: UserBadge[];
  certificates?: Certificate[];
  projects?: Project[];
  workExperience?: WorkExperience[];
}

export interface Submission {
  id: number;
  problemId: number;
  problemTitle: string;
  status: "Accepted" | "Wrong Answer" | "Time Limit Exceeded" | "Runtime Error";
  language: string;
  runtime: string;
  memory: string;
  timestamp: string;
}

export interface RecentActivity {
  id: number;
  type: "solve" | "comment" | "submission";
  problemId: number;
  problemTitle: string;
  description: string;
  timestamp: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  background_color: string;
  text_color: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
  projectUrl?: string;
  imageUrl?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies?: string[];
}

export const userData: UserData = {
  username: "codemaster",
  realName: "Jane Doe",
  cgpa: 9.2,
  stats: {
    solved: 35,
    totalProblems: 2437,
    easyProblems: 15,
    mediumProblems: 12,
    hardProblems: 8,
    streak: 7,
    rank: 42,
    achievements: 10
  },
  submissions: [
    {
      id: 1,
      problemId: 1,
      problemTitle: "Two Sum",
      status: "Accepted",
      language: "JavaScript",
      runtime: "58ms",
      memory: "42.1MB",
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      problemId: 4,
      problemTitle: "Maximum Subarray",
      status: "Accepted",
      language: "Python",
      runtime: "124ms",
      memory: "28.3MB",
      timestamp: "2 days ago"
    },
    {
      id: 3,
      problemId: 5,
      problemTitle: "3Sum",
      status: "Time Limit Exceeded",
      language: "Java",
      runtime: "N/A",
      memory: "N/A",
      timestamp: "3 days ago"
    },
    {
      id: 4,
      problemId: 5,
      problemTitle: "3Sum",
      status: "Accepted",
      language: "Java",
      runtime: "278ms",
      memory: "46.8MB",
      timestamp: "3 days ago"
    },
    {
      id: 5,
      problemId: 8,
      problemTitle: "Longest Substring Without Repeating Characters",
      status: "Accepted",
      language: "JavaScript",
      runtime: "65ms",
      memory: "45.2MB",
      timestamp: "4 days ago"
    }
  ],
  recentActivity: [
    {
      id: 1,
      type: "solve",
      problemId: 1,
      problemTitle: "Two Sum",
      description: "Solved the problem in JavaScript",
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      type: "comment",
      problemId: 4,
      problemTitle: "Maximum Subarray",
      description: "Commented on solution approach",
      timestamp: "2 days ago"
    },
    {
      id: 3,
      type: "submission",
      problemId: 5,
      problemTitle: "3Sum",
      description: "Submitted a Java solution",
      timestamp: "3 days ago"
    }
  ],
  badges: [
    {
      id: "1",
      user_id: "user123",
      badge_id: "badge1",
      earned_at: "2023-01-01T00:00:00Z",
      badge: {
        id: "badge1",
        name: "Bronze Coder",
        description: "Completed all beginner learning path questions",
        icon_name: "Award",
        background_color: "bg-amber-100",
        text_color: "text-amber-800"
      }
    },
    {
      id: "2",
      user_id: "user123",
      badge_id: "badge2",
      earned_at: "2023-02-01T00:00:00Z",
      badge: {
        id: "badge2",
        name: "Silver Coder",
        description: "Completed all intermediate learning path questions",
        icon_name: "Trophy",
        background_color: "bg-gray-200",
        text_color: "text-gray-800"
      }
    }
  ],
  certificates: [
    {
      id: "1",
      title: "AWS Solutions Architect Associate",
      issuer: "Amazon Web Services",
      issueDate: "2023-05-15",
      expiryDate: "2026-05-15",
      credentialUrl: "https://aws.amazon.com/certification/verify"
    },
    {
      id: "2",
      title: "Full Stack Web Development",
      issuer: "Udemy",
      issueDate: "2022-12-10",
      credentialUrl: "https://udemy.com/certificate/123456"
    }
  ],
  projects: [
    {
      id: "1",
      title: "E-commerce Platform",
      description: "A full-stack e-commerce platform with product catalog, shopping cart, and payment processing",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      startDate: "2023-01-01",
      endDate: "2023-04-15",
      projectUrl: "https://github.com/janedoe/ecommerce"
    },
    {
      id: "2",
      title: "Weather App",
      description: "A weather forecast application that shows current and weekly forecasts for any location",
      technologies: ["JavaScript", "HTML", "CSS", "OpenWeather API"],
      startDate: "2022-09-01",
      endDate: "2022-10-30",
      projectUrl: "https://weather-app-demo.vercel.app"
    }
  ],
  workExperience: [
    {
      id: "1",
      company: "TechCorp Inc",
      position: "Software Engineer",
      location: "San Francisco, CA",
      startDate: "2022-01-15",
      endDate: "2023-06-30",
      description: "Developed and maintained web applications, collaborated with cross-functional teams, and implemented CI/CD pipelines",
      technologies: ["React", "TypeScript", "Node.js", "AWS"]
    },
    {
      id: "2",
      company: "StartupX",
      position: "Frontend Developer Intern",
      location: "Remote",
      startDate: "2021-05-01",
      endDate: "2021-12-31",
      description: "Designed and implemented user interfaces for web applications, fixed bugs, and optimized performance",
      technologies: ["JavaScript", "React", "CSS", "Git"]
    }
  ]
};
