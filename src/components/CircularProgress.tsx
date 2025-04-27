
import { cn } from "@/lib/utils";
import { CircleDashed } from "lucide-react";

interface CircularProgressProps {
  value: number;
  label: string;
  total: number;
  completed: number;
  className?: string;
  strokeColor?: string;
}

const CircularProgress = ({ 
  value, 
  label, 
  total,
  completed,
  className,
  strokeColor = "#3b82f6"
}: CircularProgressProps) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={cn("relative flex flex-col items-center justify-center", className)}>
      <div className="relative">
        <CircleDashed 
          size={100} 
          className="text-gray-200 transform -rotate-90"
        />
        <svg
          className="absolute top-0 left-0 transform -rotate-90"
          width="100"
          height="100"
        >
          <circle
            stroke={strokeColor}
            strokeWidth="2"
            fill="none"
            r={radius}
            cx="50"
            cy="50"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              transition: "stroke-dashoffset 0.5s ease"
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-lg font-semibold">{value}%</span>
          <span className="text-xs text-gray-500">{completed}/{total}</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium">{label}</span>
    </div>
  );
};

export default CircularProgress;
