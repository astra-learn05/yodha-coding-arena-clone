
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProblemCardProps {
  id: number;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  completed?: boolean;
  locked?: boolean;
}

const ProblemCard = ({ id, title, difficulty, category, completed, locked }: ProblemCardProps) => {
  const difficultyColor = {
    easy: "bg-difficulty-easy hover:bg-difficulty-easy/90",
    medium: "bg-difficulty-medium hover:bg-difficulty-medium/90",
    hard: "bg-difficulty-hard hover:bg-difficulty-hard/90"
  };

  const difficultyLabel = {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard"
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md", 
      locked ? "opacity-70" : "",
      completed ? "border-l-4 border-l-difficulty-easy" : ""
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium group">
            {locked ? (
              <div className="flex items-center gap-2">
                <Lock size={16} />
                <span>{title}</span>
              </div>
            ) : (
              <Link to={`/problem/${id}`} className="hover:text-yodha-primary transition-colors">
                {title}
              </Link>
            )}
          </CardTitle>
          
          {completed && (
            <div className="text-difficulty-easy">
              <Check size={18} />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-gray-600 mb-2">{category}</p>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between">
        <Badge className={difficultyColor[difficulty]}>
          {difficultyLabel[difficulty]}
        </Badge>
        
        <div className="text-xs text-gray-500">
          #{id}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProblemCard;
