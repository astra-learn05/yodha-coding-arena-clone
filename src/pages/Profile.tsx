
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge as UiBadge } from "@/components/ui/badge";
import UserStats from "@/components/UserStats";
import { Award, Code, Brain, Zap, Trophy } from "lucide-react";
import { toast } from "sonner";
import { getCurrentUser } from "@/services/authService";
import PlatformButtons from "@/components/PlatformButtons";
import ProfileHeader from "@/components/ProfileHeader";

import {
  getProfileById, 
  getUserBadges,
  getUserSkills,
  Badge
} from "@/services/profileService";

import {
  getCompletedTopics,
  calculateLearningPathProgress,
  calculateProgressByDifficulty
} from "@/services/learningPathService";

import {
  checkAndAwardPathBadges
} from "@/services/badgeService";

import { SkillsSection } from "@/components/ProfileSections";

const ProfilePage = () => {
  const user = getCurrentUser();
  
  // if (!user) {
  //   return null; // This should be handled by ProtectedRoute
  // }

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user.id],
    queryFn: () => getProfileById(user.id)
  });

  const { data: badges = [], refetch: refetchBadges } = useQuery({
    queryKey: ['badges', user.id],
    queryFn: () => getUserBadges(user.id)
  });

  const { data: completedTopics = [] } = useQuery({
    queryKey: ['completedTopics', user.id],
    queryFn: () => getCompletedTopics(user.id)
  });

  const { data: learningPathProgressData = [] } = useQuery({
    queryKey: ['learningPathProgress', user.id],
    queryFn: () => calculateLearningPathProgress(user.id)
  });

  const { data: difficultyProgress } = useQuery({
    queryKey: ['difficultyProgress', user.id],
    queryFn: () => calculateProgressByDifficulty(user.id)
  });

  const { data: skills = [] } = useQuery({
    queryKey: ['skills', user.id],
    queryFn: () => getUserSkills(user.id)
  });

  useEffect(() => {
    if (user.id && learningPathProgressData?.length > 0) {
      const awardBadges = async () => {
        await checkAndAwardPathBadges(user.id);
        refetchBadges();
      };
      
      awardBadges();
    }
  }, [user.id, learningPathProgressData, refetchBadges]);

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const statsData = {
    solved: difficultyProgress ? 
      difficultyProgress.easy.completed + 
      difficultyProgress.medium.completed + 
      difficultyProgress.hard.completed : 0,
    totalProblems: difficultyProgress ? 
      difficultyProgress.easy.total + 
      difficultyProgress.medium.total + 
      difficultyProgress.hard.total : 0,
    easyProblems: difficultyProgress?.easy.completed || 0,
    mediumProblems: difficultyProgress?.medium.completed || 0,
    hardProblems: difficultyProgress?.hard.completed || 0,
    theoryProblems: difficultyProgress?.theory.completed || 0,
    learningPathProgress: learningPathProgressData,
    completedTopics
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <PlatformButtons />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <ProfileHeader profile={profile} />
              
              <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-purple-800 flex items-center gap-2">
                      <Award size={18} className="text-purple-600" />
                      Achievements
                    </CardTitle>
                    <UiBadge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      {badges.length} {badges.length === 1 ? 'Badge' : 'Badges'}
                    </UiBadge>
                  </div>
                </CardHeader>
                <CardContent className="p-5">
                  {badges.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                      {badges.map((badge) => {
                        const IconComponent = {
                          'Award': Award,
                          'Code': Code,
                          'Brain': Brain,
                          'Zap': Zap,
                          'Trophy': Trophy
                        }[badge.badge?.icon_name || ''] || Award;
                        
                        return (
                          <div key={badge.id} className="flex flex-col items-center group">
                            <div className={`h-16 w-16 rounded-full ${badge.badge?.background_color || 'bg-purple-100'} flex items-center justify-center ${badge.badge?.text_color || 'text-purple-700'} mb-2 shadow-md transform transition-transform group-hover:scale-110 group-hover:shadow-lg duration-200`}>
                              <IconComponent size={24} className="animate-pulse" />
                            </div>
                            <span className="text-xs font-medium text-center text-gray-700">{badge.badge?.name || ''}</span>
                            <span className="text-[10px] text-gray-500 text-center hidden group-hover:block animate-fade-in mt-1">
                              {new Date(badge.earned_at).toLocaleDateString()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 px-3 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4 animate-pulse">
                        <Trophy size={24} className="text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">No badges earned yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <SkillsSection skills={skills} />
            </div>
            
            <div className="lg:col-span-3 space-y-6">
              <UserStats {...statsData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
