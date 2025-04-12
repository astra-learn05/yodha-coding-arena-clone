
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { userData } from "@/data/userData";
import UserStats from "@/components/UserStats";
import { Settings } from "lucide-react";
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
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <UserStats 
                solved={user.stats.solved}
                totalProblems={user.stats.totalProblems}
                streak={user.stats.streak}
                rank={0}
                contributionPoints={0}
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-yodha-dark text-white py-6 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="font-bold text-xl">Yodha</p>
              <p className="text-sm opacity-70">Improve your coding skills with thousands of challenges</p>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-sm hover:text-yodha-primary transition-colors">Problems</a>
              <a href="#" className="text-sm hover:text-yodha-primary transition-colors">Profile</a>
              <a href="#" className="text-sm hover:text-yodha-primary transition-colors">About</a>
            </div>
          </div>
          <div className="mt-6 text-center text-sm opacity-70">
            <p>© 2025 Yodha Coding Arena. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
