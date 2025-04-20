
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Star, BookOpen, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { calculateProgressByDifficulty } from "@/services/learningPathService";
import { useParams, useSearchParams } from "react-router-dom";

interface UserStatsProps {
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
  learningPathProgress = [],
  completedTopics = []
}: UserStatsProps) => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const profileId = params.id;
  const prn = searchParams.get("prn") || params.prn;

  const { data: progressByDifficulty } = useQuery({
    queryKey: ['difficultyProgress', profileId, prn],
    queryFn: () => calculateProgressByDifficulty(profileId || ''),
    enabled: !!profileId
  });
  
  const easyStats = progressByDifficulty?.easy || { total: 0, completed: 0 };
  const mediumStats = progressByDifficulty?.medium || { total: 0, completed: 0 };
  const hardStats = progressByDifficulty?.hard || { total: 0, completed: 0 };
  const theoryStats = progressByDifficulty?.theory || { total: 0, completed: 0 };

  const totalProblems = easyStats.total + mediumStats.total + hardStats.total + theoryStats.total;
  const solved = easyStats.completed + mediumStats.completed + hardStats.completed + theoryStats.completed;
  
  const calculatePercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const solvedPercentage = calculatePercentage(solved, totalProblems);
  const easyPercentage = calculatePercentage(easyStats.completed, easyStats.total);
  const mediumPercentage = calculatePercentage(mediumStats.completed, mediumStats.total);
  const hardPercentage = calculatePercentage(hardStats.completed, hardStats.total);
  const theoryPercentage = calculatePercentage(theoryStats.completed, theoryStats.total);
  
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
                  {easyStats.completed} of {easyStats.total} ({easyPercentage}%)
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
                  {mediumStats.completed} of {mediumStats.total} ({mediumPercentage}%)
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
                  {hardStats.completed} of {hardStats.total} ({hardPercentage}%)
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
                  {theoryStats.completed} of {theoryStats.total} ({theoryPercentage}%)
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
