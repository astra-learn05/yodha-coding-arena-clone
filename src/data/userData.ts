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
  ]
};
