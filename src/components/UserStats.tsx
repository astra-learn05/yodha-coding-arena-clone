
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Star, BookOpen } from "lucide-react";
import { problems } from "@/data/problems";

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
  
  // Get unique topics from the problems data
  const topics = [...new Set(problems.map(problem => problem.category))];
  
  return (
    <div className="grid grid-cols-1 gap-4">
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
              <Progress 
                value={(easyProblems / (totalProblems * 0.4)) * 100} 
                className="h-1.5 bg-gray-100" 
                indicatorClassName="bg-difficulty-easy" 
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <div>
                  <span className="inline-block w-2 h-2 rounded-full bg-difficulty-medium mr-1"></span>
                  <span className="text-xs">Medium</span>
                </div>
                <span className="text-xs text-gray-500">{mediumProblems}</span>
              </div>
              <Progress 
                value={(mediumProblems / (totalProblems * 0.4)) * 100} 
                className="h-1.5 bg-gray-100" 
                indicatorClassName="bg-difficulty-medium" 
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <div>
                  <span className="inline-block w-2 h-2 rounded-full bg-difficulty-hard mr-1"></span>
                  <span className="text-xs">Hard</span>
                </div>
                <span className="text-xs text-gray-500">{hardProblems}</span>
              </div>
              <Progress 
                value={(hardProblems / (totalProblems * 0.2)) * 100} 
                className="h-1.5 bg-gray-100" 
                indicatorClassName="bg-difficulty-hard" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-500 font-normal flex items-center gap-2">
            <Star size={16} className="text-amber-400" />
            Current Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-amber-500">{streak}</span>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-md flex items-center font-medium">
              +2
            </span>
          </div>
          <div className="mt-3 flex gap-1.5">
            {[...Array(7)].map((_, index) => (
              <div 
                key={index} 
                className={`h-2 w-full rounded-full ${index < streak % 7 ? 'bg-amber-400' : 'bg-gray-200'}`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Keep it going! Solve a problem today to maintain your streak.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-500 font-normal flex items-center gap-2">
            <BookOpen size={16} className="text-blue-500" />
            Topics Covered
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic, index) => (
              <span 
                key={index} 
                className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full"
              >
                {topic}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStats;
