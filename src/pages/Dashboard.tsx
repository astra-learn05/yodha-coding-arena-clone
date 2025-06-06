
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser, logoutUser } from '@/services/authService';
import { getUserGamificationData, type GamificationData } from '@/services/gamificationService';
import { useToast } from "@/hooks/use-toast";
import { LogOut, User, Home } from 'lucide-react';
import GamificationDisplay from '@/components/GamificationDisplay';
import PlatformLinks from '@/components/PlatformLinks';
import ProgressVisualization from '@/components/ProgressVisualization';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(getCurrentUser());
  const [gamificationData, setGamificationData] = useState<GamificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchGamificationData = async () => {
      try {
        const data = await getUserGamificationData(user.id);
        setGamificationData(data);
      } catch (error) {
        console.error('Error fetching gamification data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGamificationData();
  }, [user, navigate]);

  const handleLogout = async () => {
    await logoutUser();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6 text-yodha-primary" />
              <h1 className="text-2xl font-bold text-yodha-primary">Yodha Dashboard</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium text-gray-800">Welcome, {user.username}!</p>
              <p className="text-sm text-gray-500">{user.department} • {user.course}</p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleProfileClick}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Profile
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Gamification Section */}
        {isLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-500">Loading your progress...</div>
            </CardContent>
          </Card>
        ) : gamificationData ? (
          <GamificationDisplay gamificationData={gamificationData} />
        ) : (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-6 text-center">
              <p className="text-yellow-800">No gamification data found. Start solving problems to earn coins!</p>
            </CardContent>
          </Card>
        )}

        {/* Platform Access */}
        <PlatformLinks />

        {/* Progress Visualization */}
        <ProgressVisualization />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Easy Problems</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">24</div>
              <p className="text-xs text-blue-500">+2 this week</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-800">Medium Problems</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">12</div>
              <p className="text-xs text-yellow-500">+1 this week</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-800">Hard Problems</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">5</div>
              <p className="text-xs text-red-500">+1 this week</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">7 days</div>
              <p className="text-xs text-purple-500">Keep it up!</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
