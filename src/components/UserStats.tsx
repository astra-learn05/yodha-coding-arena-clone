
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, Award, Check, Star } from "lucide-react";

interface UserStatsProps {
  solved: number;
  totalProblems: number;
  streak: number;
  rank: number;
  contributionPoints: number;
}

const UserStats = ({ solved, totalProblems, streak, rank, contributionPoints }: UserStatsProps) => {
  const solvedPercentage = Math.round((solved / totalProblems) * 100);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-500 font-normal flex items-center gap-2">
            <Check size={16} className="text-difficulty-easy" />
            Solved Problems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-bold">{solved}</span>
            <span className="text-xs text-gray-500">of {totalProblems}</span>
          </div>
          <Progress value={solvedPercentage} className="h-2" />
          <div className="mt-2 flex gap-3 text-xs">
            <div>
              <span className="inline-block w-2 h-2 rounded-full bg-difficulty-easy mr-1"></span>
              <span>Easy</span>
              <span className="ml-1 text-gray-500">15</span>
            </div>
            <div>
              <span className="inline-block w-2 h-2 rounded-full bg-difficulty-medium mr-1"></span>
              <span>Medium</span>
              <span className="ml-1 text-gray-500">12</span>
            </div>
            <div>
              <span className="inline-block w-2 h-2 rounded-full bg-difficulty-hard mr-1"></span>
              <span>Hard</span>
              <span className="ml-1 text-gray-500">8</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-500 font-normal flex items-center gap-2">
            <Star size={16} className="text-difficulty-medium" />
            Current Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{streak}</span>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded flex items-center">
              <ArrowUp size={12} className="mr-1" />
              2
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Keep it going! Solve a problem today to maintain your streak.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-500 font-normal flex items-center gap-2">
            <Award size={16} className="text-difficulty-hard" />
            Ranking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">#{rank}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {contributionPoints} contribution points (Top 5%)
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStats;
