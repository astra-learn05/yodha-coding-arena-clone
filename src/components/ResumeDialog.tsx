
import { useQuery } from "@tanstack/react-query";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Code, 
  FolderOpen, 
  Award, 
  Trophy,
  Heart,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Globe,
  Github,
  Linkedin,
  MessageSquare,
  ExternalLink
} from "lucide-react";
import { getResumeData } from "@/services/resumeService";

interface ResumeDialogProps {
  userId: string;
  onClose: () => void;
}

const ResumeDialog = ({ userId, onClose }: ResumeDialogProps) => {
  const { data: resumeData, isLoading } = useQuery({
    queryKey: ['resumeData', userId],
    queryFn: () => getResumeData(userId),
    enabled: !!userId
  });

  if (isLoading) {
    return (
      <DialogContent className="max-w-5xl max-h-[90vh] bg-gradient-to-br from-gray-50 to-white">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            <User size={24} className="text-blue-600" />
            Resume
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading resume...</p>
          </div>
        </div>
      </DialogContent>
    );
  }

  if (!resumeData) {
    return (
      <DialogContent className="max-w-5xl max-h-[90vh] bg-gradient-to-br from-gray-50 to-white">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            <User size={24} className="text-blue-600" />
            Resume
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4 mx-auto">
              <User size={24} className="text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Resume Data Found</h3>
            <p className="text-gray-600">Please add your information to generate a resume</p>
          </div>
        </div>
      </DialogContent>
    );
  }

  const { personalInfo, education, workExperience, skills, projects, positions, achievements, hobbies, interviewResults } = resumeData;

  return (
    <DialogContent className="max-w-5xl max-h-[90vh] bg-gradient-to-br from-gray-50 to-white">
      <DialogHeader className="border-b border-gray-100 pb-4">
        <DialogTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          <User size={24} className="text-blue-600" />
          Professional Resume
        </DialogTitle>
      </DialogHeader>
      
      <ScrollArea className="h-[75vh] pr-4">
        <div className="space-y-6">
          {/* Personal Information Header */}
          {personalInfo && (
            <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  {personalInfo.full_name && (
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">
                      {personalInfo.full_name}
                    </h1>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {personalInfo.email && (
                      <div className="flex items-center justify-center gap-2 bg-white/70 rounded-lg p-4 backdrop-blur-sm border border-blue-100 hover:bg-white/90 transition-all duration-200">
                        <Mail size={18} className="text-blue-600" />
                        <span className="font-medium text-gray-700">{personalInfo.email}</span>
                      </div>
                    )}
                    {personalInfo.phone && (
                      <div className="flex items-center justify-center gap-2 bg-white/70 rounded-lg p-4 backdrop-blur-sm border border-green-100 hover:bg-white/90 transition-all duration-200">
                        <Phone size={18} className="text-green-600" />
                        <span className="font-medium text-gray-700">{personalInfo.phone}</span>
                      </div>
                    )}
                    {personalInfo.address && (
                      <div className="flex items-center justify-center gap-2 bg-white/70 rounded-lg p-4 backdrop-blur-sm border border-red-100 hover:bg-white/90 transition-all duration-200">
                        <MapPin size={18} className="text-red-500" />
                        <span className="font-medium text-gray-700">{personalInfo.address}</span>
                      </div>
                    )}
                  </div>

                  {(personalInfo.linkedin_url || personalInfo.github_url || personalInfo.portfolio_url) && (
                    <div className="flex justify-center gap-4 mt-6">
                      {personalInfo.linkedin_url && (
                        <a
                          href={personalInfo.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group"
                        >
                          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-2 hover:bg-blue-200 hover:border-blue-300 transition-all duration-200 cursor-pointer group-hover:scale-105">
                            <Linkedin size={16} className="mr-2" />
                            LinkedIn
                            <ExternalLink size={12} className="ml-1 opacity-60" />
                          </Badge>
                        </a>
                      )}
                      {personalInfo.github_url && (
                        <a
                          href={personalInfo.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group"
                        >
                          <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200 px-4 py-2 hover:bg-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer group-hover:scale-105">
                            <Github size={16} className="mr-2" />
                            GitHub
                            <ExternalLink size={12} className="ml-1 opacity-60" />
                          </Badge>
                        </a>
                      )}
                      {personalInfo.portfolio_url && (
                        <a
                          href={personalInfo.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group"
                        >
                          <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200 px-4 py-2 hover:bg-purple-200 hover:border-purple-300 transition-all duration-200 cursor-pointer group-hover:scale-105">
                            <Globe size={16} className="mr-2" />
                            Portfolio
                            <ExternalLink size={12} className="ml-1 opacity-60" />
                          </Badge>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Education Section */}
          {education && education.length > 0 && (
            <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-emerald-800">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <GraduationCap size={20} className="text-emerald-600" />
                  </div>
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {education.map((edu, index) => (
                  <div key={edu.id} className={`border-l-4 border-emerald-200 pl-6 ${index !== education.length - 1 ? 'pb-6 border-b border-gray-100' : ''}`}>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-800">{edu.degree}</h3>
                      <p className="text-emerald-600 font-semibold text-lg">{edu.institution_name}</p>
                      {edu.field_of_study && (
                        <p className="text-gray-600 font-medium">{edu.field_of_study}</p>
                      )}
                      <div className="flex items-center gap-6 text-sm text-gray-500 mt-3">
                        {(edu.start_date || edu.end_date) && (
                          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                            <Calendar size={14} className="text-emerald-500" />
                            <span className="font-medium">
                              {edu.start_date && new Date(edu.start_date).getFullYear()} - {edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present'}
                            </span>
                          </div>
                        )}
                        {edu.gpa && (
                          <div className="bg-emerald-50 px-3 py-1 rounded-full">
                            <span className="font-semibold text-emerald-700">GPA: {edu.gpa}</span>
                          </div>
                        )}
                      </div>
                      {edu.description && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <p className="text-gray-700 leading-relaxed">{edu.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Work Experience Section */}
          {workExperience && workExperience.length > 0 && (
            <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-blue-800">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Briefcase size={20} className="text-blue-600" />
                  </div>
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {workExperience.map((work, index) => (
                  <div key={work.id} className={`border-l-4 border-blue-200 pl-6 ${index !== workExperience.length - 1 ? 'pb-6 border-b border-gray-100' : ''}`}>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-800">{work.position}</h3>
                      <p className="text-blue-600 font-semibold text-lg">{work.company_name}</p>
                      {work.location && (
                        <p className="text-gray-600 font-medium flex items-center gap-1">
                          <MapPin size={14} />
                          {work.location}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-sm mt-3">
                        <div className="bg-blue-50 px-3 py-1 rounded-full flex items-center gap-2">
                          <Calendar size={14} className="text-blue-500" />
                          <span className="font-medium text-blue-700">
                            {work.start_date && new Date(work.start_date).getFullYear()} - {work.is_current ? 'Present' : work.end_date ? new Date(work.end_date).getFullYear() : 'Present'}
                          </span>
                        </div>
                        {work.is_current && (
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            Current Position
                          </Badge>
                        )}
                      </div>
                      {work.description && (
                        <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                          <p className="text-gray-700 leading-relaxed">{work.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Skills Section */}
          {skills && skills.length > 0 && (
            <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-purple-800">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Code size={20} className="text-purple-600" />
                  </div>
                  Technical Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skills.map((skill) => (
                    <div key={skill.id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-100">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-purple-800">{skill.skill_name}</span>
                        {skill.proficiency_level && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                            {skill.proficiency_level}
                          </Badge>
                        )}
                      </div>
                      {skill.skill_category && (
                        <p className="text-xs text-purple-600 mt-1">{skill.skill_category}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Projects Section */}
          {projects && projects.length > 0 && (
            <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-indigo-800">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <FolderOpen size={20} className="text-indigo-600" />
                  </div>
                  Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {projects.map((project, index) => (
                  <div key={project.id} className={`border-l-4 border-indigo-200 pl-6 ${index !== projects.length - 1 ? 'pb-6 border-b border-gray-100' : ''}`}>
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-gray-800">{project.project_name}</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="bg-indigo-50 px-3 py-1 rounded-full flex items-center gap-2">
                          <Calendar size={14} className="text-indigo-500" />
                          <span className="font-medium text-indigo-700">
                            {project.start_date && new Date(project.start_date).getFullYear()} - {project.end_date ? new Date(project.end_date).getFullYear() : 'Present'}
                          </span>
                        </div>
                      </div>
                      {project.description && (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                          <p className="text-gray-700 leading-relaxed">{project.description}</p>
                        </div>
                      )}
                      {project.technologies_used && project.technologies_used.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-gray-600">Technologies Used:</p>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies_used.map((tech, index) => (
                              <Badge key={index} variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {(project.project_url || project.github_url) && (
                        <div className="flex gap-2 mt-3">
                          {project.project_url && (
                            <a
                              href={project.project_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group"
                            >
                              <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-200 transition-all duration-200 cursor-pointer group-hover:scale-105">
                                <Globe size={12} className="mr-1" />
                                Live Demo
                                <ExternalLink size={10} className="ml-1 opacity-60" />
                              </Badge>
                            </a>
                          )}
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group"
                            >
                              <Badge className="bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 transition-all duration-200 cursor-pointer group-hover:scale-105">
                                <Github size={12} className="mr-1" />
                                Source Code
                                <ExternalLink size={10} className="ml-1 opacity-60" />
                              </Badge>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Positions of Responsibility */}
          {positions && positions.length > 0 && (
            <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-orange-800">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Award size={20} className="text-orange-600" />
                  </div>
                  Leadership & Positions of Responsibility
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {positions.map((position, index) => (
                  <div key={position.id} className={`border-l-4 border-orange-200 pl-6 ${index !== positions.length - 1 ? 'pb-6 border-b border-gray-100' : ''}`}>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-800">{position.position_title}</h3>
                      <p className="text-orange-600 font-semibold text-lg">{position.organization}</p>
                      <div className="flex items-center gap-2 text-sm mt-3">
                        <div className="bg-orange-50 px-3 py-1 rounded-full flex items-center gap-2">
                          <Calendar size={14} className="text-orange-500" />
                          <span className="font-medium text-orange-700">
                            {position.start_date && new Date(position.start_date).getFullYear()} - {position.end_date ? new Date(position.end_date).getFullYear() : 'Present'}
                          </span>
                        </div>
                      </div>
                      {position.description && (
                        <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                          <p className="text-gray-700 leading-relaxed">{position.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Achievements */}
          {achievements && achievements.length > 0 && (
            <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-100">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-yellow-800">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Trophy size={20} className="text-yellow-600" />
                  </div>
                  Achievements & Awards
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {achievements.map((achievement, index) => (
                  <div key={achievement.id} className={`border-l-4 border-yellow-200 pl-6 ${index !== achievements.length - 1 ? 'pb-6 border-b border-gray-100' : ''}`}>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-800">{achievement.achievement_title}</h3>
                      {achievement.issuing_organization && (
                        <p className="text-yellow-600 font-semibold text-lg">{achievement.issuing_organization}</p>
                      )}
                      {achievement.date_achieved && (
                        <div className="flex items-center gap-2 text-sm mt-3">
                          <div className="bg-yellow-50 px-3 py-1 rounded-full flex items-center gap-2">
                            <Calendar size={14} className="text-yellow-500" />
                            <span className="font-medium text-yellow-700">{new Date(achievement.date_achieved).getFullYear()}</span>
                          </div>
                        </div>
                      )}
                      {achievement.description && (
                        <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                          <p className="text-gray-700 leading-relaxed">{achievement.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Interview Results Section */}
          {interviewResults && interviewResults.length > 0 && (
            <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-teal-800">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <MessageSquare size={20} className="text-teal-600" />
                  </div>
                  Interview Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {interviewResults.map((interview, index) => (
                  <div key={interview.id} className={`border-l-4 border-teal-200 pl-6 ${index !== interviewResults.length - 1 ? 'pb-6 border-b border-gray-100' : ''}`}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-800">Interview Assessment</h3>
                        <Badge 
                          className={`${
                            interview.performance_level === 'Excellent' ? 'bg-green-100 text-green-700 border-green-200' :
                            interview.performance_level === 'Strong' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                            interview.performance_level === 'Good' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                            interview.performance_level === 'Satisfactory' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                            'bg-red-100 text-red-700 border-red-200'
                          }`}
                        >
                          {interview.performance_level}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="bg-teal-50 rounded-lg p-3 text-center border border-teal-100">
                          <div className="text-2xl font-bold text-teal-700">{interview.overall_score}%</div>
                          <div className="text-xs text-teal-600 font-medium">Overall Score</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                          <div className="text-2xl font-bold text-blue-700">{interview.questions_answered}/{interview.total_questions}</div>
                          <div className="text-xs text-blue-600 font-medium">Questions Answered</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-100">
                          <div className="text-2xl font-bold text-purple-700">{interview.average_score.toFixed(1)}</div>
                          <div className="text-xs text-purple-600 font-medium">Average Score</div>
                        </div>
                        <div className="bg-indigo-50 rounded-lg p-3 text-center border border-indigo-100">
                          <div className="text-2xl font-bold text-indigo-700">{interview.duration_minutes || 'N/A'}</div>
                          <div className="text-xs text-indigo-600 font-medium">Duration (min)</div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Badge 
                          variant="outline"
                          className={`${
                            interview.overall_recommendation === 'Strong Hire' ? 'bg-green-50 text-green-700 border-green-200' :
                            interview.overall_recommendation === 'Hire' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            interview.overall_recommendation === 'Maybe' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            'bg-red-50 text-red-700 border-red-200'
                          } px-3 py-1`}
                        >
                          Recommendation: {interview.overall_recommendation}
                        </Badge>
                      </div>

                      <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                        <Calendar size={14} className="text-teal-500" />
                        <span>Completed on {new Date(interview.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Hobbies & Activities */}
          {hobbies && hobbies.length > 0 && (
            <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-100">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-pink-800">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Heart size={20} className="text-pink-600" />
                  </div>
                  Hobbies & Interests
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hobbies.map((hobby) => (
                    <div key={hobby.id} className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border border-pink-100">
                      <h3 className="font-bold text-pink-800 mb-2">{hobby.activity_name}</h3>
                      {hobby.description && (
                        <p className="text-pink-700 text-sm leading-relaxed">{hobby.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </DialogContent>
  );
};

export default ResumeDialog;
