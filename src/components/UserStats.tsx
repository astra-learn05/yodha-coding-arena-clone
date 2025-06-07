import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Target, 
  CheckCircle, 
  Clock, 
  BarChart3, 
  TrendingUp,
  BookOpen,
  Star,
  Zap,
  Brain,
  Award,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { autoLogin } from "@/services/autoLoginService";

interface UserStatsProps {
  solved: number;
  totalProblems: number;
  easyProblems: number;
  mediumProblems: number;
  hardProblems: number;
  theoryProblems: number;
  learningPathProgress: {
    pathName: string;
    totalTopics: number;
    completedTopics: number;
  }[];
  completedTopics: string[];
}

const calculatePercentage = (solved: number, total: number): number => {
  if (total === 0) return 0;
  return (solved / total) * 100;
};

const UserStats = ({ 
  solved, 
  totalProblems, 
  easyProblems, 
  mediumProblems, 
  hardProblems, 
  theoryProblems,
  learningPathProgress,
  completedTopics 
}: UserStatsProps) => {
  const [isAutoLoginLoading, setIsAutoLoginLoading] = useState(false);

  const handleAstraClick = async () => {
    setIsAutoLoginLoading(true);
    try {
      // Get the current user's ID - you might need to adjust this based on your auth implementation
      const userId = "1"; // Replace with actual user ID logic
      const redirectUrl = await autoLogin(userId);
      
      // Redirect to the returned URL
      window.open(redirectUrl, '_blank');
    } catch (error) {
      console.error('Auto-login failed:', error);
      toast.error('Failed to connect to Astra. Please try again.');
    } finally {
      setIsAutoLoginLoading(false);
    }
  };

  const overallProgress = calculatePercentage(solved, totalProblems);
  const easyProgress = calculatePercentage(easyProblems, totalProblems);
  const mediumProgress = calculatePercentage(mediumProblems, totalProblems);
  const hardProgress = calculatePercentage(hardProblems, totalProblems);
  const theoryProgress = calculatePercentage(theoryProblems, totalProblems);

  return (
    <div className="space-y-6">
      {/* Quick Access Section */}
      <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b">
          <CardTitle className="text-xl font-bold text-purple-800 flex items-center gap-2">
            <Zap size={20} className="text-purple-600" />
            Quick Access
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              onClick={handleAstraClick}
              disabled={isAutoLoginLoading}
              className="h-20 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center gap-2"
            >
              <div className="flex items-center gap-2">
                <Star size={18} />
                <span className="font-semibold">Astra</span>
              </div>
              {isAutoLoginLoading ? (
                <span className="text-xs opacity-80">Connecting...</span>
              ) : (
                <ChevronRight size={14} className="opacity-70" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Overall Progress Section */}
      <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
          <CardTitle className="text-xl font-bold text-blue-800 flex items-center gap-2">
            <Trophy size={20} className="text-blue-600" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Problems Solved</span>
              <span className="font-semibold text-blue-600">{solved} / {totalProblems}</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 text-gray-700">
                  <Target size={16} className="text-blue-500" />
                  <span>Easy</span>
                </div>
                <span className="font-semibold text-blue-600">{easyProblems}</span>
              </div>
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 text-gray-700">
                  <Brain size={16} className="text-blue-500" />
                  <span>Medium</span>
                </div>
                <span className="font-semibold text-blue-600">{mediumProblems}</span>
              </div>
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 text-gray-700">
                  <Award size={16} className="text-blue-500" />
                  <span>Hard</span>
                </div>
                <span className="font-semibold text-blue-600">{hardProblems}</span>
              </div>
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 text-gray-700">
                  <BookOpen size={16} className="text-blue-500" />
                  <span>Theory</span>
                </div>
                <span className="font-semibold text-blue-600">{theoryProblems}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Path Progress Section */}
      <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-teal-50 border-b">
          <CardTitle className="text-xl font-bold text-green-800 flex items-center gap-2">
            <TrendingUp size={20} className="text-green-600" />
            Learning Path Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {learningPathProgress.map((path, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{path.pathName}</span>
                  <span className="font-semibold text-green-600">{path.completedTopics} / {path.totalTopics}</span>
                </div>
                <Progress value={calculatePercentage(path.completedTopics, path.totalTopics)} className="h-2" />
              </div>
            ))}
            {learningPathProgress.length === 0 && (
              <div className="text-center text-gray-500">No learning paths in progress</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Completed Topics Section */}
      <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-3 bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
          <CardTitle className="text-xl font-bold text-orange-800 flex items-center gap-2">
            <CheckCircle size={20} className="text-orange-600" />
            Completed Topics
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {completedTopics.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {completedTopics.map((topic, index) => (
                <Badge key={index} variant="secondary">{topic}</Badge>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No topics completed yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStats;
