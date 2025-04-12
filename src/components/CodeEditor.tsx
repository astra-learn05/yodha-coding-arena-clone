
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, RefreshCw } from "lucide-react";

interface CodeEditorProps {
  defaultLanguage?: string;
  defaultCode?: string;
  onRun?: (code: string, language: string) => void;
}

const CodeEditor = ({
  defaultLanguage = "javascript",
  defaultCode = "// Write your code here\n\n",
  onRun
}: CodeEditorProps) => {
  const [code, setCode] = useState(defaultCode);
  const [language, setLanguage] = useState(defaultLanguage);
  const [isRunning, setIsRunning] = useState(false);
  
  const handleRun = () => {
    setIsRunning(true);
    
    // Simulate code execution
    setTimeout(() => {
      setIsRunning(false);
      if (onRun) {
        onRun(code, language);
      }
    }, 1500);
  };
  
  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
  ];
  
  return (
    <Card className="h-full">
      <CardHeader className="border-b pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Code Editor</CardTitle>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="editor" className="h-full">
          <TabsList className="px-4 pt-2 bg-gray-50 border-b">
            <TabsTrigger value="editor">Code</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="h-full m-0">
            <textarea
              className="w-full h-96 p-4 font-mono text-sm resize-none focus:outline-none"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
            />
          </TabsContent>
          
          <TabsContent value="results" className="m-0">
            <div className="h-96 p-4 font-mono text-sm bg-gray-50 overflow-auto">
              {isRunning ? (
                <div className="flex items-center justify-center h-full">
                  <RefreshCw className="animate-spin mr-2" size={18} />
                  <span>Running code...</span>
                </div>
              ) : (
                <p>Run your code to see results here.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t p-3">
        <Button 
          className="ml-auto bg-yodha-primary hover:bg-yodha-secondary"
          onClick={handleRun}
          disabled={isRunning}
        >
          <Play size={16} className="mr-2" />
          Run Code
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CodeEditor;
