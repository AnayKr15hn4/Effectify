import { Effect } from '../types/Effect';
import { supabase } from '../lib/supabaseClient';

// Helper to get current user ID
const getCurrentUserId = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id;
};

// Fetch effects with optional status filter (default: approved)
export const getAllEffects = async (status: 'approved' | 'pending' | 'all' = 'approved'): Promise<Effect[]> => {
  try {
    let query = supabase
      .from('effects')
      .select(`
        *,
        profiles (
          id,
          username,
          role
        )
      `)
      .order('created_at', { ascending: false });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: effectsData, error: effectsError } = await query;
    
    if (effectsError) {
      console.error('Error fetching effects:', effectsError);
      return [];
    }

    // Transform joined data
    const customEffects = (effectsData || []).map((e: any) => {
      const profile = e.profiles;
      return {
        ...e.code,
        ...e,
        author: profile?.username || 'Anonymous',
        authorRole: profile?.role,
        preview: "" 
      };
    });

    return customEffects;
  } catch (e) {
    console.error('Failed to load effects', e);
    return [];
  }
};

export const saveEffect = async (effect: Effect) => {
  try {
    const userId = await getCurrentUserId();
    const { id, title, category, description, code, tags } = effect;
    
    const { error } = await supabase
      .from('effects')
      .insert([
        { 
          id, 
          title, 
          category, 
          description, 
          code, 
          tags, 
          user_id: userId,
          status: 'pending'
        }
      ]);

    if (error) throw error;
    
    window.dispatchEvent(new Event('storage'));
    return true;
  } catch (e: any) {
    console.error('Failed to save effect', e);
    alert('Failed to save effect: ' + e.message);
    return false;
  }
};
