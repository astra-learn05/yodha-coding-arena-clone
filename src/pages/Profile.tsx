
import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UserStats from "@/components/UserStats";
import { Settings, Award, Code, Brain, Zap, Trophy, Linkedin, Github, MapPin, Calendar, Link as LinkIcon, Briefcase, FileText } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ProfileEditDialog from "@/components/ProfileEditDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

import {
  getProfileById, 
  getProfileByPRN, 
  updateProfile
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

  // Mock data for the new sections (in a real app, these would come from the database)
  const [certificates, setCertificates] = useState([
    {
      id: "1",
      title: "AWS Solutions Architect Associate",
      issuer: "Amazon Web Services",
      issueDate: "2023-05-15",
      expiryDate: "2026-05-15",
      credentialUrl: "https://aws.amazon.com/certification/verify"
    },
    {
      id: "2",
      title: "Full Stack Web Development",
      issuer: "Udemy",
      issueDate: "2022-12-10",
      credentialUrl: "https://udemy.com/certificate/123456"
    }
  ]);
  
  const [projects, setProjects] = useState([
    {
      id: "1",
      title: "E-commerce Platform",
      description: "A full-stack e-commerce platform with product catalog, shopping cart, and payment processing",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      startDate: "2023-01-01",
      endDate: "2023-04-15",
      projectUrl: "https://github.com/janedoe/ecommerce"
    },
    {
      id: "2",
      title: "Weather App",
      description: "A weather forecast application that shows current and weekly forecasts for any location",
      technologies: ["JavaScript", "HTML", "CSS", "OpenWeather API"],
      startDate: "2022-09-01",
      endDate: "2022-10-30",
      projectUrl: "https://weather-app-demo.vercel.app"
    }
  ]);
  
  const [workExperience, setWorkExperience] = useState([
    {
      id: "1",
      company: "TechCorp Inc",
      position: "Software Engineer",
      location: "San Francisco, CA",
      startDate: "2022-01-15",
      endDate: "2023-06-30",
      description: "Developed and maintained web applications, collaborated with cross-functional teams, and implemented CI/CD pipelines",
      technologies: ["React", "TypeScript", "Node.js", "AWS"]
    },
    {
      id: "2",
      company: "StartupX",
      position: "Frontend Developer Intern",
      location: "Remote",
      startDate: "2021-05-01",
      endDate: "2021-12-31",
      description: "Designed and implemented user interfaces for web applications, fixed bugs, and optimized performance",
      technologies: ["JavaScript", "React", "CSS", "Git"]
    }
  ]);

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
    certificates: any[];
    projects: any[];
    workExperience: any[];
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

      // Update local state for the new sections
      setCertificates(data.certificates);
      setProjects(data.projects);
      setWorkExperience(data.workExperience);

      setOpen(false);
      await refetchProfile();
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

  const formatDate = (dateString: string) => {
    try {
      // Check if the date has a valid format
      if (dateString.includes('T')) {
        return format(parseISO(dateString), 'MMM dd, yyyy');
      }
      // Handle simple date format
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

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
              
              {/* Certificates Section */}
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-500" />
                    Certificates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {certificates.length > 0 ? (
                    <div className="space-y-4">
                      {certificates.map((cert) => (
                        <div key={cert.id} className="bg-white border rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium text-base">{cert.title}</h3>
                              <p className="text-gray-600 text-sm">{cert.issuer}</p>
                              <div className="flex items-center mt-2 text-sm text-gray-500">
                                <Calendar size={14} className="mr-1" />
                                <span>
                                  {formatDate(cert.issueDate)}
                                  {cert.expiryDate && ` - ${formatDate(cert.expiryDate)}`}
                                </span>
                              </div>
                            </div>
                            {cert.credentialUrl && (
                              <a 
                                href={cert.credentialUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                              >
                                <LinkIcon size={16} className="mr-1" />
                                View
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No certificates added yet.</p>
                  )}
                </CardContent>
              </Card>
              
              {/* Projects Section */}
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-500" />
                    Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {projects.length > 0 ? (
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <div key={project.id} className="bg-white border rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-base">{project.title}</h3>
                              <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                              
                              <div className="flex items-center mt-2 text-sm text-gray-500">
                                <Calendar size={14} className="mr-1" />
                                <span>
                                  {formatDate(project.startDate)}
                                  {project.endDate ? ` - ${formatDate(project.endDate)}` : ' - Present'}
                                </span>
                              </div>
                              
                              {project.technologies && project.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {project.technologies.map((tech, i) => (
                                    <Badge key={i} variant="outline" className="bg-gray-100">
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            {project.projectUrl && (
                              <a 
                                href={project.projectUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                              >
                                <LinkIcon size={16} className="mr-1" />
                                View Project
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No projects added yet.</p>
                  )}
                </CardContent>
              </Card>
              
              {/* Work Experience Section */}
              <Card className="mt-6 mb-8">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-purple-500" />
                    Work Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {workExperience.length > 0 ? (
                    <div className="space-y-4">
                      {workExperience.map((exp) => (
                        <div key={exp.id} className="bg-white border rounded-lg p-4 shadow-sm">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="font-medium text-base">{exp.position}</h3>
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar size={14} className="mr-1" />
                                <span>
                                  {formatDate(exp.startDate)}
                                  {exp.endDate ? ` - ${formatDate(exp.endDate)}` : ' - Present'}
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-600 font-medium text-sm">{exp.company}</p>
                            {exp.location && (
                              <p className="text-gray-500 text-sm">{exp.location}</p>
                            )}
                            <p className="text-gray-600 text-sm mt-2">{exp.description}</p>
                            
                            {exp.technologies && exp.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-3">
                                {exp.technologies.map((tech, i) => (
                                  <Badge key={i} variant="outline" className="bg-gray-100">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No work experience added yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
