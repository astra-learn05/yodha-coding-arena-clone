
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, BarChart3, Target } from "lucide-react";

const PlatformButtons = () => {
  const platforms = [
    {
      name: "Astra",
      description: "Learning Paths & Resources",
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
      url: "#" // Replace with actual Astra URL
    },
    {
      name: "Drona",
      description: "DSA Visualizer",
      icon: BarChart3,
      color: "from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700",
      url: "#" // Replace with actual Drona URL
    },
    {
      name: "Yudha",
      description: "Assessment Platform",
      icon: Target,
      color: "from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700",
      url: "#" // Replace with actual Yudha URL
    }
  ];

  const handlePlatformClick = (url: string, name: string) => {
    if (url === "#") {
      console.log(`Redirecting to ${name}...`);
      // Replace with actual navigation logic
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <Card className="mb-6 shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Access</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {platforms.map((platform) => {
            const IconComponent = platform.icon;
            return (
              <Button
                key={platform.name}
                onClick={() => handlePlatformClick(platform.url, platform.name)}
                className={`h-20 bg-gradient-to-r ${platform.color} ${platform.hoverColor} text-white shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <IconComponent className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-semibold">{platform.name}</div>
                    <div className="text-xs opacity-90">{platform.description}</div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformButtons;
