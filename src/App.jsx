import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './Views/HomePage';
import FleetManager from './Views/FleetManager';
import LoginView from './Views/LoginView';
import SettingsView from './Views/SettingsView';
import HardwareCanvas from './Views/HardwareCanvas';
import AutomationCanvas from './Views/AutomationCanvas';
import DeviceAnalytics from './Views/DeviceAnalytics';

function App() {
  const [token, setToken] = useState(localStorage.getItem('access_token'));

  useEffect(() => {
    const handleStorageChange = () => setToken(localStorage.getItem('access_token'));
    const handleLogin = () => setToken(localStorage.getItem('access_token'));
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('login', handleLogin);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('login', handleLogin);
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
        <Toaster position="bottom-right" toastOptions={{ style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #1e293b', fontFamily: 'monospace', fontSize: '14px' } }} />
        
        <header className="h-14 border-b border-slate-800 bg-slate-900/50 flex items-center px-8 justify-between">
          <div className="flex items-center gap-10">
            <Link to="/" className="font-bold text-white tracking-wider text-xl">
              MACRO<span className="text-blue-500">_</span>
            </Link>
            
            {token && (
              <nav className="flex items-center gap-6">
                <Link to="/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                  Fleet Dashboard
                </Link>
                <Link to="/settings" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                  Settings
                </Link>
              </nav>
            )}
          </div>
          
          {token && (
            <button 
              onClick={() => { localStorage.clear(); window.location.href = '/'; }}
              className="text-xs text-slate-500 hover:text-rose-500 transition-colors uppercase font-mono"
            >
              [ Logout ]
            </button>
          )}
        </header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <LoginView />} />
          <Route path="/dashboard" element={token ? <FleetManager /> : <Navigate to="/login" />} />
          <Route path="/settings" element={token ? <SettingsView /> : <Navigate to="/login" />} />

          {/* THE FIX: We added :deviceId to the URL path */}
          <Route path="/canvas/:deviceId" element={token ? <HardwareCanvas /> : <Navigate to="/login" />} />
          <Route path="/automation/:deviceId" element={token ? <AutomationCanvas /> : <Navigate to="/login" />} />
          <Route path="/devices/:deviceId/analytics" element={token ? <DeviceAnalytics /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;