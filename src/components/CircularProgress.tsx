
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
      <div className="relative group">
        <CircleDashed 
          size={100} 
          className="text-gray-200 transform -rotate-90" 
          strokeWidth={1}
        />
        <svg
          className="absolute top-0 left-0 transform -rotate-90"
          width="100"
          height="100"
          viewBox="0 0 100 100"
        >
          <circle
            stroke={strokeColor}
            strokeWidth="3"
            fill="none"
            r={radius}
            cx="50"
            cy="50"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              transition: "stroke-dashoffset 0.8s ease"
            }}
            className="drop-shadow-md"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-lg font-bold text-gray-800 group-hover:scale-110 transition-transform">{value}%</span>
          <span className="text-xs text-gray-500">{completed}/{total}</span>
        </div>
      </div>
      <span className="mt-3 text-sm font-medium text-gray-700">{label}</span>
    </div>
  );
};

export default CircularProgress;
