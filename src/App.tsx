import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabaseClient';
import { HomePage } from './pages/HomePage';
import { ContributorStudio } from './pages/ContributorStudio';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { AdminDashboard } from './pages/AdminDashboard';

// 🛡️ Auth Guard: Ensures user is logged in
function AuthGuard({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) return null; // Loading
  if (!session) return <Navigate to="/login" state={{ from: location }} replace />;
  
  return <>{children}</>;
}

// 👑 Admin Guard: Ensures user is an admin
function AdminGuard({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsAdmin(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      
      setIsAdmin(profile?.role === 'admin');
    };
    checkAdmin();
  }, []);

  if (isAdmin === null) return null; // Loading
  if (!isAdmin) return <Navigate to="/" replace />;
  
  return <>{children}</>;
}

// 🚪 Public Only: Redirects logged-in users away from login/signup
function GuestGuard({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
    });
  }, []);

  if (session === undefined) return null;
  if (session) return <Navigate to="/" replace />;
  
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* Protected Routes */}
        <Route path="/onboarding" element={
          <AuthGuard>
            <OnboardingPage />
          </AuthGuard>
        } />
        <Route path="/studio" element={
          <AuthGuard>
            <ContributorStudio />
          </AuthGuard>
        } />
        <Route path="/admin" element={
          <AdminGuard>
            <AdminDashboard />
          </AdminGuard>
        } />

        {/* Public Only Routes */}
        <Route path="/login" element={
          <GuestGuard>
            <LoginPage />
          </GuestGuard>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

