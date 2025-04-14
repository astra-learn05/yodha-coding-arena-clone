
import { useState } from "react";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

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
  githubUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal(''))
});

type ProfileEditDialogProps = {
  userData: {
    realName: string;
    cgpa: number;
    skills: string[];
    bio: string | null;
    collegeName: string | null;
    location: string | null;
    profilePictureUrl: string | null;
    linkedinUrl: string | null;
    githubUrl: string | null;
  };
  onSave: (data: {
    realName: string;
    cgpa: number;
    skills: string[];
    bio: string | null;
    collegeName: string | null;
    location: string | null;
    profilePictureUrl: string | null;
    linkedinUrl: string | null;
    githubUrl: string | null;
  }) => void;
  onClose: () => void;
};

const ProfileEditDialog = ({ userData, onSave, onClose }: ProfileEditDialogProps) => {
  const [skills, setSkills] = useState<string[]>(userData.skills || []);
  const [newSkill, setNewSkill] = useState("");

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
      githubUrl: userData.githubUrl || ""
    },
  });

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted with data:", data, "and skills:", skills);
    onSave({
      realName: data.realName,
      cgpa: Number(data.cgpa),
      skills, // Pass the skills array for proper syncing with database
      bio: data.bio || null,
      collegeName: data.collegeName || null,
      location: data.location || null,
      profilePictureUrl: data.profilePictureUrl || null,
      linkedinUrl: data.linkedinUrl || null,
      githubUrl: data.githubUrl || null
    });
  };

  return (
    <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
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
                  <FormLabel>GitHub URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://github.com/username" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="outline" className="border-gray-200 text-sm pr-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddSkill}>
                Add
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default ProfileEditDialog;
