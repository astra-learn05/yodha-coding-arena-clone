import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, BarChart, BookOpen, Code, Trophy } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProblemCard from "@/components/ProblemCard";
import { problems } from "@/data/problems";
import { userData } from "@/data/userData";

const Index = () => {
  const [tab, setTab] = useState("featured");
  
  // Filter for featured problems (top 4)
  const featuredProblems = problems.slice(0, 4);
  
  // Filter for problems that user has completed
  const completedProblems = problems.filter(problem => problem.completed);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-yodha-primary to-yodha-secondary py-16 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold mb-4">Welcome to Yodha Coding Arena</h1>
              <p className="text-lg mb-6">Master coding challenges, improve your skills, and prepare for technical interviews.</p>
              <div className="flex gap-4">
                <Button asChild size="lg" className="bg-white text-yodha-primary hover:bg-gray-100">
                  <Link to="/problems">
                    Start Coding
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Stats Overview */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500 font-normal flex items-center">
                    <BookOpen size={16} className="mr-2 text-yodha-primary" />
                    Total Problems
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{userData.stats.totalProblems}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500 font-normal flex items-center">
                    <Code size={16} className="mr-2 text-yodha-primary" />
                    Your Solutions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{userData.stats.solved}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500 font-normal flex items-center">
                    <BarChart size={16} className="mr-2 text-yodha-primary" />
                    Your Rank
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">#{userData.stats.rank}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500 font-normal flex items-center">
                    <Trophy size={16} className="mr-2 text-yodha-primary" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{userData.stats.achievements || 0}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Problem List */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Problems</h2>
              <Button asChild variant="outline">
                <Link to="/problems">View All Problems</Link>
              </Button>
            </div>
            
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="featured" className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {featuredProblems.map((problem) => (
                    <ProblemCard
                      key={problem.id}
                      id={problem.id}
                      title={problem.title}
                      difficulty={problem.difficulty}
                      category={problem.category}
                      completed={problem.completed}
                      locked={problem.locked}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="completed" className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {completedProblems.length > 0 ? (
                    completedProblems.map((problem) => (
                      <ProblemCard
                        key={problem.id}
                        id={problem.id}
                        title={problem.title}
                        difficulty={problem.difficulty}
                        category={problem.category}
                        completed={problem.completed}
                        locked={problem.locked}
                      />
                    ))
                  ) : (
                    <div className="col-span-4 text-center py-8 text-gray-500">
                      <p>You haven't completed any problems yet. Start solving!</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Recent Activity */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
            
            <div className="space-y-4">
              {userData.recentActivity.map((activity) => (
                <Card key={activity.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <Badge 
                        variant="outline" 
                        className={
                          activity.type === "solve" 
                            ? "border-difficulty-easy text-difficulty-easy" 
                            : activity.type === "comment" 
                              ? "border-yodha-primary text-yodha-primary" 
                              : "border-difficulty-medium text-difficulty-medium"
                        }
                      >
                        {activity.type === "solve" ? "Solved" : activity.type === "comment" ? "Comment" : "Submission"}
                      </Badge>
                      <div className="ml-4">
                        <Link to={`/problem/${activity.problemId}`} className="font-medium hover:text-yodha-primary">
                          {activity.problemTitle}
                        </Link>
                        <p className="text-sm text-gray-500">{activity.description}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {activity.timestamp}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-yodha-dark text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="font-bold text-xl">Yodha</p>
              <p className="text-sm opacity-70">Improve your coding skills with thousands of challenges</p>
            </div>
            <div className="flex gap-8">
              <Link to="/problems" className="text-sm hover:text-yodha-primary transition-colors">Problems</Link>
              <Link to="/profile" className="text-sm hover:text-yodha-primary transition-colors">Profile</Link>
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

export default Index;
