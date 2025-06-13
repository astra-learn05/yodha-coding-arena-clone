
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Bookmark, CheckCircle2, Heart, MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import CodeEditor from "@/components/CodeEditor";
import { problems } from "@/data/problems";

const ProblemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("description");
  
  // Find the problem by ID
  const problem = problems.find(p => p.id === Number(id));
  
  // If problem not found, show error message
  if (!problem) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
          <Card>
            <CardContent className="py-8 px-6">
              <h1 className="text-2xl font-bold mb-4">Problem Not Found</h1>
              <p className="mb-6">The problem you are looking for does not exist or has been removed.</p>
              <Button asChild>
                <Link to="/problems">Back to Problems</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // Map difficulty to colors
  const difficultyColor = {
    easy: "bg-difficulty-easy hover:bg-difficulty-easy/90",
    medium: "bg-difficulty-medium hover:bg-difficulty-medium/90",
    hard: "bg-difficulty-hard hover:bg-difficulty-hard/90"
  };
  
  const difficultyLabel = {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard"
  };
  
  const handleRunCode = (code: string, language: string) => {
    console.log(`Running ${language} code:`, code);
    // In a real app, this would submit the code to a backend for execution
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-4">
        <Link to="/problems" className="inline-flex items-center text-gray-600 hover:text-yodha-primary mb-4">
          <ArrowLeft size={16} className="mr-1" />
          Back to Problems
        </Link>
      </div>
      
      <main className="flex-1">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Problem Description Panel */}
            <div className="lg:w-1/2">
              <Card className="h-full">
                <CardHeader className="border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={difficultyColor[problem.difficulty]}>
                          {difficultyLabel[problem.difficulty]}
                        </Badge>
                        {problem.completed && (
                          <Badge variant="outline" className="border-difficulty-easy text-difficulty-easy">
                            <CheckCircle2 size={12} className="mr-1" />
                            Solved
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-2xl">{problem.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon">
                        <Bookmark size={16} />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Heart size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <div>
                  <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="w-full justify-start border-b rounded-none px-6">
                      <TabsTrigger value="description">Description</TabsTrigger>
                      <TabsTrigger value="solution">Solution</TabsTrigger>
                      <TabsTrigger value="discussion">Discussion</TabsTrigger>
                      <TabsTrigger value="submissions">Submissions</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="description" className="m-0">
                      <CardContent className="prose max-w-none">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center">
                              <ThumbsUp size={16} className="mr-1 text-gray-600" />
                              <span className="text-sm text-gray-600">{problem.likes}</span>
                            </div>
                            <div className="flex items-center">
                              <ThumbsDown size={16} className="mr-1 text-gray-600" />
                              <span className="text-sm text-gray-600">{problem.dislikes}</span>
                            </div>
                            <Badge variant="outline">Acceptance: {problem.acceptance}</Badge>
                          </div>
                          <Badge variant="outline">{problem.category}</Badge>
                        </div>
                        
                        <div className="whitespace-pre-line mb-4">
                          {problem.description}
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Examples:</h3>
                          {problem.examples.map((example, index) => (
                            <div key={index} className="mb-4 p-4 bg-gray-50 rounded-md">
                              <p className="font-mono mb-2">Input: {example.input}</p>
                              <p className="font-mono mb-2">Output: {example.output}</p>
                              {example.explanation && (
                                <p className="text-gray-600">Explanation: {example.explanation}</p>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Constraints:</h3>
                          <ul className="list-disc pl-5">
                            {problem.constraints.map((constraint, index) => (
                              <li key={index} className="text-gray-600">{constraint}</li>
                            ))}
                          </ul>
                        </div>
                        
                        {problem.companies && problem.companies.length > 0 && (
                          <div className="mt-6">
                            <h3 className="text-lg font-medium mb-2">Companies:</h3>
                            <div className="flex flex-wrap gap-2">
                              {problem.companies.map((company, index) => (
                                <Badge key={index} variant="outline">{company}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </TabsContent>
                    
                    <TabsContent value="solution" className="m-0">
                      <CardContent>
                        <div className="py-12 text-center text-gray-500">
                          <p>Please solve the problem first to unlock the solution.</p>
                        </div>
                      </CardContent>
                    </TabsContent>
                    
                    <TabsContent value="discussion" className="m-0">
                      <CardContent>
                        <div className="flex items-center justify-between mb-6">
                          <p className="text-lg font-medium">Discussion (24)</p>
                          <Button>
                            <MessageSquare size={16} className="mr-2" />
                            New Post
                          </Button>
                        </div>
                        
                        <div className="py-8 text-center text-gray-500">
                          <p>Discussion threads will appear here.</p>
                        </div>
                      </CardContent>
                    </TabsContent>
                    
                    <TabsContent value="submissions" className="m-0">
                      <CardContent>
                        <div className="py-12 text-center text-gray-500">
                          <p>You haven't submitted any solutions for this problem yet.</p>
                        </div>
                      </CardContent>
                    </TabsContent>
                  </Tabs>
                </div>
              </Card>
            </div>
            
            {/* Code Editor Panel */}
            <div className="lg:w-1/2">
              <CodeEditor onRun={handleRunCode} />
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
              <Link to="/problems" className="text-sm hover:text-yodha-primary transition-colors">Problems</Link>
              <Link to="/profile" className="text-sm hover:text-yodha-primary transition-colors">Profile</Link>
              <a href="#" className="text-sm hover:text-yodha-primary transition-colors">About</a>
            </div>
          </div>
          <div className="mt-6 text-center text-sm opacity-70">
            <p>© 2025 Ikshvaku Innovations. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProblemDetail;
