
export interface Problem {
  id: number;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  description: string;
  examples: Example[];
  constraints: string[];
  completed?: boolean;
  locked?: boolean;
  likes: number;
  dislikes: number;
  acceptance: string;
  frequency: number;
  companies: string[];
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export const problems: Problem[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "easy",
    category: "Arrays & Hashing",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
You may assume that each input would have exactly one solution, and you may not use the same element twice.
You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]"
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]"
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    completed: true,
    likes: 42853,
    dislikes: 1398,
    acceptance: "48.5%",
    frequency: 100,
    companies: ["Amazon", "Google", "Apple", "Microsoft"]
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "easy",
    category: "Stack",
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: "s = \"()\"",
        output: "true"
      },
      {
        input: "s = \"()[]{}\"",
        output: "true"
      },
      {
        input: "s = \"(]\"",
        output: "false"
      }
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    completed: false,
    likes: 14302,
    dislikes: 784,
    acceptance: "39.7%",
    frequency: 88,
    companies: ["Amazon", "Facebook", "Microsoft"]
  },
  {
    id: 3,
    title: "Merge Two Sorted Lists",
    difficulty: "easy",
    category: "Linked List",
    description: `You are given the heads of two sorted linked lists list1 and list2.
Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists.
Return the head of the merged linked list.`,
    examples: [
      {
        input: "list1 = [1,2,4], list2 = [1,3,4]",
        output: "[1,1,2,3,4,4]"
      },
      {
        input: "list1 = [], list2 = []",
        output: "[]"
      },
      {
        input: "list1 = [], list2 = [0]",
        output: "[0]"
      }
    ],
    constraints: [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 <= Node.val <= 100",
      "Both list1 and list2 are sorted in non-decreasing order."
    ],
    completed: false,
    likes: 12345,
    dislikes: 456,
    acceptance: "59.2%",
    frequency: 85,
    companies: ["Amazon", "Apple", "Google"]
  },
  {
    id: 4,
    title: "Maximum Subarray",
    difficulty: "medium",
    category: "Dynamic Programming",
    description: `Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.
A subarray is a contiguous part of an array.`,
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "[4,-1,2,1] has the largest sum = 6."
      },
      {
        input: "nums = [1]",
        output: "1"
      },
      {
        input: "nums = [5,4,-1,7,8]",
        output: "23"
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    completed: true,
    likes: 23456,
    dislikes: 987,
    acceptance: "49.5%",
    frequency: 77,
    companies: ["Google", "Amazon", "Microsoft"]
  },
  {
    id: 5,
    title: "3Sum",
    difficulty: "medium",
    category: "Arrays & Hashing",
    description: `Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.
Notice that the solution set must not contain duplicate triplets.`,
    examples: [
      {
        input: "nums = [-1,0,1,2,-1,-4]",
        output: "[[-1,-1,2],[-1,0,1]]",
        explanation: "The distinct triplets are [-1,0,1] and [-1,-1,2]. Notice that the order of the output and the order of the triplets does not matter."
      },
      {
        input: "nums = []",
        output: "[]"
      },
      {
        input: "nums = [0]",
        output: "[]"
      }
    ],
    constraints: [
      "0 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5"
    ],
    completed: false,
    likes: 19872,
    dislikes: 1876,
    acceptance: "31.3%",
    frequency: 92,
    companies: ["Facebook", "Amazon", "Microsoft"]
  },
  {
    id: 6,
    title: "Trapping Rain Water",
    difficulty: "hard",
    category: "Two Pointers",
    description: `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
    examples: [
      {
        input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        output: "6",
        explanation: "The elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped."
      },
      {
        input: "height = [4,2,0,3,2,5]",
        output: "9"
      }
    ],
    constraints: [
      "n == height.length",
      "1 <= n <= 2 * 10^4",
      "0 <= height[i] <= 10^5"
    ],
    completed: false,
    locked: true,
    likes: 21548,
    dislikes: 298,
    acceptance: "54.1%",
    frequency: 68,
    companies: ["Google", "Facebook", "Amazon"]
  },
  {
    id: 7,
    title: "Merge k Sorted Lists",
    difficulty: "hard",
    category: "Linked List",
    description: `You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.
Merge all the linked-lists into one sorted linked-list and return it.`,
    examples: [
      {
        input: "lists = [[1,4,5],[1,3,4],[2,6]]",
        output: "[1,1,2,3,4,4,5,6]",
        explanation: "The linked-lists are: [1->4->5, 1->3->4, 2->6]. Merging them into one sorted list: 1->1->2->3->4->4->5->6."
      },
      {
        input: "lists = []",
        output: "[]"
      },
      {
        input: "lists = [[]]",
        output: "[]"
      }
    ],
    constraints: [
      "k == lists.length",
      "0 <= k <= 10^4",
      "0 <= lists[i].length <= 500",
      "-10^4 <= lists[i][j] <= 10^4",
      "lists[i] is sorted in ascending order.",
      "The sum of lists[i].length won't exceed 10^4."
    ],
    locked: true,
    completed: false,
    likes: 13657,
    dislikes: 504,
    acceptance: "47.8%",
    frequency: 73,
    companies: ["Amazon", "Google", "Microsoft"]
  },
  {
    id: 8,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    category: "Sliding Window",
    description: `Given a string s, find the length of the longest substring without repeating characters.`,
    examples: [
      {
        input: "s = \"abcabcbb\"",
        output: "3",
        explanation: "The answer is \"abc\", with the length of 3."
      },
      {
        input: "s = \"bbbbb\"",
        output: "1",
        explanation: "The answer is \"b\", with the length of 1."
      },
      {
        input: "s = \"pwwkew\"",
        output: "3",
        explanation: "The answer is \"wke\", with the length of 3. Notice that the answer must be a substring, \"pwke\" is a subsequence and not a substring."
      }
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    completed: true,
    likes: 28765,
    dislikes: 1234,
    acceptance: "33.2%",
    frequency: 82,
    companies: ["Amazon", "Facebook", "Microsoft"]
  }
];
