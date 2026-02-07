import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { ArrowLeft, Copy, Check, FileCode, Save, Settings, Play, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CodeEditor } from '../components/studio/CodeEditor';
import { LivePreview } from '../components/studio/LivePreview';
import { saveEffect } from '../utils/storage';
import { supabase } from '../lib/supabaseClient';

type EditorTab = 'html' | 'css' | 'js';

export function ContributorStudio() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<EditorTab>('html');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [titleStatus, setTitleStatus] = useState<'checking' | 'available' | 'taken' | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'text',
    author: '',
    tags: '',
    html: '<div class="container">\n  <h1>Hello Effectify</h1>\n</div>',
    css: 'body {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  background: #000;\n  color: white;\n}\n\nh1 {\n  font-family: sans-serif;\n  font-size: 3rem;\n  background: linear-gradient(to right, #4f46e5, #ec4899);\n  -webkit-background-clip: text;\n  color: transparent;\n}',
    js: '// Add your interaction logic here\nconsole.log("Effect loaded");'
  });

  // Fetch current user and set author
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data?.username) {
              setFormData(prev => ({ ...prev, author: data.username }));
            }
          });
      }
    });
  }, []);

  // Real-time title uniqueness check with debouncing
  useEffect(() => {
    if (!formData.title.trim()) {
      setTitleStatus(null);
      return;
    }

    setTitleStatus('checking');
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from('effects')
        .select('id')
        .eq('title', formData.title)
        .single();
      
      setTitleStatus(data ? 'taken' : 'available');
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.title]);

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCodeChange = (lang: EditorTab, value: string | undefined) => {
    if (value !== undefined) {
      setFormData(prev => ({ ...prev, [lang]: value }));
    }
  };

  const generateConfig = () => {
    // Robust slug generation
    const slug = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove non-word chars
      .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with -
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing -

    const config = {
      id: slug || `effect-${Math.random().toString(36).substr(2, 9)}`,
      title: formData.title,
      category: formData.category,
      description: formData.description,
      preview: "",
      video: "/path/to/video.mp4",
      thumbnail: "/path/to/thumbnail.jpg",
      code: {
        html: formData.html,
        css: formData.css,
        js: formData.js
      },
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      author: formData.author || 'Anonymous',
      status: ""
    };
    return JSON.stringify(config, null, 2);
  };

  const handleSave = async () => {
    if (loading) return;
    if (titleStatus === 'taken') {
      alert('This title is already taken!');
      return;
    }

    setSaved(false);
    setLoading(true);
    try {
      const config = JSON.parse(generateConfig());
      const success = await saveEffect(config);
      if (success) {
        setSaved(true);
        setTimeout(() => {
            setSaved(false);
            navigate('/');
        }, 1500);
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyConfig = () => {
    navigator.clipboard.writeText(generateConfig());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-screen bg-zinc-950 text-white flex flex-col overflow-hidden">
      <Header 
        onToggleCodeMode={() => {}} 
        isCodeMode={false}
      />
      
      <main className="flex-1 pt-20 flex">
        {/* Left Sidebar - Metadata */}
        <aside className="w-80 border-r border-zinc-800 bg-zinc-900/50 flex flex-col">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
             <Link to="/" className="text-zinc-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
             </Link>
             <span className="font-semibold text-sm tracking-wider uppercase text-zinc-500">Metadata</span>
             <Settings className="w-4 h-4 text-zinc-600" />
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-zinc-700">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">Effect Title</label>
                <div className="relative">
                  <input 
                      name="title"
                      value={formData.title} 
                      onChange={handleMetadataChange}
                      className={`w-full bg-black border rounded-lg p-2.5 pr-10 text-sm text-white focus:outline-none transition-colors ${
                        titleStatus === 'available' ? 'border-green-500' :
                        titleStatus === 'taken' ? 'border-red-500' :
                        'border-zinc-800 focus:border-indigo-500'
                      }`}
                      placeholder="e.g. Neon text"
                  />
                  {titleStatus && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {titleStatus === 'checking' && (
                        <div className="w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                      )}
                      {titleStatus === 'available' && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {titleStatus === 'taken' && (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {titleStatus === 'available' && (
                  <p className="text-xs text-green-500 mt-1">✓ Title is available</p>
                )}
                {titleStatus === 'taken' && (
                  <p className="text-xs text-red-500 mt-1">✗ This title is already taken</p>
                )}
              </div>

               <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">Category</label>
                <select 
                    name="category"
                    value={formData.category}
                    onChange={handleMetadataChange}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                >
                    <option value="text">Text Animation</option>
                    <option value="gallery">Gallery / Slider</option>
                    <option value="bg">Background</option>
                    <option value="button">Button Interaction</option>
                    <option value="loading">Loader</option>
                    <option value="others">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">Description</label>
                <textarea 
                    name="description"
                    value={formData.description} 
                    onChange={handleMetadataChange}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none h-24"
                    placeholder="Describe the interaction..."
                />
              </div>

               <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">Tags</label>
                <input 
                    name="tags"
                    value={formData.tags} 
                    onChange={handleMetadataChange}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Comma separated"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 space-y-3">
                <button 
                    onClick={handleSave}
                    disabled={loading || titleStatus === 'taken' || !formData.title}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-3 rounded-lg font-bold transition-all active:scale-95 shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:pointer-events-none"
                >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : saved ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {saved ? 'SENT FOR REVIEW' : 'SEND FOR REVIEW'}
                </button>
                
                <button 
                    onClick={copyConfig}
                    className="w-full flex items-center justify-center gap-2 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 px-4 py-2 rounded-lg font-medium text-xs transition-colors"
                >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'COPIED JSON' : 'COPY JSON'}
                </button>
            </div>
          </div>
        </aside>

        {/* Center - Editor */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
             {/* Editor Tabs */}
            <div className="flex bg-zinc-950 border-b border-zinc-800">
                {(['html', 'css', 'js'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-r border-zinc-900 transition-colors ${
                            activeTab === tab 
                                ? 'bg-[#1e1e1e] text-white border-t-2 border-t-indigo-500' 
                                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                        }`}
                    >
                        <FileCode className="w-4 h-4" />
                        {tab.toUpperCase()}
                    </button>
                ))}
            </div>
            
            <div className="flex-1 relative">
                {activeTab === 'html' && (
                    <CodeEditor 
                        language="html" 
                        value={formData.html} 
                        onChange={(v) => handleCodeChange('html', v)} 
                        label="HTML Structure"
                    />
                )}
                {activeTab === 'css' && (
                    <CodeEditor 
                        language="css" 
                        value={formData.css} 
                        onChange={(v) => handleCodeChange('css', v)} 
                        label="style.css"
                    />
                )}
                {activeTab === 'js' && ( 
                    <CodeEditor 
                        language="javascript" 
                        value={formData.js} 
                        onChange={(v) => handleCodeChange('js', v)} 
                        label="script.js"
                    />
                )}
            </div>
        </div>

        {/* Right - Live Preview */}
        <div className="w-[40%] flex flex-col border-l border-zinc-800 bg-black">
             <div className="p-3 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center h-[52px]">
                <div className="flex items-center gap-2 text-zinc-400">
                    <Play className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-bold tracking-wider">LIVE PREVIEW</span>
                </div>
                <div className="text-[10px] text-zinc-600 font-mono">1920 x 1080</div>
             </div>
             <div className="flex-1 p-4 bg-zinc-900/30">
                <LivePreview 
                    html={formData.html}
                    css={formData.css}
                    js={formData.js}
                />
             </div>
        </div>
      </main>
    </div>
  );
}
