import { useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge as UiBadge } from "@/components/ui/badge";
import UserStats from "@/components/UserStats";
import { Award, Code, Brain, Zap, Trophy, MapPin, School, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

import {
  LinkedinIcon,
  GithubIcon,
  LeetcodeIcon,
  HackerrankIcon,
  GeeksforGeeksIcon
} from "@/components/SocialIcons";

import {
  getProfileById, 
  getProfileByPRN, 
  updateProfile,
  getUserBadges,
  getUserSkills,
  getUserAssessmentResults
} from "@/services/profileService";

import {
  getCompletedTopics,
  calculateLearningPathProgress,
  calculateProgressByDifficulty
} from "@/services/learningPathService";

import {
  checkAndAwardPathBadges
} from "@/services/badgeService";

import { SkillsSection, AssessmentsSection } from "@/components/ProfileSections";
