
import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: string;
  username: string;
  prn: string;
  email: string;
  department: string;
  course: string;
  grad_year: number;
}

export const login = async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
  try {
    const { data, error } = await supabase.rpc('authenticate_user', {
      email_input: email,
      password_input: password
    });

    if (error) {
      console.error('Login error:', error);
      return { user: null, error: 'Login failed. Please check your credentials.' };
    }

    if (!data || data.length === 0) {
      return { user: null, error: 'Invalid email or password.' };
    }

    const user = data[0] as User;
    
    // Store user in localStorage for session management
    localStorage.setItem('user', JSON.stringify(user));
    
    return { user, error: null };
  } catch (error) {
    console.error('Login error:', error);
    return { user: null, error: 'An unexpected error occurred.' };
  }
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};
