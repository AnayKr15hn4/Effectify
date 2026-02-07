import { useState, useEffect, useRef } from 'react';
import { Code2, Sparkles, LogIn, Upload, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

interface HeaderProps {
  onToggleCodeMode: () => void;
  isCodeMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleCodeMode, isCodeMode }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) setProfile(data);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${session.user.id}/avatar.${fileExt}`;

      // Upload image
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      // Update local state
      setProfile({ ...profile, avatar_url: publicUrl });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Error uploading avatar!');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" onClick={scrollToTop} className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
            <Sparkles className="w-7 h-7 text-white" />
            <h1 className="text-2xl font-black text-white tracking-tight">
              Effectify
            </h1>
          </Link>
          
          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-6">
                <Link 
                  to="/studio"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <Code2 className="w-4 h-4" />
                  Studio
                </Link>

                 <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                   <div className="flex flex-col items-end">
                      <span className={`text-sm font-bold flex items-center gap-1 ${profile?.role === 'admin' ? 'status-big-boss' : 'text-white'}`}>
                        {profile?.role === 'admin' && <Shield className="w-3 h-3 text-yellow-500" />}
                        {profile?.username || 'User'}
                      </span>
                      <button 
                         onClick={handleSignOut}
                         className="text-[10px] text-zinc-500 hover:text-red-400 transition-colors uppercase tracking-wider font-bold"
                      >
                        Sign Out
                      </button>
                   </div>
                   
                   <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <div className="w-10 h-10 rounded-full border-2 border-zinc-800 overflow-hidden bg-zinc-800 group-hover:border-indigo-500 transition-colors">
                        {profile?.avatar_url ? (
                          <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs font-bold">
                             {profile?.username?.substring(0,2).toUpperCase() || 'ME'}
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <Upload className="w-4 h-4 text-white" />
                      </div>
                   </div>
                </div>
              </div>
            ) : (
              <Link 
                to="/login"
                className="px-4 py-2 bg-white text-zinc-900 rounded-lg font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}

            <button
              onClick={onToggleCodeMode}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isCodeMode 
                  ? 'bg-white text-black' 
                  : 'bg-transparent text-white hover:bg-white/10'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span className="font-medium font-secondary">
                {isCodeMode ? 'Preview' : 'Code'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};