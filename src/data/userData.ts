
export interface UserData {
  username: string;
  realName: string;
  bio: string;
  location: string;
  joinDate: string;
  stats: {
    solved: number;
    totalProblems: number;
    easyProblems: number;
    mediumProblems: number;
    hardProblems: number;
    streak: number;
    rank: number;
    contributionPoints: number;
  };
  recentActivity: Activity[];
  submissions: Submission[];
}

export interface Activity {
  id: number;
  type: "solve" | "comment" | "submit";
  problemId: number;
  problemTitle: string;
  timestamp: string;
  description: string;
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

export const userData: UserData = {
  username: "codemaster",
  realName: "Jane Doe",
  bio: "Software engineer and algorithm enthusiast. I love solving complex problems and optimizing solutions.",
  location: "San Francisco, CA",
  joinDate: "Jan 2024",
  stats: {
    solved: 35,
    totalProblems: 2437,
    easyProblems: 15,
    mediumProblems: 12,
    hardProblems: 8,
    streak: 7,
    rank: 12453,
    contributionPoints: 346
  },
  recentActivity: [
    {
      id: 1,
      type: "solve",
      problemId: 1,
      problemTitle: "Two Sum",
      timestamp: "2 hours ago",
      description: "Solved problem using HashMap approach"
    },
    {
      id: 2,
      type: "comment",
      problemId: 5,
      problemTitle: "3Sum",
      timestamp: "1 day ago",
      description: "Commented on '3Sum' solution discussion"
    },
    {
      id: 3,
      type: "submit",
      problemId: 4,
      problemTitle: "Maximum Subarray",
      timestamp: "2 days ago",
      description: "Submitted a solution in Python"
    },
    {
      id: 4,
      type: "solve",
      problemId: 8,
      problemTitle: "Longest Substring Without Repeating Characters",
      timestamp: "4 days ago",
      description: "Solved using sliding window technique"
    }
  ],
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
  ]
};
