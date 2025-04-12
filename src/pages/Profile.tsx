import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, LinkIcon, MapPin } from "lucide-react";
import { userData } from "@/data/userData";

const Profile = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-center mb-3">
                    <div className="w-24 h-24 bg-gradient-to-br from-yodha-primary to-yodha-secondary rounded-full flex items-center justify-center text-white text-3xl font-semibold border-4 border-white">
                      {userData.username.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <CardTitle className="text-center">{userData.realName}</CardTitle>
                  <CardDescription className="text-center">@{userData.username}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">{userData.bio}</p>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={14} className="mr-2" />
                      {userData.location}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon size={14} className="mr-2" />
                      Joined {userData.joinDate}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Badges</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                    7 Day Streak
                  </Badge>
                  <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                    Problem Solver
                  </Badge>
                  <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">
                    Early Adopter
                  </Badge>
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
                solved={userData.stats.solved}
                totalProblems={userData.stats.totalProblems}
                streak={userData.stats.streak}
                rank={userData.stats.rank}
                contributionPoints={userData.stats.contributionPoints}
              />
              
              <div className="mt-6">
                <Tabs defaultValue="activity">
                  <TabsList className="mb-4">
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="submissions">Submissions</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="activity" className="m-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {userData.recentActivity.map((activity) => (
                            <div key={activity.id} className="flex pb-4 border-b last:border-0 last:pb-0">
                              <div className="mr-4 flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                  {activity.type === "solve" ? "✓" : activity.type === "comment" ? "💬" : "📝"}
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <span className="font-medium">{activity.problemTitle}</span>
                                  <span className="ml-2 text-xs text-gray-500">{activity.timestamp}</span>
                                </div>
                                <p className="text-sm text-gray-600">{activity.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="submissions" className="m-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Submissions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Problem</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Language</TableHead>
                              <TableHead>Runtime</TableHead>
                              <TableHead>Memory</TableHead>
                              <TableHead className="text-right">Submitted</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {userData.submissions.map((submission) => (
                              <TableRow key={submission.id}>
                                <TableCell className="font-medium">{submission.problemTitle}</TableCell>
                                <TableCell>
                                  <Badge className={
                                    submission.status === "Accepted" 
                                      ? "bg-difficulty-easy" 
                                      : submission.status === "Wrong Answer" 
                                        ? "bg-difficulty-hard" 
                                        : "bg-difficulty-medium"
                                  }>
                                    {submission.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>{submission.language}</TableCell>
                                <TableCell>{submission.runtime}</TableCell>
                                <TableCell>{submission.memory}</TableCell>
                                <TableCell className="text-right flex items-center justify-end text-sm text-gray-500">
                                  <Clock size={14} className="mr-1" />
                                  {submission.timestamp}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
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
