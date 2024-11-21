import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  companyName?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin accounts configuration
const ADMIN_ACCOUNTS = {
  'admin@virtualcc.org.au': {
    id: 'admin_1',
    name: 'Paul Mizzi',
    companyName: 'Virtual Contact Center',
    password: ''  // No password check for primary admin
  },
  'emailbish@gmail.com': {
    id: 'admin_2',
    name: 'Bishop',
    companyName: 'Virtual Contact Center',
    password: 'b15h0p'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, setUser, setToken, clearAuth } = useAuthStore();

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken('mock-jwt-token');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setError('Authentication check failed');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser, setToken]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Attempting login with email:', email);
      
      // Check if it's an admin account
      const adminAccount = ADMIN_ACCOUNTS[email.toLowerCase()];
      console.log('Admin account found:', !!adminAccount);
      if (adminAccount) {
        console.log('Admin account password check:', email.toLowerCase() === 'emailbish@gmail.com' ? password === adminAccount.password : 'No password required');
        
        // Validate password for emailbish account
        if (email.toLowerCase() === 'emailbish@gmail.com' && password !== adminAccount.password) {
          throw new Error('Invalid credentials');
        }

        const adminUser: User = {
          id: adminAccount.id,
          email,
          role: 'admin',
          companyName: adminAccount.companyName
        };

        localStorage.setItem('user', JSON.stringify(adminUser));
        setUser(adminUser);
        setToken('mock-jwt-token');
        return;
      }

      throw new Error('Invalid credentials');
    } catch (err) {
      console.error('Login failed:', err);
      console.log('Login error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      localStorage.removeItem('user');
      clearAuth();
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
