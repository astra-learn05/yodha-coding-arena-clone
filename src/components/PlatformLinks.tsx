
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Code, BookOpen, Zap } from 'lucide-react';

const PlatformLinks = () => {
  const platforms = [
    {
      name: "Astra Platform",
      description: "Competitive Programming & Contests",
      icon: Code,
      color: "from-blue-500 to-blue-600",
      link: "#", // Replace with actual Astra platform URL
    },
    {
      name: "Drona Platform", 
      description: "Learning Paths & Tutorials",
      icon: BookOpen,
      color: "from-green-500 to-green-600",
      link: "#", // Replace with actual Drona platform URL
    },
    {
      name: "Yudha Platform",
      description: "Practice Problems & Challenges", 
      icon: Zap,
      color: "from-purple-500 to-purple-600",
      link: "#", // Replace with actual Yudha platform URL
    }
  ];

  const handlePlatformClick = (platformName: string, link: string) => {
    console.log(`Navigating to ${platformName}:`, link);
    // For now, just log. Replace with actual navigation logic
    // window.open(link, '_blank');
  };

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">Platform Access</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <div key={platform.name} className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r ${platform.color} rounded-lg opacity-0 group-hover:opacity-10 transition-opacity`} />
                <Card className="border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 relative">
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r ${platform.color} flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{platform.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{platform.description}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handlePlatformClick(platform.name, platform.link)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Access Platform
                    </Button>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformLinks;
