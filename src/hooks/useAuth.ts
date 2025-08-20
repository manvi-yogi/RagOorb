import { useState, useEffect } from 'react';
import { User, LoginCredentials, SignupCredentials } from '../types/auth';

// Mock admin credentials - in production, this would be handled by a proper backend
const ADMIN_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'admin123'
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored auth token on mount
    const storedUser = localStorage.getItem('rag_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('rag_user');
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock authentication - in production, this would be a real API call
      if (credentials.email === ADMIN_CREDENTIALS.email && 
          credentials.password === ADMIN_CREDENTIALS.password) {
        const user: User = {
          id: '1',
          email: credentials.email,
          isAdmin: true
        };
        
        setUser(user);
        localStorage.setItem('rag_user', JSON.stringify(user));
        return true;
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (credentials: SignupCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (credentials.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Mock signup - in production, this would create a new user
      const user: User = {
        id: Date.now().toString(),
        email: credentials.email,
        isAdmin: true // For demo purposes, all signups are admin
      };
      
      setUser(user);
      localStorage.setItem('rag_user', JSON.stringify(user));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rag_user');
  };

  return {
    user,
    isLoading,
    error,
    login,
    signup,
    logout,
    isAdmin: user?.isAdmin || false
  };
};