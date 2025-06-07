
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, FileText, ChevronDown, ChevronUp, Calendar, Award as AwardIcon, Target } from "lucide-react";
import { UserSkill, UserAssessmentResult } from "@/services/profileService";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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

// Assessments Section
export const AssessmentsSection = ({ assessmentResults }: { assessmentResults: UserAssessmentResult[] }) => {
  // Group results by assessment
  const groupedAssessments = assessmentResults.reduce((acc, result) => {
    const assessmentId = result.assessment_id;
    if (!acc[assessmentId]) {
      acc[assessmentId] = {
        assessment: result.assessment,
        results: []
      };
    }
    acc[assessmentId].results.push(result);
    return acc;
  }, {} as Record<string, { assessment: any; results: UserAssessmentResult[] }>);

  const uniqueAssessments = Object.values(groupedAssessments);

  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b">
        <CardTitle className="text-lg font-bold text-green-800 flex items-center gap-2">
          <FileText size={18} className="text-green-600" />
          Assessments
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        {uniqueAssessments.length > 0 ? (
          <div className="space-y-3">
            {uniqueAssessments.map(({ assessment, results }) => (
              <AssessmentCard key={assessment?.id} assessment={assessment} results={results} />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">No assessments completed yet</div>
        )}
      </CardContent>
    </Card>
  );
};

const AssessmentCard = ({ assessment, results }: { assessment: any; results: UserAssessmentResult[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const bestResult = results.reduce((best, current) => 
    current.percentage > best.percentage ? current : best
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <AwardIcon size={16} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{assessment?.name || 'Unknown Assessment'}</h3>
              <p className="text-sm text-gray-600">
                Best Score: {bestResult.total_score}/{bestResult.total_marks} ({bestResult.percentage.toFixed(1)}%)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {results.length} attempt{results.length !== 1 ? 's' : ''}
            </Badge>
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="space-y-2 pl-4">
          {results.map((result, index) => (
            <div key={result.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Target size={12} className="text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    Attempt {results.length - index}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={12} />
                    <span>{new Date(result.completed_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">
                  {result.total_score}/{result.total_marks}
                </p>
                <p className="text-sm text-gray-600">
                  {result.percentage.toFixed(1)}%
                </p>
                {result.is_cheated && (
                  <Badge variant="destructive" className="text-xs mt-1">
                    Flagged
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
