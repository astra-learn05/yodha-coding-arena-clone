import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge as UiBadge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import UserStats from "@/components/UserStats";
import { Award, Code, Brain, Zap, Trophy, MapPin, School, Sparkles, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ProfileEditDialog from "@/components/ProfileEditDialog";

import {
  LinkedinIcon,
  GithubIcon,
  LeetcodeIcon,
  HackerrankIcon,
  GeeksforGeeksIcon
} from "@/components/SocialIcons";

import {
  getProfileById, 
  getProfileByPRN, 
  updateProfile,
  getUserBadges,
  getUserSkills,
  getUserAssessmentResults
} from "@/services/profileService";

import {
  getCompletedTopics,
  calculateLearningPathProgress,
  calculateProgressByDifficulty
} from "@/services/learningPathService";

import {
  checkAndAwardPathBadges
} from "@/services/badgeService";

import { SkillsSection, AssessmentsSection } from "@/components/ProfileSections";

const ProfilePage = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const profileId = params.id || "1"; // Default to ID "1" if no ID is provided
  const prn = searchParams.get("prn") || params.prn;
  
  const [open, setOpen] = useState(false);
  const isEditable = !!profileId && !prn;

  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useQuery({
    queryKey: ['profile', profileId, prn],
    queryFn: async () => {
      if (profileId) {
        return getProfileById(profileId);
      } else if (prn) {
        return getProfileByPRN(prn);
      }
      return null;
    }
  });

  const { data: badges = [], refetch: refetchBadges } = useQuery({
    queryKey: ['badges', profile?.id],
    queryFn: () => getUserBadges(profile?.id || ''),
    enabled: !!profile?.id
  });

  const { data: completedTopics = [] } = useQuery({
    queryKey: ['completedTopics', profile?.id],
    queryFn: () => getCompletedTopics(profile?.id || ''),
    enabled: !!profile?.id
  });

  const { data: learningPathProgressData = [] } = useQuery({
    queryKey: ['learningPathProgress', profile?.id],
    queryFn: () => calculateLearningPathProgress(profile?.id || ''),
    enabled: !!profile?.id
  });

  const { data: difficultyProgress } = useQuery({
    queryKey: ['difficultyProgress', profile?.id],
    queryFn: () => calculateProgressByDifficulty(profile?.id || ''),
    enabled: !!profile?.id
  });

  const { data: skills = [] } = useQuery({
    queryKey: ['skills', profile?.id],
    queryFn: () => getUserSkills(profile?.id || ''),
    enabled: !!profile?.id
  });

  const { data: assessmentResults = [] } = useQuery({
    queryKey: ['assessmentResults', profile?.id],
    queryFn: () => getUserAssessmentResults(profile?.id || ''),
    enabled: !!profile?.id
  });

  useEffect(() => {
    if (profile?.id && learningPathProgressData?.length > 0) {
      const awardBadges = async () => {
        await checkAndAwardPathBadges(profile.id);
        refetchBadges();
      };
      
      awardBadges();
    }
  }, [profile?.id, learningPathProgressData, refetchBadges]);

  const handleSaveProfile = async (data: { 
    realName: string; 
    cgpa: number; 
    bio: string | null;
    collegeName: string | null;
    location: string | null;
  }) => {
    try {
      await updateProfile(profile?.id || '', {
        real_name: data.realName,
        cgpa: data.cgpa,
        bio: data.bio,
        college_name: data.collegeName,
        location: data.location
      });
      
      await refetchProfile();
      setOpen(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleYuktiRedirect = () => {
    const yuktiUrl = `https://yukti.ikshvaku-innovations.in/${profile?.id}`;
    window.open(yuktiUrl, '_blank');
  };

  // This block is for debugging purposes
  console.log("Profile ID:", profileId, "PRN:", prn, "Is Editable:", isEditable);
  console.log("Profile data:", profile);

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h1>
          <p className="text-gray-600">The requested profile does not exist</p>
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

  const userData = {
    realName: profile?.real_name || '',
    cgpa: profile?.cgpa || 0,
    bio: profile?.bio,
    collegeName: profile?.college_name,
    location: profile?.location
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-blue-800">Profile</CardTitle>
                    {isEditable && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setOpen(true)}
                        className="h-8 w-8 p-0 hover:bg-blue-100"
                      >
                        <Settings size={16} className="text-blue-600" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-5">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                      {profile.profile_picture_url ? (
                        <AvatarImage src={profile.profile_picture_url} alt={profile.real_name} className="object-cover" />
                      ) : (
                        <AvatarFallback className="text-white text-3xl">
                          {profile.real_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div className="text-center space-y-2">
                      <h2 className="text-xl font-bold text-gray-800">{profile.real_name}</h2>
                      {profile.location && (
                        <div className="flex items-center justify-center text-sm text-gray-500">
                          <MapPin size={14} className="mr-1 text-indigo-500" />
                          <span>{profile.location}</span>
                        </div>
                      )}
                    </div>
                    
                    {profile.bio && (
                      <div className="py-3 px-4 bg-gray-50 rounded-lg border border-gray-100 w-full">
                        <p className="text-sm text-gray-700 italic">{profile.bio}</p>
                      </div>
                    )}
                    
                    <div className="space-y-3 pt-2 w-full">
                      {profile.college_name && (
                        <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
                          <div className="flex items-center gap-2 text-gray-700">
                            <School size={18} className="text-indigo-600" />
                            <span className="text-sm font-medium">College</span>
                          </div>
                          <span className="font-medium text-gray-800 text-right">{profile.college_name}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-700">
{/*                           <Sparkles size={16} className="text-indigo-500" /> */}
                          <span className="text-sm font-medium">CGPA</span>
                        </div>
                        <span className="font-semibold text-gray-800 bg-blue-50 px-2 py-0.5 rounded-md">{profile.cgpa?.toFixed(1) || "N/A"}</span>
                      </div>
                    </div>

                    <div className="w-full pt-4 border-t border-gray-100">
                      <Button
                        onClick={handleYuktiRedirect}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        <Sparkles size={16} className="mr-2" />
                        Yukti
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
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
              
              <AssessmentsSection assessmentResults={assessmentResults} />
            </div>
            
            <div className="lg:col-span-3 space-y-6">
              <UserStats {...statsData} />
            </div>
          </div>
        </div>
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <ProfileEditDialog
          userData={userData}
          onSave={handleSaveProfile}
          onClose={() => setOpen(false)}
        />
      </Dialog>
    </div>
  );
};

export default ProfilePage;
