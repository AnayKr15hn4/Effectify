import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Filter } from 'bad-words';
import { ArrowLeft, Loader2, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export function LoginPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameStatus, setUsernameStatus] = useState<'checking' | 'available' | 'taken' | 'invalid' | null>(null);
  const [usernameError, setUsernameMsg] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('signup') === 'true') {
      setIsSignUp(true);
    }
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });

  const filter = new Filter();

  // Real-time username validation with debouncing
  useEffect(() => {
    if (!isSignUp || !formData.username.trim()) {
      setUsernameStatus(null);
      setUsernameMsg(null);
      return;
    }

    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      const msg = await validateUsername(formData.username);
      if (msg) {
        setUsernameStatus(msg === "Username is already taken" ? 'taken' : 'invalid');
        setUsernameMsg(msg);
      } else {
        setUsernameStatus('available');
        setUsernameMsg(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username, isSignUp]);

  const validateUsername = async (username: string) => {
    if (username.length < 3) return "Username must be at least 3 characters";
    if (filter.isProfane(username)) return "Username contains inappropriate language";
    if (username.toLowerCase().includes('effectify')) return "Username cannot contain 'effectify'";
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username can only contain letters, numbers, and underscores";

    // Check uniqueness
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (data) return "Username is already taken";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // 1. Validate Username
        const usernameError = await validateUsername(formData.username);
        if (usernameError) throw new Error(usernameError);

        // 2. Sign Up
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              username: formData.username,
              onboarded: true // Email users already picked their name
            }
          }
        });

        if (authError) throw authError;

        if (authData.session) {
          navigate('/');
        } else {
          // If no session is returned (e.g. email confirmation required but UI screen removed)
          // We'll just show a generic success or redirect to home.
          // For now, let's redirect to home as most users won't have it enabled.
          navigate('/');
        }
      } else {
        // Login
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (loginError) throw loginError;
        navigate('/');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 relative">
        <Link to="/" className="absolute top-8 left-8 text-zinc-500 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-zinc-400">
            {isSignUp ? 'Join the community and share your effects' : 'Sign in to manage your effects'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            type="button"
            onClick={async () => {
              const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                  redirectTo: `${window.location.origin}?auth_mode=${isSignUp ? 'signup' : 'login'}`
                }
              });
              if (error) setError(error.message);
            }}
            className="w-full bg-white text-zinc-900 font-bold py-3 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 hover:bg-zinc-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-2 text-zinc-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
           {isSignUp && (
             <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Username</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  className={`w-full bg-zinc-950 border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors ${
                    usernameStatus === 'available' ? 'border-green-500' :
                    (usernameStatus === 'taken' || usernameStatus === 'invalid') ? 'border-red-500' :
                    'border-zinc-800 focus:border-indigo-500'
                  }`}
                  placeholder="cool_dev_99"
                />
                {usernameStatus && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {usernameStatus === 'checking' && (
                      <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />
                    )}
                    {usernameStatus === 'available' && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {(usernameStatus === 'taken' || usernameStatus === 'invalid') && (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {usernameError && (
                <p className="text-xs mt-1 text-red-500">
                  ✗ {usernameError}
                </p>
              )}
              {usernameStatus === 'available' && (
                <p className="text-xs text-green-500 mt-1">✓ Username is available</p>
              )}
            </div>
           )}

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-sm text-zinc-500 hover:text-white transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
