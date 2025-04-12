
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Star } from "lucide-react";

interface UserStatsProps {
  solved: number;
  totalProblems: number;
  easyProblems: number;
  mediumProblems: number;
  hardProblems: number;
  streak: number;
}

const UserStats = ({ 
  solved, 
  totalProblems, 
  easyProblems, 
  mediumProblems, 
  hardProblems, 
  streak 
}: UserStatsProps) => {
  const solvedPercentage = Math.round((solved / totalProblems) * 100);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Progress value={solvedPercentage} className="h-2 mb-4" />
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <div>
                  <span className="inline-block w-2 h-2 rounded-full bg-difficulty-easy mr-1"></span>
                  <span className="text-xs">Easy</span>
                </div>
                <span className="text-xs text-gray-500">{easyProblems}</span>
              </div>
              <Progress value={(easyProblems / 15) * 100} className="h-1.5 bg-gray-100" indicatorClassName="bg-difficulty-easy" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <div>
                  <span className="inline-block w-2 h-2 rounded-full bg-difficulty-medium mr-1"></span>
                  <span className="text-xs">Medium</span>
                </div>
                <span className="text-xs text-gray-500">{mediumProblems}</span>
              </div>
              <Progress value={(mediumProblems / 12) * 100} className="h-1.5 bg-gray-100" indicatorClassName="bg-difficulty-medium" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <div>
                  <span className="inline-block w-2 h-2 rounded-full bg-difficulty-hard mr-1"></span>
                  <span className="text-xs">Hard</span>
                </div>
                <span className="text-xs text-gray-500">{hardProblems}</span>
              </div>
              <Progress value={(hardProblems / 8) * 100} className="h-1.5 bg-gray-100" indicatorClassName="bg-difficulty-hard" />
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
              +2
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Keep it going! Solve a problem today to maintain your streak.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStats;
