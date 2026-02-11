import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Filter } from 'bad-words';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const filter = new Filter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('signup') === 'true') {
      setIsSignUp(true);
    }
  }, []);

  const validateUsername = async (username: string) => {
    if (username.length < 3) return 'Username must be at least 3 characters';
    if (filter.isProfane(username)) return 'Username contains inappropriate language';
    if (username.toLowerCase().includes('effectify'))
      return "Username cannot contain 'effectify'";
    if (!/^[a-zA-Z0-9_]+$/.test(username))
      return 'Username can only contain letters, numbers, and underscores';

    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (data) return 'Username is already taken';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const usernameError = await validateUsername(formData.username);
        if (usernameError) throw new Error(usernameError);

        const { error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              username: formData.username,
              onboarded: true,
            },
          },
        });

        if (authError) throw authError;
        navigate('/');
      } else {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (loginError) throw loginError;
        navigate('/');
      }
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}?auth_mode=login`,
      },
    });

    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 relative">
        <Link
          to="/"
          className="absolute top-8 left-8 text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-zinc-400">
            {isSignUp
              ? 'Join the community and share your effects'
              : 'Sign in to manage your effects'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* GOOGLE LOGIN ONLY */}
        {!isSignUp && (
          <div className="mb-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white text-zinc-900 font-bold py-3 rounded-lg transition-all active:scale-95 hover:bg-zinc-200"
            >
              Continue with Google
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900 px-2 text-zinc-500">
                  Or continue with email
                </span>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">
                Username
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
                placeholder="cool_dev_99"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-sm text-zinc-500 hover:text-white transition-colors"
          >
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
