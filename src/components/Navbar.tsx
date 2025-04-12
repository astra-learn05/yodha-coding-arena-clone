
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Code, 
  Home, 
  User, 
  Trophy,
  LogIn
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const isMobile = useIsMobile();

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-yodha-primary">Yodha</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-yodha-primary transition-colors">
            {isMobile ? <Home size={20} /> : (
              <>
                <Home size={18} />
                <span>Home</span>
              </>
            )}
          </Link>
          
          <Link to="/problems" className="flex items-center space-x-2 text-gray-600 hover:text-yodha-primary transition-colors">
            {isMobile ? <BookOpen size={20} /> : (
              <>
                <BookOpen size={18} />
                <span>Problems</span>
              </>
            )}
          </Link>
          
          <Link to="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-yodha-primary transition-colors">
            {isMobile ? <User size={20} /> : (
              <>
                <User size={18} />
                <span>Profile</span>
              </>
            )}
          </Link>

          <Button className="bg-yodha-primary hover:bg-yodha-secondary">
            {isMobile ? <LogIn size={18} /> : "Sign In"}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
