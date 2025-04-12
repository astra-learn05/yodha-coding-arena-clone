
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-yodha-primary">Yodha</Link>
        <nav className="flex items-center gap-6">
          <Link to="/problems" className="text-gray-600 hover:text-yodha-primary">Problems</Link>
          <Link to="/profile" className="text-gray-600 hover:text-yodha-primary">Profile</Link>
          <Button variant="outline" size="sm">
            Sign Out
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
