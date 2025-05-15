import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge as UiBadge } from "@/components/ui/badge";
import UserStats from "@/components/UserStats";
import { Award, Code, Brain, Zap, Trophy, Linkedin, Github, MapPin, Calendar, School, Sparkles, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

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
  deleteWorkExperience,
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

import { cn } from "@/lib/utils";
import { SkillsSection, CertificatesSection, ProjectsSection, WorkExperienceSection } from "@/components/ProfileSections";

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
    hackerrankUrl: string | null;
    geeksforgeeksUrl: string | null;
  }) => {
    toast.error("Profile editing is currently disabled");
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <CardTitle className="text-lg font-bold text-blue-800">Profile</CardTitle>
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
                          <Sparkles size={16} className="text-indigo-500" />
                          <span className="text-sm font-medium">CGPA</span>
                        </div>
                        <span className="font-semibold text-gray-800 bg-blue-50 px-2 py-0.5 rounded-md">{profile.cgpa?.toFixed(1) || "N/A"}</span>
                      </div>
                    </div>

                    {(profile.linkedin_url || profile.github_url || profile.leetcode_url || 
                      profile.hackerrank_url || profile.gfg_url) && (
                      <div className="flex justify-center gap-3 mt-4 pt-4 border-t border-gray-100 w-full">
                        {profile.linkedin_url && (
                          <a 
                            href={profile.linkedin_url.startsWith('http') ? profile.linkedin_url : `https://${profile.linkedin_url}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 bg-blue-50 rounded-full text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors transform hover:scale-110 duration-200"
                            aria-label="LinkedIn Profile"
                          >
                            <LinkedinIcon className="w-5 h-5" />
                          </a>
                        )}
                        {profile.github_url && (
                          <a 
                            href={profile.github_url.startsWith('http') ? profile.github_url : `https://${profile.github_url}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 bg-gray-100 rounded-full text-gray-800 hover:bg-gray-200 hover:text-gray-900 transition-colors transform hover:scale-110 duration-200"
                            aria-label="GitHub Profile"
                          >
                            <GithubIcon className="w-5 h-5" />
                          </a>
                        )}
                        {profile.leetcode_url && (
                          <a 
                            href={profile.leetcode_url.startsWith('http') ? profile.leetcode_url : `https://${profile.leetcode_url}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 bg-orange-50 rounded-full text-orange-600 hover:bg-orange-100 hover:text-orange-700 transition-colors transform hover:scale-110 duration-200"
                            aria-label="LeetCode Profile"
                          >
                            <LeetcodeIcon className="w-5 h-5" />
                          </a>
                        )}
                        {profile.hackerrank_url && (
                          <a 
                            href={profile.hackerrank_url.startsWith('http') ? profile.hackerrank_url : `https://${profile.hackerrank_url}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 bg-green-50 rounded-full text-green-600 hover:bg-green-100 hover:text-green-700 transition-colors transform hover:scale-110 duration-200"
                            aria-label="HackerRank Profile"
                          >
                            <HackerrankIcon className="w-5 h-5" />
                          </a>
                        )}
                        {profile.gfg_url && (
                          <a 
                            href={profile.gfg_url.startsWith('http') ? profile.gfg_url : `https://${profile.gfg_url}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 bg-emerald-50 rounded-full text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors transform hover:scale-110 duration-200"
                            aria-label="GeeksforGeeks Profile"
                          >
                            <GeeksforGeeksIcon className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    )}
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
            </div>
            
            <div className="lg:col-span-3 space-y-6">
              <UserStats {...statsData} />

              <ProjectsSection projects={projects} />

              <WorkExperienceSection experiences={workExperience} />

              <CertificatesSection certificates={certificates} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
