import { supabase } from "@/integrations/supabase/client";

export type LearningPath = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  created_at: string;
  updated_at: string;
};

export type Topic = {
  id: string;
  name: string;
  learning_path_id: string;
  created_at: string;
  updated_at: string;
};

export type Question = {
  id: string;
  title: string;
  topic_id: string;
  difficulty: string;
  solution_link: string;
  created_at: string;
  updated_at: string;
};

export type UserProgress = {
  id: string;
  user_id: string;
  question_id: string;
  is_completed: boolean;
  is_marked_for_revision: boolean;
  created_at: string;
  updated_at: string;
};

// Get all learning paths
export const getLearningPaths = async (): Promise<LearningPath[]> => {
  const { data, error } = await supabase
    .from('learning_paths')
    .select('*');

  if (error) {
    console.error('Error fetching learning paths:', error);
    return [];
  }

  return data || [];
};

// Get all topics for a learning path
export const getTopicsByLearningPath = async (learningPathId: string): Promise<Topic[]> => {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .eq('learning_path_id', learningPathId);

  if (error) {
    console.error('Error fetching topics:', error);
    return [];
  }

  return data || [];
};

// Get all topics
export const getAllTopics = async (): Promise<Topic[]> => {
  const { data, error } = await supabase
    .from('topics')
    .select('*');

  if (error) {
    console.error('Error fetching all topics:', error);
    return [];
  }

  return data || [];
};

// Get questions for a topic
export const getQuestionsByTopic = async (topicId: string): Promise<Question[]> => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('topic_id', topicId);

  if (error) {
    console.error('Error fetching questions:', error);
    return [];
  }

  return data || [];
};

// Get user progress for all questions
export const getUserProgress = async (userId: string): Promise<UserProgress[]> => {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user progress:', error);
    return [];
  }

  return data || [];
};

// Get completed topics for a user
export const getCompletedTopics = async (userId: string): Promise<string[]> => {
  // Strategy: Find all topics where all questions are completed by the user
  
  // 1. Get all topics
  const topics = await getAllTopics();
  
  // 2. Get user progress
  const userProgress = await getUserProgress(userId);
  const completedQuestionIds = new Set(
    userProgress
      .filter(progress => progress.is_completed)
      .map(progress => progress.question_id)
  );
  
  const completedTopicNames: string[] = [];
  
  // 3. For each topic, check if all its questions are completed
  for (const topic of topics) {
    const questions = await getQuestionsByTopic(topic.id);
    
    // If no questions for a topic, consider it not completed
    if (questions.length === 0) continue;
    
    const allCompleted = questions.every(question => 
      completedQuestionIds.has(question.id)
    );
    
    if (allCompleted) {
      completedTopicNames.push(topic.name);
    }
  }
  
  return completedTopicNames;
};

// Check if a learning path is completed by a user
export const isLearningPathCompleted = async (userId: string, pathDifficulty: string): Promise<boolean> => {
  // Get all learning paths with the specified difficulty
  const { data: paths, error } = await supabase
    .from('learning_paths')
    .select('*')
    .eq('difficulty', pathDifficulty);
  
  if (error || !paths || paths.length === 0) {
    console.error('Error fetching learning paths:', error);
    return false;
  }
  
  const userProgress = await getUserProgress(userId);
  const completedQuestionIds = new Set(
    userProgress
      .filter(progress => progress.is_completed)
      .map(progress => progress.question_id)
  );
  
  // For each learning path with the matching difficulty
  for (const path of paths) {
    // Get all topics for this learning path
    const topics = await getTopicsByLearningPath(path.id);
    
    let allQuestionsCompleted = true;
    
    // For each topic, check if all questions are completed
    for (const topic of topics) {
      const questions = await getQuestionsByTopic(topic.id);
      
      // If no questions for a topic, move to the next topic
      if (questions.length === 0) continue;
      
      // Check if all questions in this topic are completed
      const topicCompleted = questions.every(question => 
        completedQuestionIds.has(question.id)
      );
      
      if (!topicCompleted) {
        allQuestionsCompleted = false;
        break;
      }
    }
    
    // If at least one path with this difficulty is fully completed
    if (allQuestionsCompleted) {
      return true;
    }
  }
  
  return false;
};

// Check if all learning paths are completed by a user
export const areAllLearningPathsCompleted = async (userId: string): Promise<boolean> => {
  const learningPaths = await getLearningPaths();
  
  if (learningPaths.length === 0) return false;
  
  for (const path of learningPaths) {
    const isCompleted = await isLearningPathCompleted(userId, path.difficulty);
    if (!isCompleted) {
      return false;
    }
  }
  
  return true;
};

// Calculate learning path progress for a user
export const calculateLearningPathProgress = async (userId: string): Promise<Array<{
  learningPath: LearningPath, 
  progress: number
}>> => {
  const learningPaths = await getLearningPaths();
  const userProgress = await getUserProgress(userId);
  
  const completedQuestionIds = new Set(
    userProgress
      .filter(progress => progress.is_completed)
      .map(progress => progress.question_id)
  );
  
  const progressData: Array<{
    learningPath: LearningPath, 
    progress: number
  }> = [];
  
  for (const path of learningPaths) {
    // Get all topics for this learning path
    const topics = await getTopicsByLearningPath(path.id);
    
    let totalQuestions = 0;
    let completedQuestions = 0;
    
    // For each topic, get all questions
    for (const topic of topics) {
      const questions = await getQuestionsByTopic(topic.id);
      totalQuestions += questions.length;
      
      // Count completed questions
      for (const question of questions) {
        if (completedQuestionIds.has(question.id)) {
          completedQuestions += 1;
        }
      }
    }
    
    // Calculate progress as a percentage
    const progressPercentage = totalQuestions > 0
      ? Math.round((completedQuestions / totalQuestions) * 100)
      : 0;
    
    progressData.push({
      learningPath: path,
      progress: progressPercentage
    });
  }
  
  return progressData;
};

// Calculate progress by difficulty for a user
export const calculateProgressByDifficulty = async (userId: string): Promise<{
  easy: { total: number, completed: number },
  medium: { total: number, completed: number },
  hard: { total: number, completed: number },
  theory: { total: number, completed: number }
}> => {
  const allQuestions = await supabase
    .from('questions')
    .select('id, difficulty');
  
  const userProgress = await getUserProgress(userId);
  
  const completedQuestionIds = new Set(
    userProgress
      .filter(progress => progress.is_completed)
      .map(progress => progress.question_id)
  );
  
  const result = {
    easy: { total: 0, completed: 0 },
    medium: { total: 0, completed: 0 },
    hard: { total: 0, completed: 0 },
    theory: { total: 0, completed: 0 }
  };
  
  if (allQuestions.error || !allQuestions.data) {
    console.error('Error fetching questions:', allQuestions.error);
    return result;
  }
  
  // Count total and completed questions by difficulty
  for (const question of allQuestions.data) {
    const difficulty = question.difficulty.toLowerCase();
    
    if (difficulty === 'easy') {
      result.easy.total += 1;
      if (completedQuestionIds.has(question.id)) {
        result.easy.completed += 1;
      }
    } else if (difficulty === 'medium') {
      result.medium.total += 1;
      if (completedQuestionIds.has(question.id)) {
        result.medium.completed += 1;
      }
    } else if (difficulty === 'hard') {
      result.hard.total += 1;
      if (completedQuestionIds.has(question.id)) {
        result.hard.completed += 1;
      }
    } else if (difficulty === 'theory') {
      result.theory.total += 1;
      if (completedQuestionIds.has(question.id)) {
        result.theory.completed += 1;
      }
    }
  }
  
  return result;
};
