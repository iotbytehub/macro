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
      
      // Dispatch a custom event to notify the app of login
      window.dispatchEvent(new Event('login'));
      
      // Redirect to the Fleet Dashboard
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials or backend offline.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] bg-[#F8FAFC]">
      <div className="w-full max-w-md p-8 bg-white border border-[#E2E8F0] rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-[#0F172A] mb-6 tracking-tight">Sign In to Macro</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1">Username</label>
            <input
              type="text"
              required
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2 text-[#0F172A] focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition-colors placeholder-slate-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2 text-[#0F172A] focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition-colors placeholder-slate-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}