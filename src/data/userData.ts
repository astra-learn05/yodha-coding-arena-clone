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
  };
  submissions: Submission[];
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
  cgpa: 9.2,
  stats: {
    solved: 35,
    totalProblems: 2437,
    easyProblems: 15,
    mediumProblems: 12,
    hardProblems: 8,
    streak: 7
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
  ]
};
