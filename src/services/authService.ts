
import { supabase } from "@/integrations/supabase/client";

export interface LoginCredentials {
  prn: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  prn: string;
  email: string;
  department?: string;
  course?: string;
  grad_year?: number;
}

export const loginUser = async (credentials: LoginCredentials): Promise<{ user: User | null; error: string | null }> => {
  try {
    console.log('Attempting login with PRN:', credentials.prn);
    
    const { data, error } = await supabase
      .rpc('authenticate_user', {
        prn_input: credentials.prn,
        password_input: credentials.password
      });

    if (error) {
      console.error('Login error:', error);
      return { user: null, error: 'Invalid credentials' };
    }

    if (!data || data.length === 0) {
      return { user: null, error: 'Invalid credentials' };
    }

    const user = data[0] as User;
    console.log('Login successful:', user);
    
    // Store user info in localStorage for session management
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return { user, error: null };
  } catch (err) {
    console.error('Login error:', err);
    return { user: null, error: 'Login failed. Please try again.' };
  }
};

export const logoutUser = async (): Promise<void> => {
  localStorage.removeItem('currentUser');
};

export const getCurrentUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};
