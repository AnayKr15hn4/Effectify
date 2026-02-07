import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Filter } from 'bad-words';
import { Loader2, CheckCircle, XCircle, Sparkles } from 'lucide-react';

export function OnboardingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'checking' | 'available' | 'taken' | 'invalid' | null>(null);
  const [usernameError, setUsernameMsg] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const filter = new Filter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserId(session.user.id);
        fetchCurrentProfile(session.user.id);
      }
    });
  }, [navigate]);

  const fetchCurrentProfile = async (id: string) => {
    const { data } = await supabase.from('profiles').select('username').eq('id', id).single();
    if (data) setUsername(data.username);
  };

  // Real-time username validation with debouncing
  useEffect(() => {
    if (!username.trim()) {
      setUsernameStatus(null);
      setUsernameMsg(null);
      return;
    }

    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      const msg = await validateUsername(username);
      if (msg) {
        setUsernameStatus(msg === "Username is already taken" ? 'taken' : 'invalid');
        setUsernameMsg(msg);
      } else {
        setUsernameStatus('available');
        setUsernameMsg(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  const validateUsername = async (u: string) => {
    if (u.length < 3) return "Username must be at least 3 characters";
    if (filter.isProfane(u)) return "Username contains inappropriate language";
    if (u.toLowerCase().includes('effectify')) return "Username cannot contain 'effectify'";
    if (!/^[a-zA-Z0-9_]+$/.test(u)) return "Username can only contain letters, numbers, and underscores";

    // Check if it's the SAME as their current temporary one
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();

    if (currentProfile?.username === u) return null;

    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', u)
      .single();

    if (data) return "Username is already taken";
    return null;
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameStatus !== 'available' || !userId) return;
    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // 1. Update Password (if provided)
      if (password.trim()) {
        const { error: authError } = await supabase.auth.updateUser({
          password: password
        });
        if (authError) throw authError;
      }

      // 2. Update Profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          username,
          onboarded: true
        }, { onConflict: 'id' });

      if (profileError) throw profileError;
      navigate('/');
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600/10 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-indigo-500" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Welcome to Effectify!</h1>
          <p className="text-zinc-400">Complete your profile to get started.</p>
        </div>

        <form onSubmit={handleComplete} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Choose Username</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
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

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Set Password (Optional but recommended)</label>
              <input
                type="password"
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
              <p className="text-[10px] text-zinc-500 mt-2">
                This allows you to sign in with your email and password later.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || usernameStatus !== 'available'}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            Complete Setup
          </button>
        </form>
      </div>
    </div>
  );
}
