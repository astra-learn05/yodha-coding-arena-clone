
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code } from "lucide-react";
import { UserSkill } from "@/services/profileService";

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
