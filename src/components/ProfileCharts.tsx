
import React from "react";
import { format, parseISO } from "date-fns";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { ChartBarStacked, ChartPie, ChartBar, ChartLine } from "lucide-react";

interface LearningPathProgressData {
  learningPath: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
  };
  progress: number;
}

interface ProfileChartsProps {
  difficultyProgress?: {
    easy: { total: number; completed: number };
    medium: { total: number; completed: number };
    hard: { total: number; completed: number };
    theory: { total: number; completed: number };
  };
  learningPathProgress?: LearningPathProgressData[];
}

export const ProfileCharts: React.FC<ProfileChartsProps> = ({
  difficultyProgress,
  learningPathProgress = [],
}) => {
  // Transform difficulty progress data for Pie Chart
  const difficultyData = React.useMemo(() => {
    if (!difficultyProgress) return [];

    return [
      {
        name: "Easy",
        value: difficultyProgress.easy.completed,
        color: "#4ade80", // green-400
      },
      {
        name: "Medium",
        value: difficultyProgress.medium.completed,
        color: "#facc15", // yellow-400
      },
      {
        name: "Hard",
        value: difficultyProgress.hard.completed,
        color: "#f87171", // red-400
      },
      {
        name: "Theory",
        value: difficultyProgress.theory.completed,
        color: "#a78bfa", // purple-400
      },
    ].filter((item) => item.value > 0);
  }, [difficultyProgress]);

  // Calculate remaining vs completed problems for bar chart
  const completionData = React.useMemo(() => {
    if (!difficultyProgress) return [];

    return [
      {
        name: "Easy",
        completed: difficultyProgress.easy.completed,
        remaining:
          difficultyProgress.easy.total - difficultyProgress.easy.completed,
      },
      {
        name: "Medium",
        completed: difficultyProgress.medium.completed,
        remaining:
          difficultyProgress.medium.total - difficultyProgress.medium.completed,
      },
      {
        name: "Hard",
        completed: difficultyProgress.hard.completed,
        remaining:
          difficultyProgress.hard.total - difficultyProgress.hard.completed,
      },
      {
        name: "Theory",
        completed: difficultyProgress.theory.completed,
        remaining:
          difficultyProgress.theory.total - difficultyProgress.theory.completed,
      },
    ];
  }, [difficultyProgress]);

  // Transform learning path progress data for Bar Chart
  const learningPathData = React.useMemo(() => {
    return learningPathProgress.map((path) => ({
      name: path.learningPath.title.slice(0, 15) + "...",
      fullName: path.learningPath.title,
      progress: path.progress,
      difficulty: path.learningPath.difficulty,
    }));
  }, [learningPathProgress]);

  // Generate radar chart data based on skill distribution
  const radarData = React.useMemo(() => {
    if (!difficultyProgress) return [];

    const total =
      difficultyProgress.easy.total +
      difficultyProgress.medium.total +
      difficultyProgress.hard.total +
      difficultyProgress.theory.total;

    const completed =
      difficultyProgress.easy.completed +
      difficultyProgress.medium.completed +
      difficultyProgress.hard.completed +
      difficultyProgress.theory.completed;

    return [
      {
        subject: "Easy Problems",
        A: difficultyProgress.easy.completed,
        B: difficultyProgress.easy.total,
        fullMark: difficultyProgress.easy.total,
      },
      {
        subject: "Medium Problems",
        A: difficultyProgress.medium.completed,
        B: difficultyProgress.medium.total,
        fullMark: difficultyProgress.medium.total,
      },
      {
        subject: "Hard Problems",
        A: difficultyProgress.hard.completed,
        B: difficultyProgress.hard.total,
        fullMark: difficultyProgress.hard.total,
      },
      {
        subject: "Theory",
        A: difficultyProgress.theory.completed,
        B: difficultyProgress.theory.total,
        fullMark: difficultyProgress.theory.total,
      },
      {
        subject: "Total Progress",
        A: completed,
        B: total,
        fullMark: total,
      },
    ];
  }, [difficultyProgress]);

  // Get color for learning path based on difficulty
  const getLearningPathColor = (difficulty: string) => {
    const lowerDifficulty = difficulty.toLowerCase();
    if (lowerDifficulty === "easy") return "#4ade80"; // green-400
    if (lowerDifficulty === "medium") return "#facc15"; // yellow-400
    if (lowerDifficulty === "hard") return "#f87171"; // red-400
    return "#a78bfa"; // purple-400 (default)
  };

  if (!difficultyProgress) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Pie Chart - Problem Distribution */}
      <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-2 bg-gradient-to-r from-cyan-50 to-blue-50 border-b">
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-cyan-800">
            <ChartPie size={20} className="text-cyan-600" />
            Problems Solved by Type
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-72">
            <ChartContainer
              config={{
                easy: { color: "#4ade80" },
                medium: { color: "#facc15" },
                hard: { color: "#f87171" },
                theory: { color: "#a78bfa" },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    labelLine={{ stroke: "#888", strokeWidth: 1 }}
                  >
                    {difficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart - Completed vs Remaining */}
      <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-2 bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-800">
            <ChartBarStacked size={20} className="text-indigo-600" />
            Completed vs. Remaining
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-72">
            <ChartContainer
              config={{
                completed: { color: "#3b82f6" }, // blue-500
                remaining: { color: "#e5e7eb" }, // gray-200
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={completionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar
                    dataKey="completed"
                    stackId="a"
                    fill="var(--color-completed)"
                    name="Completed"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="remaining"
                    stackId="a"
                    fill="var(--color-remaining)"
                    name="Remaining"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart - Learning Path Progress */}
      {learningPathData.length > 0 && (
        <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-green-800">
              <ChartBar size={20} className="text-green-600" />
              Learning Path Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={learningPathData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value}%`,
                      props.payload.fullName,
                    ]}
                  />
                  <Bar dataKey="progress" radius={[0, 4, 4, 0]}>
                    {learningPathData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getLearningPathColor(entry.difficulty)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Radar Chart - Skills Distribution */}
      <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-yellow-50 border-b">
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-amber-800">
            <ChartLine size={20} className="text-amber-600" />
            Skills Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius="70%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar
                  name="Completed"
                  dataKey="A"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCharts;
