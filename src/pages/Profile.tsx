
import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UserStats from "@/components/UserStats";
import { Settings, Award, Code, Brain, Zap, Trophy } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ProfileEditDialog from "@/components/ProfileEditDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

// Import services
import { 
  getProfileById, 
  getProfileByPRN, 
  updateProfile, 
  getUserSkills, 
  addUserSkill, 
  removeUserSkill, 
  getUserBadges, 
  getUserStreak,
  type Profile, 
  type UserSkill, 
  type UserBadge 
} from "@/services/profileService";

import {
  getCompletedTopics,
  calculateLearningPathProgress,
  calculateProgressByDifficulty
} from "@/services/learningPathService";

const ProfilePage = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const profileId = params.id;
  const prn = searchParams.get("prn") || params.prn;
  
  const [open, setOpen] = useState(false);
  const isEditable = Boolean(profileId && !prn);

  // Fetch profile data
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

  // Fetch skills
  const { data: skills = [], refetch: refetchSkills } = useQuery({
    queryKey: ['skills', profile?.id],
    queryFn: () => getUserSkills(profile?.id || ''),
    enabled: !!profile?.id
  });

  // Fetch badges
  const { data: badges = [] } = useQuery({
    queryKey: ['badges', profile?.id],
    queryFn: () => getUserBadges(profile?.id || ''),
    enabled: !!profile?.id
  });

  // Fetch streak
  const { data: streak } = useQuery({
    queryKey: ['streak', profile?.id],
    queryFn: () => getUserStreak(profile?.id || ''),
    enabled: !!profile?.id
  });

  // Fetch completed topics
  const { data: completedTopics = [] } = useQuery({
    queryKey: ['completedTopics', profile?.id],
    queryFn: () => getCompletedTopics(profile?.id || ''),
    enabled: !!profile?.id
  });

  // Fetch learning path progress
  const { data: learningPathProgress = [] } = useQuery({
    queryKey: ['learningPathProgress', profile?.id],
    queryFn: () => calculateLearningPathProgress(profile?.id || ''),
    enabled: !!profile?.id
  });

  // Fetch progress by difficulty
  const { data: difficultyProgress } = useQuery({
    queryKey: ['difficultyProgress', profile?.id],
    queryFn: () => calculateProgressByDifficulty(profile?.id || ''),
    enabled: !!profile?.id
  });

  // Handle profile update
  const handleSaveProfile = async (data: { 
    realName: string; 
    cgpa: number; 
    skills: string[] 
  }) => {
    if (!profile?.id) return;
    
    // Update profile data
    const updatedProfile = await updateProfile(profile.id, {
      real_name: data.realName,
      cgpa: data.cgpa,
    });

    if (!updatedProfile) {
      toast.error("Failed to update profile");
      return;
    }

    // Handle skills update
    const currentSkillNames = skills.map(s => s.skill_name);
    const skillsToAdd = data.skills.filter(s => !currentSkillNames.includes(s));
    const skillsToRemove = skills.filter(s => !data.skills.includes(s.skill_name));

    // Add new skills
    for (const skillName of skillsToAdd) {
      await addUserSkill(profile.id, skillName);
    }

    // Remove deleted skills
    for (const skill of skillsToRemove) {
      await removeUserSkill(skill.id);
    }

    setOpen(false);
    await refetchProfile();
    await refetchSkills();
    toast.success("Profile updated successfully");
  };

  // If both profileId and prn are missing, show error
  if (!profileId && !prn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h1>
          <p className="text-gray-600">Please provide a valid ID or PRN parameter</p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error if profile not found
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

  // Calculate stats data for the UserStats component
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
    streak: streak?.current_streak || 0,
    learningPathProgress,
    completedTopics
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {profile.real_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle>{profile.real_name}</CardTitle>
                    </div>
                    {isEditable && (
                      <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                          <button className="text-gray-500 hover:text-gray-700">
                            <Settings size={18} />
                          </button>
                        </DialogTrigger>
                        <ProfileEditDialog 
                          userData={{ 
                            realName: profile.real_name, 
                            cgpa: profile.cgpa,
                            skills: skills.map(s => s.skill_name)
                          }} 
                          onSave={handleSaveProfile} 
                          onClose={() => setOpen(false)} 
                        />
                      </Dialog>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">CGPA</span>
                      <span className="font-semibold">{profile.cgpa.toFixed(1)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Skills</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {skills.length > 0 ? (
                    skills.map((skill) => (
                      <Badge key={skill.id} variant="outline" className="border-gray-200">
                        {skill.skill_name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No skills added yet</p>
                  )}
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {badges.length > 0 ? (
                      badges.map((badge) => {
                        // Dynamically import the icon
                        const IconComponent = {
                          'Award': Award,
                          'Code': Code,
                          'Brain': Brain,
                          'Zap': Zap,
                          'Trophy': Trophy
                        }[badge.badge?.icon_name || ''] || Award;
                        
                        return (
                          <div key={badge.id} className="flex flex-col items-center">
                            <div className={`h-12 w-12 rounded-full ${badge.badge?.background_color} flex items-center justify-center ${badge.badge?.text_color} mb-1`}>
                              <IconComponent size={20} />
                            </div>
                            <span className="text-xs text-center">{badge.badge?.name || ''}</span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-500 col-span-3">No badges earned yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <UserStats {...statsData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
