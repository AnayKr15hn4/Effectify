import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getAllEffects } from '../utils/storage';
import { Effect } from '../types/Effect';
import { Header } from '../components/Header';
import { EffectCard } from '../components/EffectCard';
import { EffectModal } from '../components/EffectModal';
import { Check, X, ShieldAlert, Loader2, Trash2 } from 'lucide-react';

type TabType = 'pending' | 'all';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [pendingEffects, setPendingEffects] = useState<Effect[]>([]);
  const [allEffects, setAllEffects] = useState<Effect[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEffect, setSelectedEffect] = useState<Effect | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      if (activeTab === 'pending') {
        fetchPendingEffects();
      } else {
        fetchAllEffects();
      }
    }
  }, [activeTab, isAdmin]);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
      
      setIsAdmin(profile?.role === 'admin');
    } else {
      setIsAdmin(false);
    }
  };

  const fetchPendingEffects = async () => {
    setLoading(true);
    const data = await getAllEffects('pending');
    setPendingEffects(data);
    setLoading(false);
  };

  const fetchAllEffects = async () => {
    setLoading(true);
    const data = await getAllEffects('approved');
    setAllEffects(data);
    setLoading(false);
  };

  const handleApprove = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
        const { data, error } = await supabase
            .from('effects')
            .update({ status: 'approved' })
            .eq('id', id)
            .select();
        
        if (error) {
            console.error('Supabase update error:', error);
            throw error;
        }

        if (!data || data.length === 0) {
            throw new Error('Permission Denied: Database policy prevented the update.');
        }
        
        setPendingEffects(prev => prev.filter(eff => eff.id !== id));
    } catch (err: any) {
        console.error('Error approving:', err);
        alert('Failed to approve: ' + (err.message || JSON.stringify(err)));
    }
  };

  const handleReject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to reject and delete this effect?')) return;

    try {
        const { error } = await supabase
            .from('effects')
            .delete()
            .eq('id', id);
        
        if (error) {
            console.error('Supabase delete error:', error);
            throw error;
        }
        
        setPendingEffects(prev => prev.filter(eff => eff.id !== id));
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error cleaning effects:', error);
      alert('Failed to reject: ' + (error.message || JSON.stringify(err)));
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to permanently delete this effect?')) return;

    try {
        const { error } = await supabase
            .from('effects')
            .delete()
            .eq('id', id);
        
        if (error) {
            console.error('Supabase delete error:', error);
            throw error;
        }
        
        setAllEffects(prev => prev.filter(eff => eff.id !== id));
    } catch (err: unknown) {
        const error = err as Error;
        console.error('Error deleting:', error);
        alert('Failed to delete: ' + (error.message || 'Unknown error'));
    }
  };

  if (!isAdmin) return null;

  const currentEffects = activeTab === 'pending' ? pendingEffects : allEffects;

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header onToggleCodeMode={() => {}} isCodeMode={false} />
      
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
            <ShieldAlert className="w-8 h-8 text-yellow-500" />
            <div>
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-zinc-400">Manage effect submissions</p>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'pending'
                ? 'text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Pending Review
            {activeTab === 'pending' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'all'
                ? 'text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            All Effects
            {activeTab === 'all' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
            )}
          </button>
        </div>

        {loading ? (
             <div className="flex justify-center py-20">
               <Loader2 className="animate-spin text-white w-8 h-8" />
            </div>
        ) : currentEffects.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <p className="text-zinc-400">
                  {activeTab === 'pending' ? 'No pending effects to review.' : 'No approved effects found.'}
                </p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentEffects.map((effect) => (
                <div key={effect.id} className="relative group">
                    <EffectCard
                        effect={effect}
                        isCodeMode={false}
                        onPreview={setSelectedEffect}
                    />
                    
                    {/* Admin Actions Overlay */}
                    <div className="absolute top-4 left-4 flex gap-2 z-10">
                        {activeTab === 'pending' ? (
                          <>
                            <button 
                                onClick={(e) => handleApprove(effect.id, e)}
                                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg shadow-lg transition-transform hover:scale-105"
                                title="Approve"
                            >
                                <Check className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={(e) => handleReject(effect.id, e)}
                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-lg transition-transform hover:scale-105"
                                title="Reject"
                            >
                                <X className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <button 
                              onClick={(e) => handleDelete(effect.id, e)}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-lg transition-transform hover:scale-105"
                              title="Delete Permanently"
                          >
                              <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                    </div>
                </div>
              ))}
            </div>
        )}
      </main>

      <EffectModal
        effect={selectedEffect}
        onClose={() => setSelectedEffect(null)}
      />
    </div>
  );
}
