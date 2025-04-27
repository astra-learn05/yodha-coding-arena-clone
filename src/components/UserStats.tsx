
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, BookOpen, ExternalLink, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { calculateProgressByDifficulty } from "@/services/learningPathService";
import { useParams, useSearchParams } from "react-router-dom";
import CircularProgress from "./CircularProgress";
import { Progress } from "@/components/ui/progress";

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
    <div className="grid grid-cols-1 gap-6">
      <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-2 border-b bg-gray-50/50">
          <CardTitle className="text-md font-medium flex items-center gap-2 text-gray-700">
            <Zap size={18} className="text-yodha-primary" />
            Problem Solving Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <span className="text-3xl font-bold text-gray-800">{solved}</span>
              <span className="text-gray-500 ml-2 text-sm">of {totalProblems} problems solved</span>
            </div>
            <div className="bg-gray-50 px-4 py-2 rounded-full">
              <span className="text-xl font-semibold text-yodha-primary">{solvedPercentage}%</span>
              <span className="text-xs text-gray-500 ml-1">completion</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <CircularProgress
              value={easyPercentage}
              label="Easy"
              total={easyStats.total}
              completed={easyStats.completed}
              strokeColor="var(--difficulty-easy)"
              className="hover:scale-105 transition-transform"
            />
            
            <CircularProgress
              value={mediumPercentage}
              label="Medium"
              total={mediumStats.total}
              completed={mediumStats.completed}
              strokeColor="var(--difficulty-medium)"
              className="hover:scale-105 transition-transform"
            />
            
            <CircularProgress
              value={hardPercentage}
              label="Hard"
              total={hardStats.total}
              completed={hardStats.completed}
              strokeColor="var(--difficulty-hard)"
              className="hover:scale-105 transition-transform"
            />
            
            <CircularProgress
              value={theoryPercentage}
              label="Theory"
              total={theoryStats.total}
              completed={theoryStats.completed}
              strokeColor="#9b87f5"
              className="hover:scale-105 transition-transform"
            />
          </div>
        </CardContent>
      </Card>
      
      {learningPathProgress.length > 0 && (
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-2 border-b bg-gray-50/50">
            <CardTitle className="text-md font-medium flex items-center gap-2 text-gray-700">
              <ExternalLink size={18} className="text-purple-500" />
              Learning Paths
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {learningPathProgress.map((path) => (
                <div key={path.learningPath.id} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-yodha-primary transition-colors">{path.learningPath.title}</span>
                      <p className="text-xs text-gray-500 mt-0.5">{path.learningPath.description.slice(0, 60)}{path.learningPath.description.length > 60 ? '...' : ''}</p>
                    </div>
                    <span className="text-sm font-bold px-3 py-1.5 rounded-full bg-gray-50 text-gray-700">{path.progress}%</span>
                  </div>
                  <Progress 
                    value={path.progress} 
                    className="h-2 bg-gray-100" 
                    indicatorClassName={`
                      ${path.learningPath.difficulty.toLowerCase() === 'easy' ? 'bg-difficulty-easy' : 
                        path.learningPath.difficulty.toLowerCase() === 'medium' ? 'bg-difficulty-medium' : 
                        'bg-difficulty-hard'}
                    `} 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-2 border-b bg-gray-50/50">
          <CardTitle className="text-md font-medium flex items-center gap-2 text-gray-700">
            <BookOpen size={18} className="text-blue-500" />
            Topics Mastered
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {completedTopics.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {completedTopics.map((topic, index) => (
                <span 
                  key={index} 
                  className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors cursor-default"
                >
                  {topic}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <BookOpen size={24} className="text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                No topics completed yet. Complete all questions in a topic to see it here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStats;
