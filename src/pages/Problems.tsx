
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Search, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { problems } from "@/data/problems";

const Problems = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<boolean | null>(null);
  
  // Apply filters
  const filteredProblems = problems.filter(problem => {
    // Search filter
    if (searchTerm && !problem.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Difficulty filter
    if (difficultyFilter && problem.difficulty !== difficultyFilter) {
      return false;
    }
    
    // Status filter
    if (statusFilter !== null) {
      if (statusFilter && !problem.completed) {
        return false;
      }
      if (!statusFilter && problem.completed) {
        return false;
      }
    }
    
    return true;
  });
  
  const resetFilters = () => {
    setSearchTerm("");
    setDifficultyFilter(null);
    setStatusFilter(null);
  };
  
  const difficultyBadge = {
    easy: <Badge className="bg-difficulty-easy hover:bg-difficulty-easy/90">Easy</Badge>,
    medium: <Badge className="bg-difficulty-medium hover:bg-difficulty-medium/90">Medium</Badge>,
    hard: <Badge className="bg-difficulty-hard hover:bg-difficulty-hard/90">Hard</Badge>
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Problems</h1>
          
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search problems by title..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={difficultyFilter === "easy" ? "default" : "outline"}
                  className={difficultyFilter === "easy" ? "bg-difficulty-easy hover:bg-difficulty-easy/90" : ""}
                  onClick={() => setDifficultyFilter(difficultyFilter === "easy" ? null : "easy")}
                >
                  Easy
                </Button>
                <Button 
                  variant={difficultyFilter === "medium" ? "default" : "outline"}
                  className={difficultyFilter === "medium" ? "bg-difficulty-medium hover:bg-difficulty-medium/90" : ""}
                  onClick={() => setDifficultyFilter(difficultyFilter === "medium" ? null : "medium")}
                >
                  Medium
                </Button>
                <Button 
                  variant={difficultyFilter === "hard" ? "default" : "outline"}
                  className={difficultyFilter === "hard" ? "bg-difficulty-hard hover:bg-difficulty-hard/90" : ""}
                  onClick={() => setDifficultyFilter(difficultyFilter === "hard" ? null : "hard")}
                >
                  Hard
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  className={statusFilter === true ? "bg-blue-50 border-blue-200 text-blue-600" : ""}
                  onClick={() => setStatusFilter(statusFilter === true ? null : true)}
                >
                  <CheckCircle2 className={`mr-2 h-4 w-4 ${statusFilter === true ? "text-blue-600" : "text-gray-400"}`} />
                  Solved
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={statusFilter === false ? "bg-blue-50 border-blue-200 text-blue-600" : ""}
                  onClick={() => setStatusFilter(statusFilter === false ? null : false)}
                >
                  <CheckCircle2 className={`mr-2 h-4 w-4 ${statusFilter === false ? "text-blue-600" : "text-gray-400"}`} />
                  Unsolved
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-gray-500"
              >
                Reset Filters
              </Button>
            </div>
          </div>
          
          {/* Problem Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Tabs defaultValue="all">
              <div className="border-b px-4">
                <TabsList className="h-12">
                  <TabsTrigger value="all">All Problems</TabsTrigger>
                  <TabsTrigger value="categories">By Category</TabsTrigger>
                  <TabsTrigger value="companies">By Company</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Status</TableHead>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="w-24">Difficulty</TableHead>
                      <TableHead className="w-32 hidden md:table-cell">Acceptance</TableHead>
                      <TableHead className="w-32 hidden md:table-cell">Frequency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProblems.map(problem => (
                      <TableRow key={problem.id}>
                        <TableCell className="p-2">
                          {problem.completed && <CheckCircle2 className="h-5 w-5 text-difficulty-easy" />}
                        </TableCell>
                        <TableCell className="font-medium">{problem.id}</TableCell>
                        <TableCell>
                          {problem.locked ? (
                            <div className="flex items-center text-gray-400">
                              <span>{problem.title}</span>
                            </div>
                          ) : (
                            <Link to={`/problem/${problem.id}`} className="hover:text-yodha-primary">
                              {problem.title}
                            </Link>
                          )}
                        </TableCell>
                        <TableCell>{difficultyBadge[problem.difficulty]}</TableCell>
                        <TableCell className="hidden md:table-cell">{problem.acceptance}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yodha-primary h-2 rounded-full" 
                              style={{ width: `${problem.frequency}%` }}
                            ></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {filteredProblems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No problems match your filters. Try adjusting your search criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="categories" className="m-0 p-6">
                <div className="text-center text-gray-500 py-8">
                  Categories view coming soon!
                </div>
              </TabsContent>
              
              <TabsContent value="companies" className="m-0 p-6">
                <div className="text-center text-gray-500 py-8">
                  Companies view coming soon!
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
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

export default Problems;
