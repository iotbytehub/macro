import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'; // <-- Added Link here
import { Toaster } from 'react-hot-toast';
import FleetManager from './Views/FleetManager';
import LoginView from './Views/LoginView';
import SettingsView from './Views/SettingsView';
import HardwareCanvas from './Views/HardwareCanvas';

function App() {
  const [token, setToken] = useState(localStorage.getItem('access_token'));

  useEffect(() => {
    const handleStorageChange = () => setToken(localStorage.getItem('access_token'));
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
        
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0f172a', 
              color: '#f8fafc',      
              border: '1px solid #1e293b', 
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: '14px'
            },
          }}
        />
        
        {/* --- UPGRADED HEADER WITH NAVIGATION --- */}
        <header className="h-14 border-b border-slate-800 bg-slate-900/50 flex items-center px-8 justify-between">
          <div className="flex items-center gap-10">
            <span className="font-bold text-white tracking-wider text-xl">
              NEXUS<span className="text-blue-500">_</span>
            </span>
            
            {/* The Navigation Links (Only visible if logged in) */}
            {token && (
              <nav className="flex items-center gap-6">
                <Link to="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                  Fleet Dashboard
                </Link>
                <Link to="/canvas" className="text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors">
                  Hardware Studio
                </Link>
                <Link to="/settings" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                  Settings
                </Link>
              </nav>
            )}
          </div>
          
          {token && (
            <button 
              onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
              className="text-xs text-slate-500 hover:text-rose-500 transition-colors uppercase font-mono"
            >
              [ Logout ]
            </button>
          )}
        </header>
        {/* --------------------------------------- */}

        <Routes>
          <Route path="/login" element={token ? <Navigate to="/" /> : <LoginView />} />
          <Route path="/" element={token ? <FleetManager /> : <Navigate to="/login" />} />
          <Route path="/settings" element={token ? <SettingsView /> : <Navigate to="/login" />} />
          <Route path="/canvas" element={token ? <HardwareCanvas /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;