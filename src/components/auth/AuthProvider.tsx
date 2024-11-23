import { createContext, useContext, useState, useEffect } from 'react';
import { getDb } from '../../lib/db';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
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
      // First check localStorage for a persistent session
      const persistentSession = localStorage.getItem('persistentSession');
      if (persistentSession) {
        const { user: storedUser, expiresAt } = JSON.parse(persistentSession);
        if (new Date().getTime() < expiresAt) {
          setUser(storedUser);
          return;
        } else {
          // Clear expired persistent session
          localStorage.removeItem('persistentSession');
        }
      }

      // Fall back to IndexedDB session
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
    signIn: async (email: string, password: string, rememberMe = false) => {
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

          if (rememberMe) {
            // Store in localStorage with 30-day expiration for "Remember Me"
            const expiresAt = new Date().getTime() + (30 * 24 * 60 * 60 * 1000); // 30 days
            localStorage.setItem('persistentSession', JSON.stringify({
              user: adminUser,
              expiresAt
            }));
          } else {
            // Store in IndexedDB for regular session
            const db = await getDb();
            await db.put('settings', { user: adminUser }, 'session');
          }

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
        // Clear both storage mechanisms
        localStorage.removeItem('persistentSession');
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
