import { Session } from '@supabase/supabase-js';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// 1. Define specific types instead of 'any'
type UserProfile = {
  id: string;
  avatar_url: string | null;
  created_at: string | null;
  email: string;
  type: string | null;
};

type AuthData = {
  session: Session | null;
  mounting: boolean;
  user: UserProfile | any;
};

const AuthContext = createContext<AuthData>({
  session: null,
  mounting: true,
  user: null,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [mounting, setMounting] = useState(true);

  // Helper function to fetch profile
  const fetchProfile = async (sessionUserId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', sessionUserId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error.message);
      setUser(null);
    } else {
      setUser(data);
    }
  };

  useEffect(() => {
    // 2. Combine session fetch and listener
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) await fetchProfile(session.user.id);
      setMounting(false);
    };

    initializeAuth();

    // 3. Listen for changes and CLEAN UP
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);
      if (currentSession) {
        await fetchProfile(currentSession.user.id);
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, mounting, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);