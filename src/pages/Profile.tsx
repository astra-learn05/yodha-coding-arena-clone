
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { userData } from "@/data/userData";
import UserStats from "@/components/UserStats";
import { Settings, Award, Code, Brain, Zap, Trophy } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ProfileEditDialog from "@/components/ProfileEditDialog";
import { toast } from "sonner";

const Profile = () => {
  const [user, setUser] = useState(userData);
  const [open, setOpen] = useState(false);

  const handleSaveProfile = (data: { realName: string; cgpa: number; skills: string[] }) => {
    setUser({
      ...user,
      realName: data.realName,
      cgpa: data.cgpa,
    });
    setOpen(false);
    toast.success("Profile updated successfully");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>{user.realName}</CardTitle>
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <button className="text-gray-500 hover:text-gray-700">
                          <Settings size={18} />
                        </button>
                      </DialogTrigger>
                      <ProfileEditDialog 
                        userData={user} 
                        onSave={handleSaveProfile} 
                        onClose={() => setOpen(false)} 
                      />
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">CGPA</span>
                      <span className="font-semibold">{user.cgpa.toFixed(1)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Skills</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-gray-200">JavaScript</Badge>
                  <Badge variant="outline" className="border-gray-200">Python</Badge>
                  <Badge variant="outline" className="border-gray-200">Java</Badge>
                  <Badge variant="outline" className="border-gray-200">Algorithms</Badge>
                  <Badge variant="outline" className="border-gray-200">Data Structures</Badge>
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-1">
                        <Award size={20} />
                      </div>
                      <span className="text-xs text-center">Top Coder</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-1">
                        <Code size={20} />
                      </div>
                      <span className="text-xs text-center">JavaScript Pro</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-1">
                        <Brain size={20} />
                      </div>
                      <span className="text-xs text-center">Algorithm Ace</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-1">
                        <Zap size={20} />
                      </div>
                      <span className="text-xs text-center">Fast Solver</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-1">
                        <Trophy size={20} />
                      </div>
                      <span className="text-xs text-center">Contest Winner</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <UserStats 
                solved={user.stats.solved}
                totalProblems={user.stats.totalProblems}
                easyProblems={user.stats.easyProblems}
                mediumProblems={user.stats.mediumProblems}
                hardProblems={user.stats.hardProblems}
                streak={user.stats.streak}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
