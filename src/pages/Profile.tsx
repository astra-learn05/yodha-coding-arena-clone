import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UserStats from "@/components/UserStats";
import { Award, Code, Brain, Zap, Trophy, Linkedin, Github, MapPin, Calendar, Settings } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ProfileEditDialog from "@/components/ProfileEditDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

import {
  getProfileById, 
  getProfileByPRN, 
  updateProfile,
  getUserBadges,
  getUserCertificates,
  getUserProjects,
  getUserWorkExperiences,
  Certificate,
  Project,
  WorkExperience,
  addCertificate,
  updateCertificate,
  deleteCertificate,
  addProject,
  updateProject,
  deleteProject,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience
} from "@/services/profileService";

import {
  getCompletedTopics,
  calculateLearningPathProgress,
  calculateProgressByDifficulty
} from "@/services/learningPathService";

import {
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

  const { data: certificates = [], refetch: refetchCertificates } = useQuery({
    queryKey: ['certificates', profile?.id],
    queryFn: () => getUserCertificates(profile?.id || ''),
    enabled: !!profile?.id
  });

  const { data: projects = [], refetch: refetchProjects } = useQuery({
    queryKey: ['projects', profile?.id],
    queryFn: () => getUserProjects(profile?.id || ''),
    enabled: !!profile?.id
  });

  const { data: workExperience = [], refetch: refetchWorkExperience } = useQuery({
    queryKey: ['workExperience', profile?.id],
    queryFn: () => getUserWorkExperiences(profile?.id || ''),
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
    profilePictureUrl: string | null;
    linkedinUrl: string | null;
    githubUrl: string | null;
    leetcodeUrl: string | null;
    certificates: Certificate[];
    projects: Project[];
    workExperience: WorkExperience[];
  }) => {
    if (!profile?.id) {
      toast.error("Profile not found");
      return;
    }
    
    try {
      console.log("Updating profile with data:", data);
      
      // Update basic profile information
      const updatedProfile = await updateProfile(profile.id, {
        real_name: data.realName,
        cgpa: parseFloat(data.cgpa.toString()),
        bio: data.bio,
        college_name: data.collegeName,
        location: data.location,
        profile_picture_url: data.profilePictureUrl,
        linkedin_url: data.linkedinUrl,
        github_url: data.githubUrl,
        leetcode_url: data.leetcodeUrl
      });

      console.log("Profile update response:", updatedProfile);

      if (!updatedProfile) {
        console.error("Profile update returned null or undefined");
        toast.error("Failed to update profile");
        return;
      }

      // Handle certificates
      const existingCertificates = await getUserCertificates(profile.id);
      
      // Delete removed certificates
      for (const existingCert of existingCertificates) {
        if (!data.certificates.some(cert => cert.id === existingCert.id)) {
          await deleteCertificate(existingCert.id);
        }
      }
      
      // Add or update certificates
      for (const cert of data.certificates) {
        if (cert.id.includes("new-")) {
          // New certificate to add
          const { id, ...certData } = cert;
          await addCertificate(profile.id, certData);
        } else if (existingCertificates.some(existing => existing.id === cert.id)) {
          // Update existing certificate
          await updateCertificate(cert.id, cert);
        }
      }
      
      // Handle projects
      const existingProjects = await getUserProjects(profile.id);
      
      // Delete removed projects
      for (const existingProj of existingProjects) {
        if (!data.projects.some(proj => proj.id === existingProj.id)) {
          await deleteProject(existingProj.id);
        }
      }
      
      // Add or update projects
      for (const proj of data.projects) {
        if (proj.id.includes("new-")) {
          // New project to add
          const { id, ...projData } = proj;
          await addProject(profile.id, projData);
        } else if (existingProjects.some(existing => existing.id === proj.id)) {
          // Update existing project
          await updateProject(proj.id, proj);
        }
      }
      
      // Handle work experience
      const existingExperiences = await getUserWorkExperiences(profile.id);
      
      // Delete removed experiences
      for (const existingExp of existingExperiences) {
        if (!data.workExperience.some(exp => exp.id === existingExp.id)) {
          await deleteWorkExperience(existingExp.id);
        }
      }
      
      // Add or update work experiences
      for (const exp of data.workExperience) {
        if (exp.id.includes("new-")) {
          // New experience to add
          const { id, ...expData } = exp;
          await addWorkExperience(profile.id, expData);
        } else if (existingExperiences.some(existing => existing.id === exp.id)) {
          // Update existing experience
          await updateWorkExperience(exp.id, exp);
        }
      }
      
      setOpen(false);
      await refetchProfile();
      await refetchCertificates();
      await refetchProjects();
      await refetchWorkExperience();
      
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
                            bio: profile.bio,
                            collegeName: profile.college_name,
                            location: profile.location,
                            profilePictureUrl: profile.profile_picture_url,
                            linkedinUrl: profile.linkedin_url,
                            githubUrl: profile.github_url,
                            leetcodeUrl: profile.leetcode_url,
                            certificates,
                            projects,
                            workExperience
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

                    {(profile.linkedin_url || profile.github_url || profile.leetcode_url) && (
                      <div className="flex gap-3 mt-4">
                        {profile.linkedin_url && (
                          <a 
                            href={profile.linkedin_url.startsWith('http') ? profile.linkedin_url : `https://${profile.linkedin_url}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Linkedin size={20} />
                          </a>
                        )}
                        {profile.github_url && (
                          <a 
                            href={profile.github_url.startsWith('http') ? profile.github_url : `https://${profile.github_url}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-800 hover:text-gray-600"
                          >
                            <Github size={20} />
                          </a>
                        )}
                        {profile.leetcode_url && (
                          <a 
                            href={profile.leetcode_url.startsWith('http') ? profile.leetcode_url : `https://${profile.leetcode_url}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-orange-500 hover:text-orange-600"
                            title="LeetCode Profile"
                          >
                            <Code size={20} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
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
