import { useState, useEffect } from 'react';
import { Save, Database, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../api/axios';

export default function SettingsView() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    supabase_url: '',
    supabase_anon_key: '',
    ai_provider: 'gemini',
    ai_api_key: ''
  });

  // Fetch existing settings on load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('fleet/settings/');
        if (res.data) setSettings(res.data);
      } catch (error) {
        console.error("No existing settings found.");
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Assuming you built a Django view to catch this POST/PUT request
      await api.post('fleet/settings/', settings);
      toast.success('Workspace Settings Saved!');
    } catch (error) {
      toast.error('Failed to save settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Workspace Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Configure your external databases and AI compiler keys.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Supabase Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4 text-emerald-400">
            <Database size={20} />
            <h2 className="text-lg font-medium text-white">External Database (Supabase)</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Project URL</label>
              <input type="url" value={settings.supabase_url} onChange={e => setSettings({...settings, supabase_url: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none" placeholder="https://xyzcompany.supabase.co" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Anon Public Key</label>
              <input type="password" value={settings.supabase_anon_key} onChange={e => setSettings({...settings, supabase_anon_key: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none" placeholder="eyJh..." />
            </div>
          </div>
        </div>

        {/* AI Provider Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4 text-blue-400">
            <Cpu size={20} />
            <h2 className="text-lg font-medium text-white">AI Hardware Compiler</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Provider</label>
              <select value={settings.ai_provider} onChange={e => setSettings({...settings, ai_provider: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none">
                <option value="gemini">Google Gemini</option>
                <option value="openai">OpenAI</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">API Key</label>
              <input type="password" value={settings.ai_api_key} onChange={e => setSettings({...settings, ai_api_key: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none" placeholder="AI API Key" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="bg-white text-slate-950 font-medium px-6 py-2 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2">
          <Save size={18} /> {loading ? 'Saving...' : 'Save Configuration'}
        </button>
      </form>
    </div>
  );
}