
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, CheckCircle } from 'lucide-react';

interface LearningPathProgress {
  id: string;
  name: string;
  completed: number;
  total: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const ProgressVisualization = () => {
  // Mock data - replace with actual data from your learning paths
  const learningPaths: LearningPathProgress[] = [
    { id: '1', name: 'Data Structures', completed: 8, total: 15, difficulty: 'medium' },
    { id: '2', name: 'Algorithms', completed: 5, total: 12, difficulty: 'hard' },
    { id: '3', name: 'Dynamic Programming', completed: 3, total: 10, difficulty: 'hard' },
    { id: '4', name: 'Arrays & Strings', completed: 12, total: 12, difficulty: 'easy' },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500'; 
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyBadgeVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'default';
      case 'medium': return 'secondary';
      case 'hard': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress Summary */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <TrendingUp className="h-5 w-5" />
            Learning Path Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {learningPaths.filter(path => path.completed === path.total).length}
              </div>
              <div className="text-sm text-indigo-500">Completed Paths</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {learningPaths.length - learningPaths.filter(path => path.completed === path.total).length}
              </div>
              <div className="text-sm text-purple-500">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">
                {learningPaths.reduce((acc, path) => acc + path.completed, 0)}
              </div>
              <div className="text-sm text-pink-500">Total Solved</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Learning Path Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Individual Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {learningPaths.map((path) => {
              const progressPercentage = (path.completed / path.total) * 100;
              const isCompleted = path.completed === path.total;
              
              return (
                <div key={path.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-800">{path.name}</h4>
                      {isCompleted && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getDifficultyBadgeVariant(path.difficulty)}>
                        {path.difficulty}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {path.completed}/{path.total}
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={progressPercentage} 
                    className="h-2"
                  />
                  <div className="text-xs text-gray-500">
                    {Math.round(progressPercentage)}% complete
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressVisualization;
