import { useState } from "react";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, Calendar, Link as LinkIcon, Briefcase, Award, FileText } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Certificate, Project, WorkExperience } from "@/services/profileService";
import { addCertificate, updateCertificate, deleteCertificate } from "@/services/profileService";
import { addProject, updateProject, deleteProject } from "@/services/profileService";
import { addWorkExperience, updateWorkExperience, deleteWorkExperience } from "@/services/profileService";
import { toast } from "sonner";
import {
  LinkedinIcon,
  GithubIcon,
  LeetcodeIcon,
  HackerrankIcon,
  GeeksforGeeksIcon
} from "@/components/SocialIcons";

const formSchema = z.object({
  realName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  cgpa: z
    .number()
    .min(0, { message: "CGPA must be greater than 0" })
    .max(10, { message: "CGPA must be less than or equal to 10" })
    .or(z.string().regex(/^\d*\.?\d*$/).transform(Number)),
  bio: z.string().optional(),
  collegeName: z.string().optional(),
  location: z.string().optional(),
  profilePictureUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  linkedinUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  githubUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  leetcodeUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  hackerrankUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  geeksforgeeksUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal(''))
});

type ProfileEditDialogProps = {
  userData: {
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
    certificates: Certificate[];
    projects: Project[];
    workExperience: WorkExperience[];
  };
  onSave: (data: {
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
    certificates: Certificate[];
    projects: Project[];
    workExperience: WorkExperience[];
  }) => void;
  onClose: () => void;
};

const ProfileEditDialog = ({ userData, onSave, onClose }: ProfileEditDialogProps) => {
  const [certificates, setCertificates] = useState<Certificate[]>(userData.certificates || []);
  const [projects, setProjects] = useState<Project[]>(userData.projects || []);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>(userData.workExperience || []);
  
  const [newCertificate, setNewCertificate] = useState<Partial<Certificate>>({});
  const [newProject, setNewProject] = useState<Partial<Project>>({});
  const [newWorkExperience, setNewWorkExperience] = useState<Partial<WorkExperience>>({});
  
  const [addingCertificate, setAddingCertificate] = useState(false);
  const [addingProject, setAddingProject] = useState(false);
  const [addingWorkExperience, setAddingWorkExperience] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      realName: userData.realName || "",
      cgpa: Number(userData.cgpa) || 0,
      bio: userData.bio || "",
      collegeName: userData.collegeName || "",
      location: userData.location || "",
      profilePictureUrl: userData.profilePictureUrl || "",
      linkedinUrl: userData.linkedinUrl || "",
      githubUrl: userData.githubUrl || "",
      leetcodeUrl: userData.leetcodeUrl || "",
      hackerrankUrl: userData.hackerrankUrl || "",
      geeksforgeeksUrl: userData.geeksforgeeksUrl || ""
    },
  });

  const handleAddCertificate = async () => {
    if (!newCertificate.title || !newCertificate.issuer || !newCertificate.issue_date) {
      toast.error("Please fill in all required certificate fields");
      return;
    }
    
    try {
      const certificate: Certificate = {
        id: `new-${crypto.randomUUID()}`,
        user_id: '', // Will be filled in by the backend
        title: newCertificate.title,
        issuer: newCertificate.issuer,
        issue_date: newCertificate.issue_date,
        expiry_date: newCertificate.expiry_date,
        credential_url: newCertificate.credential_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setCertificates([...certificates, certificate]);
      setNewCertificate({});
      setAddingCertificate(false);
    } catch (error) {
      console.error("Error adding certificate:", error);
      toast.error("Failed to add certificate");
    }
  };

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.description || !newProject.start_date) {
      toast.error("Please fill in all required project fields");
      return;
    }
    
    try {
      const project: Project = {
        id: `new-${crypto.randomUUID()}`,
        user_id: '', // Will be filled in by the backend
        title: newProject.title,
        description: newProject.description,
        technologies: newProject.technologies || [],
        start_date: newProject.start_date,
        end_date: newProject.end_date,
        project_url: newProject.project_url,
        image_url: newProject.image_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setProjects([...projects, project]);
      setNewProject({});
      setAddingProject(false);
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("Failed to add project");
    }
  };

  const handleAddWorkExperience = async () => {
    if (!newWorkExperience.company || !newWorkExperience.position || !newWorkExperience.start_date || !newWorkExperience.description) {
      toast.error("Please fill in all required work experience fields");
      return;
    }
    
    try {
      const experience: WorkExperience = {
        id: `new-${crypto.randomUUID()}`,
        user_id: '', // Will be filled in by the backend
        company: newWorkExperience.company,
        position: newWorkExperience.position,
        location: newWorkExperience.location,
        start_date: newWorkExperience.start_date,
        end_date: newWorkExperience.end_date,
        description: newWorkExperience.description || "",
        technologies: newWorkExperience.technologies || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setWorkExperience([...workExperience, experience]);
      setNewWorkExperience({});
      setAddingWorkExperience(false);
    } catch (error) {
      console.error("Error adding work experience:", error);
      toast.error("Failed to add work experience");
    }
  };

  const handleRemoveCertificate = async (id: string) => {
    setCertificates(certificates.filter(cert => cert.id !== id));
  };

  const handleRemoveProject = async (id: string) => {
    setProjects(projects.filter(proj => proj.id !== id));
  };

  const handleRemoveWorkExperience = async (id: string) => {
    setWorkExperience(workExperience.filter(exp => exp.id !== id));
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      await onSave({
        realName: data.realName,
        cgpa: Number(data.cgpa),
        bio: data.bio || null,
        collegeName: data.collegeName || null,
        location: data.location || null,
        profilePictureUrl: data.profilePictureUrl || null,
        linkedinUrl: data.linkedinUrl || null,
        githubUrl: data.githubUrl || null,
        leetcodeUrl: data.leetcodeUrl || null,
        hackerrankUrl: data.hackerrankUrl || null,
        geeksforgeeksUrl: data.geeksforgeeksUrl || null,
        certificates,
        projects,
        workExperience
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile information here.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="realName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cgpa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CGPA</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={field.value}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profilePictureUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Picture URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://example.com/profile.jpg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Tell us about yourself"
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="collegeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>College Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Social Profiles</Label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="linkedinUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <LinkedinIcon className="w-4 h-4 text-blue-600" />
                        LinkedIn URL
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://linkedin.com/in/username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="githubUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <GithubIcon className="w-4 h-4" />
                        GitHub URL
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://github.com/username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="leetcodeUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <LeetcodeIcon className="w-4 h-4 text-orange-500" />
                        LeetCode URL
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://leetcode.com/username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="hackerrankUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <HackerrankIcon className="w-4 h-4 text-green-600" />
                        HackerRank URL
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://hackerrank.com/username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="geeksforgeeksUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <GeeksforGeeksIcon className="w-4 h-4 text-emerald-600" />
                        GeeksforGeeks URL
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://geeksforgeeks.org/user/username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Certificates Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-medium">Certificates</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => setAddingCertificate(true)}
                className="flex items-center gap-1"
              >
                <Plus size={16} /> Add
              </Button>
            </div>
            
            {certificates.length > 0 ? (
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert.id} className="bg-gray-50 p-3 rounded-md relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveCertificate(cert.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                        <Award size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{cert.title}</p>
                        <p className="text-sm text-gray-600">{cert.issuer}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Calendar size={14} className="mr-1" />
                          <span>
                            {cert.issue_date}
                            {cert.expiry_date ? ` - ${cert.expiry_date}` : ''}
                          </span>
                        </div>
                        {cert.credential_url && (
                          <a 
                            href={cert.credential_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 flex items-center mt-1 hover:underline"
                          >
                            <LinkIcon size={14} className="mr-1" /> View Certificate
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No certificates added yet</p>
            )}

            {addingCertificate && (
              <div className="bg-gray-50 p-4 rounded-md space-y-3">
                <Label>Certificate Title</Label>
                <Input 
                  value={newCertificate.title || ''} 
                  onChange={(e) => setNewCertificate({...newCertificate, title: e.target.value})}
                  placeholder="AWS Solutions Architect"
                />
                
                <Label>Issuer</Label>
                <Input 
                  value={newCertificate.issuer || ''} 
                  onChange={(e) => setNewCertificate({...newCertificate, issuer: e.target.value})}
                  placeholder="Amazon Web Services"
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Issue Date</Label>
                    <Input 
                      type="date" 
                      value={newCertificate.issue_date || ''} 
                      onChange={(e) => setNewCertificate({...newCertificate, issue_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Expiry Date (Optional)</Label>
                    <Input 
                      type="date" 
                      value={newCertificate.expiry_date || ''} 
                      onChange={(e) => setNewCertificate({...newCertificate, expiry_date: e.target.value})}
                    />
                  </div>
                </div>
                
                <Label>Credential URL (Optional)</Label>
                <Input 
                  value={newCertificate.credential_url || ''} 
                  onChange={(e) => setNewCertificate({...newCertificate, credential_url: e.target.value})}
                  placeholder="https://example.com/certificate/123"
                />
                
                <div className="flex justify-end gap-2 mt-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setAddingCertificate(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={handleAddCertificate}
                    disabled={!newCertificate.title || !newCertificate.issuer || !newCertificate.issue_date}
                  >
                    Add Certificate
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Projects Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-medium">Projects</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => setAddingProject(true)}
                className="flex items-center gap-1"
              >
                <Plus size={16} /> Add
              </Button>
            </div>
            
            {projects.length > 0 ? (
              <div className="space-y-3">
                {projects.map((project) => (
                  <div key={project.id} className="bg-gray-50 p-3 rounded-md relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveProject(project.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-green-100 p-2 text-green-600">
                        <FileText size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{project.title}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Calendar size={14} className="mr-1" />
                          <span>
                            {project.start_date}
                            {project.end_date ? ` - ${project.end_date}` : ' - Present'}
                          </span>
                        </div>
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.technologies.map((tech, index) => (
                              <span key={index} className="text-xs bg-gray-200 rounded-full px-2 py-0.5">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        {project.project_url && (
                          <a 
                            href={project.project_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 flex items-center mt-1 hover:underline"
                          >
                            <LinkIcon size={14} className="mr-1" /> View Project
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No projects added yet</p>
            )}

            {addingProject && (
              <div className="bg-gray-50 p-4 rounded-md space-y-3">
                <Label>Project Title</Label>
                <Input 
                  value={newProject.title || ''} 
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  placeholder="E-commerce Platform"
                />
                
                <Label>Description</Label>
                <Textarea 
                  value={newProject.description || ''} 
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  placeholder="Describe your project"
                  className="min-h-[80px]"
                />
                
                <Label>Technologies (comma separated)</Label>
                <Input 
                  value={newProject.technologies?.join(', ') || ''} 
                  onChange={(e) => setNewProject({
                    ...newProject, 
                    technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                  })}
                  placeholder="React, Node.js, MongoDB"
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Start Date</Label>
                    <Input 
                      type="date" 
                      value={newProject.start_date || ''} 
                      onChange={(e) => setNewProject({...newProject, start_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>End Date (Optional)</Label>
                    <Input 
                      type="date" 
                      value={newProject.end_date || ''} 
                      onChange={(e) => setNewProject({...newProject, end_date: e.target.value})}
                    />
                  </div>
                </div>
                
                <Label>Project URL (Optional)</Label>
                <Input 
                  value={newProject.project_url || ''} 
                  onChange={(e) => setNewProject({...newProject, project_url: e.target.value})}
                  placeholder="https://github.com/username/project"
                />
                
                <Label>Project Image URL (Optional)</Label>
                <Input 
                  value={newProject.image_url || ''} 
                  onChange={(e) => setNewProject({...newProject, image_url: e.target.value})}
                  placeholder="https://example.com/project-image.jpg"
                />
                
                <div className="flex justify-end gap-2 mt-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setAddingProject(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={handleAddProject}
                    disabled={!newProject.title || !newProject.description || !newProject.start_date}
                  >
                    Add Project
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Work Experience Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-medium">Work Experience</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => setAddingWorkExperience(true)}
                className="flex items-center gap-1"
              >
                <Plus size={16} /> Add
              </Button>
            </div>
            
            {workExperience.length > 0 ? (
              <div className="space-y-3">
                {workExperience.map((exp) => (
                  <div key={exp.id} className="bg-gray-50 p-3 rounded-md relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveWorkExperience(exp.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-purple-100 p-2 text-purple-600">
                        <Briefcase size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{exp.position}</p>
                        <p className="text-sm text-gray-600">{exp.company}</p>
                        {exp.location && (
                          <p className="text-sm text-gray-500">{exp.location}</p>
                        )}
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Calendar size={14} className="mr-1" />
                          <span>
                            {exp.start_date}
                            {exp.end_date ? ` - ${exp.end_date}` : ' - Present'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{exp.description}</p>
                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {exp.technologies.map((tech, index) => (
                              <span key={index} className="text-xs bg-gray-200 rounded-full px-2 py-0.5">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No work experience added yet</p>
            )}

            {addingWorkExperience && (
              <div className="bg-gray-50 p-4 rounded-md space-y-3">
                <Label>Position</Label>
                <Input 
                  value={newWorkExperience.position || ''} 
                  onChange={(e) => setNewWorkExperience({...newWorkExperience, position: e.target.value})}
                  placeholder="Software Engineer"
                />
                
                <Label>Company</Label>
                <Input 
                  value={newWorkExperience.company || ''} 
                  onChange={(e) => setNewWorkExperience({...newWorkExperience, company: e.target.value})}
                  placeholder="TechCorp Inc"
                />
                
                <Label>Location (Optional)</Label>
                <Input 
                  value={newWorkExperience.location || ''} 
                  onChange={(e) => setNewWorkExperience({...newWorkExperience, location: e.target.value})}
                  placeholder="San Francisco, CA"
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Start Date</Label>
                    <Input 
                      type="date" 
                      value={newWorkExperience.start_date || ''} 
                      onChange={(e) => setNewWorkExperience({...newWorkExperience, start_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>End Date (Optional)</Label>
                    <Input 
                      type="date" 
                      value={newWorkExperience.end_date || ''} 
                      onChange={(e) => setNewWorkExperience({...newWorkExperience, end_date: e.target.value})}
                    />
                  </div>
                </div>
                
                <Label>Description</Label>
                <Textarea 
                  value={newWorkExperience.description || ''} 
                  onChange={(e) => setNewWorkExperience({...newWorkExperience, description: e.target.value})}
                  placeholder="Describe your responsibilities and achievements"
                  className="min-h-[80px]"
                />
                
                <Label>Technologies (comma separated)</Label>
                <Input 
                  value={newWorkExperience.technologies?.join(', ') || ''} 
                  onChange={(e) => setNewWorkExperience({
                    ...newWorkExperience, 
                    technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                  })}
                  placeholder="React, TypeScript, AWS"
                />
                
                <div className="flex justify-end gap-2 mt-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setAddingWorkExperience(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={handleAddWorkExperience}
                    disabled={!newWorkExperience.position || !newWorkExperience.company || !newWorkExperience.start_date || !newWorkExperience.description}
                  >
                    Add Experience
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default ProfileEditDialog;
