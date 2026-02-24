import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const generateId = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);

// Mock types
interface User {
  id: string;
  email: string;
  user_metadata: { full_name: string };
}
interface Session {
  user: User;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check local storage for mock session
    const storedUser = localStorage.getItem('taskflow_mock_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setSession({ user: parsedUser });
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const mockUser: User = { id: generateId(), email, user_metadata: { full_name: 'Local User' } };
      localStorage.setItem('taskflow_mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setSession({ user: mockUser });
      toast.success('Welcome back (Local)!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('Failed to sign in');
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const mockUser: User = { id: generateId(), email, user_metadata: { full_name: fullName } };
      localStorage.setItem('taskflow_mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setSession({ user: mockUser });
      toast.success('Account created locally!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('Failed to create account');
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('taskflow_mock_user');
      setUser(null);
      setSession(null);
      toast.success('Signed out locally');
      navigate('/auth');
    } catch (error: any) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
