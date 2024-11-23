import { createContext, useContext, useState, useEffect } from 'react';
import { getDb } from '../../lib/db';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  companyName?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const db = await getDb();
      const session = await db.get('settings', 'session');
      
      if (session) {
        setUser(session.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  const value = {
    user,
    loading,
    signIn: async (email: string, password: string) => {
      try {
        setLoading(true);
        // Check if it's an admin account
        const adminAccount = ADMIN_ACCOUNTS[email.toLowerCase()];
        if (adminAccount) {
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

          const db = await getDb();
          await db.put('settings', { user: adminUser }, 'session');
          setUser(adminUser);
          return;
        }

        throw new Error('Invalid credentials');
      } catch (error) {
        console.error('Error signing in:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    signOut: async () => {
      try {
        const db = await getDb();
        await db.delete('settings', 'session');
        setUser(null);
      } catch (error) {
        console.error('Error signing out:', error);
        throw error;
      }
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
