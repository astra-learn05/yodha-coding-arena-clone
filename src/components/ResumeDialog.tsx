
import { useQuery } from "@tanstack/react-query";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Calendar
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
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Resume</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </DialogContent>
    );
  }

  if (!resumeData) {
    return (
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Resume</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-600">No resume data found</p>
        </div>
      </DialogContent>
    );
  }

  const { personalInfo, education, workExperience, skills, projects, positions, achievements, hobbies } = resumeData;

  return (
    <DialogContent className="max-w-4xl max-h-[90vh]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <User size={20} />
          Resume
        </DialogTitle>
      </DialogHeader>
      
      <ScrollArea className="h-[75vh] pr-4">
        <div className="space-y-6">
          {/* Personal Information */}
          {personalInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User size={18} />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {personalInfo.full_name && (
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">{personalInfo.full_name}</h2>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {personalInfo.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-500" />
                      <span>{personalInfo.email}</span>
                    </div>
                  )}
                  {personalInfo.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-500" />
                      <span>{personalInfo.phone}</span>
                    </div>
                  )}
                  {personalInfo.address && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-500" />
                      <span>{personalInfo.address}</span>
                    </div>
                  )}
                </div>
                {(personalInfo.linkedin_url || personalInfo.github_url || personalInfo.portfolio_url) && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {personalInfo.linkedin_url && (
                      <Badge variant="outline">LinkedIn</Badge>
                    )}
                    {personalInfo.github_url && (
                      <Badge variant="outline">GitHub</Badge>
                    )}
                    {personalInfo.portfolio_url && (
                      <Badge variant="outline">Portfolio</Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GraduationCap size={18} />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="border-l-2 border-blue-200 pl-4">
                    <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                    <p className="text-blue-600 font-medium">{edu.institution_name}</p>
                    {edu.field_of_study && (
                      <p className="text-gray-600">{edu.field_of_study}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      {(edu.start_date || edu.end_date) && (
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>
                            {edu.start_date && new Date(edu.start_date).getFullYear()} - {edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present'}
                          </span>
                        </div>
                      )}
                      {edu.gpa && (
                        <span>GPA: {edu.gpa}</span>
                      )}
                    </div>
                    {edu.description && (
                      <p className="text-gray-700 mt-2 text-sm">{edu.description}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Work Experience */}
          {workExperience && workExperience.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Briefcase size={18} />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {workExperience.map((work) => (
                  <div key={work.id} className="border-l-2 border-green-200 pl-4">
                    <h3 className="font-semibold text-gray-800">{work.position}</h3>
                    <p className="text-green-600 font-medium">{work.company_name}</p>
                    {work.location && (
                      <p className="text-gray-600">{work.location}</p>
                    )}
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <Calendar size={14} />
                      <span>
                        {work.start_date && new Date(work.start_date).getFullYear()} - {work.is_current ? 'Present' : work.end_date ? new Date(work.end_date).getFullYear() : 'Present'}
                      </span>
                    </div>
                    {work.description && (
                      <p className="text-gray-700 mt-2 text-sm">{work.description}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Code size={18} />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill.id} variant="secondary">
                      {skill.skill_name}
                      {skill.proficiency_level && (
                        <span className="ml-1 text-xs">({skill.proficiency_level})</span>
                      )}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FolderOpen size={18} />
                  Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="border-l-2 border-purple-200 pl-4">
                    <h3 className="font-semibold text-gray-800">{project.project_name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <Calendar size={14} />
                      <span>
                        {project.start_date && new Date(project.start_date).getFullYear()} - {project.end_date ? new Date(project.end_date).getFullYear() : 'Present'}
                      </span>
                    </div>
                    {project.description && (
                      <p className="text-gray-700 mt-2 text-sm">{project.description}</p>
                    )}
                    {project.technologies_used && project.technologies_used.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies_used.map((tech, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {(project.project_url || project.github_url) && (
                      <div className="flex gap-2 mt-2">
                        {project.project_url && (
                          <Badge variant="outline" className="text-xs">Demo</Badge>
                        )}
                        {project.github_url && (
                          <Badge variant="outline" className="text-xs">GitHub</Badge>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Positions of Responsibility */}
          {positions && positions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award size={18} />
                  Positions of Responsibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {positions.map((position) => (
                  <div key={position.id} className="border-l-2 border-orange-200 pl-4">
                    <h3 className="font-semibold text-gray-800">{position.position_title}</h3>
                    <p className="text-orange-600 font-medium">{position.organization}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <Calendar size={14} />
                      <span>
                        {position.start_date && new Date(position.start_date).getFullYear()} - {position.end_date ? new Date(position.end_date).getFullYear() : 'Present'}
                      </span>
                    </div>
                    {position.description && (
                      <p className="text-gray-700 mt-2 text-sm">{position.description}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Achievements */}
          {achievements && achievements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Trophy size={18} />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="border-l-2 border-yellow-200 pl-4">
                    <h3 className="font-semibold text-gray-800">{achievement.achievement_title}</h3>
                    {achievement.issuing_organization && (
                      <p className="text-yellow-600 font-medium">{achievement.issuing_organization}</p>
                    )}
                    {achievement.date_achieved && (
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <Calendar size={14} />
                        <span>{new Date(achievement.date_achieved).getFullYear()}</span>
                      </div>
                    )}
                    {achievement.description && (
                      <p className="text-gray-700 mt-2 text-sm">{achievement.description}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Hobbies & Activities */}
          {hobbies && hobbies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart size={18} />
                  Hobbies & Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {hobbies.map((hobby) => (
                  <div key={hobby.id} className="border-l-2 border-pink-200 pl-4">
                    <h3 className="font-semibold text-gray-800">{hobby.activity_name}</h3>
                    {hobby.description && (
                      <p className="text-gray-700 text-sm">{hobby.description}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </DialogContent>
  );
};

export default ResumeDialog;
