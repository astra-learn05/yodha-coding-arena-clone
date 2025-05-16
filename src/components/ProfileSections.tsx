import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Briefcase, Award, Book, FileText, Code, GraduationCap, School } from "lucide-react";
import { format, parseISO } from "date-fns";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  Certificate, 
  Project, 
  WorkExperience,
  UserSkill,
  Training,
  Assessment
} from "@/services/profileService";

// Skills Section
export const SkillsSection = ({ skills }: { skills: UserSkill[] }) => {
  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-2 bg-gradient-to-r from-cyan-50 to-blue-50 border-b">
        <CardTitle className="text-lg font-bold text-blue-800 flex items-center gap-2">
          <Code size={18} className="text-blue-600" />
          Skills
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge 
                key={skill.id} 
                variant="outline" 
                className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors"
              >
                {skill.skill_name}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">No skills added yet</div>
        )}
      </CardContent>
    </Card>
  );
};

// Certificates Section
export const CertificatesSection = ({ certificates }: { certificates: Certificate[] }) => {
  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-yellow-50 border-b">
        <CardTitle className="text-lg font-bold text-amber-800 flex items-center gap-2">
          <Award size={18} className="text-amber-600" />
          Certifications
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        {certificates.length > 0 ? (
          <div className="space-y-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="border border-amber-100 rounded-lg p-4 bg-amber-50/30 hover:bg-amber-50/70 transition-colors">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-800">{cert.title}</h3>
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                    {format(new Date(cert.issue_date), "MMM yyyy")}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{cert.issuer}</p>
                {cert.credential_url && (
                  <a 
                    href={cert.credential_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-block"
                  >
                    View Credential
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">No certifications added yet</div>
        )}
      </CardContent>
    </Card>
  );
};

// Projects Section
export const ProjectsSection = ({ projects }: { projects: Project[] }) => {
  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b">
        <CardTitle className="text-lg font-bold text-green-800 flex items-center gap-2">
          <FileText size={18} className="text-green-600" />
          Projects
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        {projects.length > 0 ? (
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.id} className="border border-green-100 rounded-lg overflow-hidden bg-green-50/30 hover:bg-green-50/70 transition-colors">
                {project.image_url && (
                  <div className="w-full h-40">
                    <AspectRatio ratio={16 / 9} className="bg-muted">
                      <img 
                        src={project.image_url} 
                        alt={project.title}
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-800">{project.title}</h3>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {format(new Date(project.start_date), "MMM yyyy")} - 
                      {project.end_date ? format(new Date(project.end_date), " MMM yyyy") : " Present"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {project.technologies.map((tech, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">{tech}</Badge>
                      ))}
                    </div>
                  )}
                  {project.project_url && (
                    <a 
                      href={project.project_url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-sm text-blue-600 hover:text-blue-800 mt-3 inline-block"
                    >
                      View Project
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">No projects added yet</div>
        )}
      </CardContent>
    </Card>
  );
};

// Work Experience Section
export const WorkExperienceSection = ({ experiences }: { experiences: WorkExperience[] }) => {
  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-2 bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
        <CardTitle className="text-lg font-bold text-indigo-800 flex items-center gap-2">
          <Briefcase size={18} className="text-indigo-600" />
          Work Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        {experiences.length > 0 ? (
          <div className="space-y-6">
            {experiences.map((exp) => (
              <div key={exp.id} className="relative pl-6 pb-6 border-l-2 border-indigo-200 last:pb-0">
                <div className="absolute w-4 h-4 bg-indigo-500 rounded-full -left-[9px] top-0"></div>
                <div className="border border-indigo-100 rounded-lg p-4 bg-indigo-50/30 hover:bg-indigo-50/70 transition-colors">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <h3 className="font-medium text-gray-800">{exp.position}</h3>
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                      {format(new Date(exp.start_date), "MMM yyyy")} - 
                      {exp.end_date ? format(new Date(exp.end_date), " MMM yyyy") : " Present"}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-indigo-700 mt-1">{exp.company}</p>
                  {exp.location && (
                    <p className="text-xs text-gray-500 mt-1">{exp.location}</p>
                  )}
                  <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {exp.technologies.map((tech, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">{tech}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">No work experience added yet</div>
        )}
      </CardContent>
    </Card>
  );
};

// Trainings Section
export const TrainingsSection = ({ trainings }: { trainings: Training[] }) => {
  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-2 bg-gradient-to-r from-emerald-50 to-teal-50 border-b">
        <CardTitle className="text-lg font-bold text-emerald-800 flex items-center gap-2">
          <GraduationCap size={18} className="text-emerald-600" />
          Training & Courses
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        {trainings.length > 0 ? (
          <div className="space-y-4">
            {trainings.map((training) => (
              <div key={training.id} className="border border-emerald-100 rounded-lg p-4 bg-emerald-50/30 hover:bg-emerald-50/70 transition-colors">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-800">{training.title}</h3>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                    {format(new Date(training.start_date), "MMM yyyy")} - 
                    {training.end_date ? format(new Date(training.end_date), " MMM yyyy") : " Present"}
                  </span>
                </div>
                <p className="text-sm font-medium text-emerald-700 mt-1">{training.organization}</p>
                {training.description && (
                  <p className="text-sm text-gray-600 mt-2">{training.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">No trainings or courses added yet</div>
        )}
      </CardContent>
    </Card>
  );
};

// Assessments Section
export const AssessmentsSection = ({ assessments }: { assessments: Assessment[] }) => {
  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
        <CardTitle className="text-lg font-bold text-blue-800 flex items-center gap-2">
          <School size={18} className="text-blue-600" />
          Assessments & Tests
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        {assessments.length > 0 ? (
          <div className="space-y-4">
            {assessments.map((assessment) => (
              <div key={assessment.id} className="border border-blue-100 rounded-lg p-4 bg-blue-50/30 hover:bg-blue-50/70 transition-colors">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-800">{assessment.title}</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {format(new Date(assessment.assessment_date), "MMM yyyy")}
                  </span>
                </div>
                <p className="text-sm font-medium text-blue-700 mt-1">{assessment.provider}</p>
                <div className="flex items-center mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ 
                        width: `${(parseInt(assessment.score) / parseInt(assessment.max_score)) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {assessment.score}/{assessment.max_score}
                  </span>
                </div>
                {assessment.certificate_url && (
                  <a 
                    href={assessment.certificate_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-block"
                  >
                    View Certificate
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">No assessments added yet</div>
        )}
      </CardContent>
    </Card>
  );
};
