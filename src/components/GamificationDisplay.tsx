
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Coins, Trophy, Target } from 'lucide-react';
import { GamificationData, getLevelInfo } from '@/services/gamificationService';

interface GamificationDisplayProps {
  gamificationData: GamificationData;
}

const GamificationDisplay = ({ gamificationData }: GamificationDisplayProps) => {
  const currentLevelInfo = getLevelInfo(gamificationData.current_level);
  const nextLevelInfo = getLevelInfo(gamificationData.current_level + 1);
  const progressPercentage = (gamificationData.coins_in_current_level / 100) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Coins */}
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
            <Coins className="h-5 w-5" />
            Total Coins
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600">
            {gamificationData.total_coins}
          </div>
        </CardContent>
      </Card>

      {/* Current Level */}
      <Card className={`bg-gradient-to-br ${currentLevelInfo.color} text-white`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Current Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            Level {gamificationData.current_level}
          </div>
          <Badge variant="secondary" className="mt-1 bg-white/20 text-white">
            {currentLevelInfo.name}
          </Badge>
        </CardContent>
      </Card>

      {/* Progress to Next Level */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
            <Target className="h-5 w-5" />
            Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-blue-600">
              <span>{gamificationData.coins_in_current_level}/100 coins</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="text-xs text-blue-500">
              Next: {nextLevelInfo?.name || 'Max Level Reached'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationDisplay;
