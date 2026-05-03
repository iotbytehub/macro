import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/Axios.js';

export default function LoginView() {
  const [username, setUsername] = useState('satyam');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Hitting the live Django auth endpoint
      const response = await api.post('auth/login/', { username, password });
      
      // Storing the tokens
      localStorage.setItem('access_token', response.data.access);
      if (response.data.refresh) {
        localStorage.setItem('refresh_token', response.data.refresh);
      }
      
      // Redirect to the Fleet Dashboard
      navigate('/');
    } catch (err) {
      setError('Invalid credentials or backend offline.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
      <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-xl">
        <h2 className="text-2xl font-semibold text-white mb-6 tracking-tight">Sign In to Nexus</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/50 text-rose-500 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Username</label>
            <input
              type="text"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-slate-950 font-medium py-2 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}