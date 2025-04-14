import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UserStats from "@/components/UserStats";
import { Settings, Award, Code, Brain, Zap, Trophy, Linkedin, Github, MapPin } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ProfileEditDialog from "@/components/ProfileEditDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

import {
  getProfileById, 
  getProfileByPRN, 
  updateProfile, 
  getUserSkills, 
  syncUserSkills
} from "@/services/profileService";

import {
  getCompletedTopics,
  calculateLearningPathProgress,
  calculateProgressByDifficulty
} from "@/services/learningPathService";

import {
  getUserBadges,
  checkAndAwardPathBadges
} from "@/services/badgeService";

const ProfilePage = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const profileId = params.id;
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

  const { data: skills = [], refetch: refetchSkills } = useQuery({
    queryKey: ['skills', profile?.id],
    queryFn: () => getUserSkills(profile?.id || ''),
    enabled: !!profile?.id
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
    skills: string[];
    bio: string | null;
    collegeName: string | null;
    location: string | null;
    profilePictureUrl: string | null;
    linkedinUrl: string | null;
    githubUrl: string | null;
  }) => {
    if (!profile?.id) {
      toast.error("Profile not found");
      return;
    }
    
    try {
      console.log("Updating profile with data:", data);
      
      const updatedProfile = await updateProfile(profile.id, {
        real_name: data.realName,
        cgpa: parseFloat(data.cgpa.toString()),
        bio: data.bio,
        college_name: data.collegeName,
        location: data.location,
        profile_picture_url: data.profilePictureUrl,
        linkedin_url: data.linkedinUrl,
        github_url: data.githubUrl
      });

      console.log("Profile update response:", updatedProfile);

      if (!updatedProfile) {
        console.error("Profile update returned null or undefined");
        toast.error("Failed to update profile");
        return;
      }

      const skillsUpdateSuccess = await syncUserSkills(profile.id, data.skills);
      
      if (!skillsUpdateSuccess) {
        toast.error("Failed to update skills");
        return;
      }

      setOpen(false);
      await refetchProfile();
      await refetchSkills();
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating profile");
    }
  };

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

  console.log("Profile ID:", profileId, "PRN:", prn, "Is Editable:", isEditable);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-16 w-16">
                        {profile.profile_picture_url ? (
                          <AvatarImage src={profile.profile_picture_url} alt={profile.real_name} />
                        ) : (
                          <AvatarFallback className="bg-primary/10 text-primary text-xl">
                            {profile.real_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <CardTitle>{profile.real_name}</CardTitle>
                        {profile.location && (
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin size={14} className="mr-1" />
                            {profile.location}
                          </div>
                        )}
                      </div>
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
                            skills: skills.map(s => s.skill_name),
                            bio: profile.bio,
                            collegeName: profile.college_name,
                            location: profile.location,
                            profilePictureUrl: profile.profile_picture_url,
                            linkedinUrl: profile.linkedin_url,
                            githubUrl: profile.github_url
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
                    {profile.bio && (
                      <div className="text-sm text-gray-600 mt-2">
                        {profile.bio}
                      </div>
                    )}
                    
                    {profile.college_name && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">College</span>
                        <span className="font-medium">{profile.college_name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">CGPA</span>
                      <span className="font-semibold">{profile.cgpa.toFixed(1)}</span>
                    </div>

                    {(profile.linkedin_url || profile.github_url) && (
                      <div className="flex gap-3 mt-4">
                        {profile.linkedin_url && (
                          <a 
                            href={profile.linkedin_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Linkedin size={20} />
                          </a>
                        )}
                        {profile.github_url && (
                          <a 
                            href={profile.github_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-800 hover:text-gray-600"
                          >
                            <Github size={20} />
                          </a>
                        )}
                      </div>
                    )}
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
