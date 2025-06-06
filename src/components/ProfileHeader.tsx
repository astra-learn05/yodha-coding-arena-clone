
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, MapPin, School, Sparkles } from "lucide-react";
import { getCurrentUser, logout } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  LinkedinIcon,
  GithubIcon,
  LeetcodeIcon,
  HackerrankIcon,
  GeeksforGeeksIcon
} from "@/components/SocialIcons";

interface ProfileHeaderProps {
  profile: any;
}

const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleSettingsClick = () => {
    toast.info("Profile settings feature coming soon!");
    // TODO: Implement profile settings modal
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSettingsClick}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-5">
        <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
          {profile?.profile_picture_url ? (
            <AvatarImage src={profile.profile_picture_url} alt={profile.real_name} className="object-cover" />
          ) : (
            <AvatarFallback className="text-white text-3xl bg-gradient-to-br from-blue-500 to-indigo-600">
              {profile?.real_name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-gray-800">
            {profile?.real_name || user?.username || 'User'}
          </h2>
          {profile?.location && (
            <div className="flex items-center justify-center text-sm text-gray-500">
              <MapPin size={14} className="mr-1 text-indigo-500" />
              <span>{profile.location}</span>
            </div>
          )}
        </div>
        
        {profile?.bio && (
          <div className="py-3 px-4 bg-gray-50 rounded-lg border border-gray-100 w-full max-w-md">
            <p className="text-sm text-gray-700 italic text-center">{profile.bio}</p>
          </div>
        )}
        
        <div className="space-y-3 pt-2 w-full max-w-md">
          {profile?.college_name && (
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 text-gray-700">
                <School size={18} className="text-indigo-600" />
                <span className="text-sm font-medium">College</span>
              </div>
              <span className="font-medium text-gray-800 text-right text-sm">{profile.college_name}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700">
              <Sparkles size={16} className="text-indigo-500" />
              <span className="text-sm font-medium">CGPA</span>
            </div>
            <span className="font-semibold text-gray-800 bg-blue-50 px-2 py-0.5 rounded-md">
              {profile?.cgpa?.toFixed(1) || "N/A"}
            </span>
          </div>
        </div>

        {(profile?.linkedin_url || profile?.github_url || profile?.leetcode_url || 
          profile?.hackerrank_url || profile?.gfg_url) && (
          <div className="flex justify-center gap-3 mt-4 pt-4 border-t border-gray-100 w-full">
            {profile.linkedin_url && (
              <a 
                href={profile.linkedin_url.startsWith('http') ? profile.linkedin_url : `https://${profile.linkedin_url}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-blue-50 rounded-full text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors transform hover:scale-110 duration-200"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>
            )}
            {profile.github_url && (
              <a 
                href={profile.github_url.startsWith('http') ? profile.github_url : `https://${profile.github_url}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 rounded-full text-gray-800 hover:bg-gray-200 hover:text-gray-900 transition-colors transform hover:scale-110 duration-200"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
            )}
            {profile.leetcode_url && (
              <a 
                href={profile.leetcode_url.startsWith('http') ? profile.leetcode_url : `https://${profile.leetcode_url}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-orange-50 rounded-full text-orange-600 hover:bg-orange-100 hover:text-orange-700 transition-colors transform hover:scale-110 duration-200"
                aria-label="LeetCode Profile"
              >
                <LeetcodeIcon className="w-5 h-5" />
              </a>
            )}
            {profile.hackerrank_url && (
              <a 
                href={profile.hackerrank_url.startsWith('http') ? profile.hackerrank_url : `https://${profile.hackerrank_url}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-green-50 rounded-full text-green-600 hover:bg-green-100 hover:text-green-700 transition-colors transform hover:scale-110 duration-200"
                aria-label="HackerRank Profile"
              >
                <HackerrankIcon className="w-5 h-5" />
              </a>
            )}
            {profile.gfg_url && (
              <a 
                href={profile.gfg_url.startsWith('http') ? profile.gfg_url : `https://${profile.gfg_url}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-emerald-50 rounded-full text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors transform hover:scale-110 duration-200"
                aria-label="GeeksforGeeks Profile"
              >
                <GeeksforGeeksIcon className="w-5 h-5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
