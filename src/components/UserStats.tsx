
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Star, BookOpen, ExternalLink, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { calculateProgressByDifficulty } from "@/services/learningPathService";
import { useParams, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

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
  const [animateStats, setAnimateStats] = useState(false);

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

  const difficultyColors = {
    easy: "from-green-300 to-green-500",
    medium: "from-yellow-300 to-yellow-500",
    hard: "from-red-300 to-red-500",
    theory: "from-purple-300 to-purple-500",
    total: "from-blue-300 to-blue-500"
  };

  useEffect(() => {
    // Add a small delay before starting animations
    const timer = setTimeout(() => {
      setAnimateStats(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-blue-800">
            <Award size={20} className="text-blue-600" />
            Your Coding Journey
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-3 px-6 rounded-lg border border-blue-100 shadow-sm">
              <h3 className={`text-3xl font-bold text-blue-700 ${animateStats ? 'animate-fade-in' : 'opacity-0'}`}>{solved}</h3>
              <p className="text-sm text-blue-600">Problems Solved</p>
            </div>
            <div className="text-right bg-gradient-to-br from-green-50 to-emerald-50 py-3 px-6 rounded-lg border border-green-100 shadow-sm">
              <p className={`text-2xl font-medium text-green-700 ${animateStats ? 'animate-fade-in' : 'opacity-0'}`}>
                {Math.round((solved/totalProblems) * 100)}%
              </p>
              <p className="text-sm text-green-600">Completion</p>
            </div>
          </div>

          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden mb-8 shadow-inner">
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${difficultyColors.total}`}
              style={{ width: animateStats ? `${solvedPercentage}%` : '0%', transition: 'width 1.5s ease-in-out' }}
            ></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Easy Problems */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl shadow-sm border border-green-100 transform transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-700 flex items-center">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 mr-2"></span>
                  Easy
                </h4>
                <span className="text-sm font-bold text-green-600">{easyPercentage}%</span>
              </div>
              <div className="mb-1 flex justify-between items-center text-xs text-gray-500">
                <span>Progress</span>
                <span>{easyStats.completed} of {easyStats.total}</span>
              </div>
              <div className="h-2 w-full bg-white/70 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-green-300 to-green-500 rounded-full"
                  style={{ width: animateStats ? `${easyPercentage}%` : '0%', transition: 'width 1.2s ease-in-out' }}
                ></div>
              </div>
            </div>

            {/* Medium Problems */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-xl shadow-sm border border-yellow-100 transform transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-700 flex items-center">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 mr-2"></span>
                  Medium
                </h4>
                <span className="text-sm font-bold text-yellow-600">{mediumPercentage}%</span>
              </div>
              <div className="mb-1 flex justify-between items-center text-xs text-gray-500">
                <span>Progress</span>
                <span>{mediumStats.completed} of {mediumStats.total}</span>
              </div>
              <div className="h-2 w-full bg-white/70 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full"
                  style={{ width: animateStats ? `${mediumPercentage}%` : '0%', transition: 'width 1.4s ease-in-out' }}
                ></div>
              </div>
            </div>

            {/* Hard Problems */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl shadow-sm border border-red-100 transform transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-700 flex items-center">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-r from-red-400 to-red-600 mr-2"></span>
                  Hard
                </h4>
                <span className="text-sm font-bold text-red-600">{hardPercentage}%</span>
              </div>
              <div className="mb-1 flex justify-between items-center text-xs text-gray-500">
                <span>Progress</span>
                <span>{hardStats.completed} of {hardStats.total}</span>
              </div>
              <div className="h-2 w-full bg-white/70 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-red-300 to-red-500 rounded-full"
                  style={{ width: animateStats ? `${hardPercentage}%` : '0%', transition: 'width 1.6s ease-in-out' }}
                ></div>
              </div>
            </div>

            {/* Theory Problems */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl shadow-sm border border-purple-100 transform transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-700 flex items-center">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 mr-2"></span>
                  Theory
                </h4>
                <span className="text-sm font-bold text-purple-600">{theoryPercentage}%</span>
              </div>
              <div className="mb-1 flex justify-between items-center text-xs text-gray-500">
                <span>Progress</span>
                <span>{theoryStats.completed} of {theoryStats.total}</span>
              </div>
              <div className="h-2 w-full bg-white/70 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-purple-300 to-purple-500 rounded-full"
                  style={{ width: animateStats ? `${theoryPercentage}%` : '0%', transition: 'width 1.8s ease-in-out' }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {learningPathProgress.length > 0 && (
        <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-2 bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-800">
              <ExternalLink size={20} className="text-indigo-600" />
              Learning Paths
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {learningPathProgress.map((path) => (
                <div 
                  key={path.learningPath.id} 
                  className={cn(
                    "p-5 rounded-lg border transition-all duration-300 shadow-sm hover:shadow-md transform hover:translate-y-[-2px]",
                    path.learningPath.difficulty.toLowerCase() === 'easy' 
                      ? "border-green-200 bg-gradient-to-br from-green-50 to-white" 
                    : path.learningPath.difficulty.toLowerCase() === 'medium' 
                      ? "border-yellow-200 bg-gradient-to-br from-yellow-50 to-white" 
                    : "border-red-200 bg-gradient-to-br from-red-50 to-white"
                  )}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-800">{path.learningPath.title}</h4>
                    <span className={cn(
                      "text-xs font-semibold px-2 py-1 rounded-full",
                      path.learningPath.difficulty.toLowerCase() === 'easy' 
                        ? "bg-green-100 text-green-700" 
                      : path.learningPath.difficulty.toLowerCase() === 'medium' 
                        ? "bg-yellow-100 text-yellow-700" 
                        : "bg-red-100 text-red-700"
                    )}>
                      {path.learningPath.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{path.learningPath.description}</p>
                  
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-gray-600">Completion</span>
                    <span className={cn(
                      "font-semibold",
                      path.learningPath.difficulty.toLowerCase() === 'easy'
                        ? "text-green-700" 
                      : path.learningPath.difficulty.toLowerCase() === 'medium' 
                        ? "text-yellow-700" 
                        : "text-red-700"
                    )}>
                      {path.progress}%
                    </span>
                  </div>
                  
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={cn(
                        "h-full rounded-full",
                        path.learningPath.difficulty.toLowerCase() === 'easy'
                          ? "bg-gradient-to-r from-green-300 to-green-500" 
                        : path.learningPath.difficulty.toLowerCase() === 'medium' 
                          ? "bg-gradient-to-r from-yellow-300 to-yellow-500" 
                          : "bg-gradient-to-r from-red-300 to-red-500"
                      )}
                      style={{ 
                        width: animateStats ? `${path.progress}%` : '0%', 
                        transition: 'width 1.5s ease-in-out' 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-2 bg-gradient-to-r from-cyan-50 to-blue-50 border-b">
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-cyan-800">
            <BookOpen size={20} className="text-cyan-600" />
            Topics Covered
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {completedTopics.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {completedTopics.map((topic, index) => (
                <div 
                  key={index} 
                  className={`text-sm px-3 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-full border border-blue-200 shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] animate-fade-in opacity-0`}
                  style={{ 
                    animationDelay: `${index * 0.05}s`, 
                    animationFillMode: 'forwards'
                  }}
                >
                  <span className="flex items-center">
                    <Check size={12} className="text-blue-500 mr-1.5" />
                    {topic}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100 mt-3">
              <div className="w-16 h-16 rounded-full bg-white/80 shadow-sm flex items-center justify-center mb-4 animate-pulse">
                <BookOpen size={30} className="text-blue-300" />
              </div>
              <p className="text-gray-700 mb-2 font-medium">
                No topics completed yet
              </p>
              <p className="text-sm text-gray-500 max-w-xs">
                Complete all questions in a topic to see it here. Topics help track your learning progress.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStats;
