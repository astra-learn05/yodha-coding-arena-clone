import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Star, BookOpen, ExternalLink } from "lucide-react";

interface UserStatsProps {
  solved: number;
  totalProblems: number;
  easyProblems: number;
  mediumProblems: number;
  hardProblems: number;
  theoryProblems: number;
  learningPathProgress?: Array<{
    learningPath: {
      id: string;
      title: string;
      description: string;
      difficulty: string;
    };
    progress: number;
  }>;
  completedTopics?: string[];
}

const UserStats = ({ 
  solved, 
  totalProblems, 
  easyProblems, 
  mediumProblems, 
  hardProblems,
  theoryProblems,
  learningPathProgress = [],
  completedTopics = []
}: UserStatsProps) => {
  const solvedPercentage = Math.round((solved / totalProblems) * 100) || 0;
  
  const calculatePercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / (total)) * 100) : 0;
  };

  const easyPercentage = calculatePercentage(easyProblems, totalProblems * 0.4);
  const mediumPercentage = calculatePercentage(mediumProblems, totalProblems * 0.4);
  const hardPercentage = calculatePercentage(hardProblems, totalProblems * 0.2);
  const theoryPercentage = calculatePercentage(theoryProblems, totalProblems * 0.2);
  
  return (
    <div className="grid grid-cols-1 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-500 font-normal flex items-center gap-2">
            <Check size={16} className="text-green-500" />
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
                  <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1"></span>
                  <span className="text-xs">Easy</span>
                </div>
                <span className="text-xs text-gray-500">
                  {easyProblems} of {Math.round(totalProblems * 0.4)} ({easyPercentage}%)
                </span>
              </div>
              <Progress 
                value={easyPercentage} 
                className="h-1.5 bg-gray-100" 
                indicatorClassName="bg-green-400" 
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <div>
                  <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-1"></span>
                  <span className="text-xs">Medium</span>
                </div>
                <span className="text-xs text-gray-500">
                  {mediumProblems} of {Math.round(totalProblems * 0.4)} ({mediumPercentage}%)
                </span>
              </div>
              <Progress 
                value={mediumPercentage} 
                className="h-1.5 bg-gray-100" 
                indicatorClassName="bg-yellow-400" 
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <div>
                  <span className="inline-block w-2 h-2 rounded-full bg-red-400 mr-1"></span>
                  <span className="text-xs">Hard</span>
                </div>
                <span className="text-xs text-gray-500">
                  {hardProblems} of {Math.round(totalProblems * 0.2)} ({hardPercentage}%)
                </span>
              </div>
              <Progress 
                value={hardPercentage} 
                className="h-1.5 bg-gray-100" 
                indicatorClassName="bg-red-400" 
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <div>
                  <span className="inline-block w-2 h-2 rounded-full bg-purple-400 mr-1"></span>
                  <span className="text-xs">Theory</span>
                </div>
                <span className="text-xs text-gray-500">
                  {theoryProblems} of {Math.round(totalProblems * 0.2)} ({theoryPercentage}%)
                </span>
              </div>
              <Progress 
                value={theoryPercentage} 
                className="h-1.5 bg-gray-100" 
                indicatorClassName="bg-purple-400" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {learningPathProgress.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal flex items-center gap-2">
              <ExternalLink size={16} className="text-purple-500" />
              Learning Paths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {learningPathProgress.map((path) => (
                <div key={path.learningPath.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{path.learningPath.title}</span>
                    <span className="text-xs text-gray-500">{path.progress}%</span>
                  </div>
                  <Progress 
                    value={path.progress} 
                    className="h-2 bg-gray-100" 
                    indicatorClassName={`
                      ${path.learningPath.difficulty.toLowerCase() === 'easy' ? 'bg-green-400' : 
                        path.learningPath.difficulty.toLowerCase() === 'medium' ? 'bg-yellow-400' : 
                        'bg-red-400'}
                    `} 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-500 font-normal flex items-center gap-2">
            <BookOpen size={16} className="text-blue-500" />
            Topics Covered
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedTopics.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {completedTopics.map((topic, index) => (
                <span 
                  key={index} 
                  className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full"
                >
                  {topic}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No topics completed yet. Complete all questions in a topic to see it here.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStats;
