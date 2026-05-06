import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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
    <>
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
        <Toaster position="bottom-right" toastOptions={{ style: { background: '#0F172A', color: '#F8FAFC', border: '1px solid #E2E8F0', fontFamily: 'monospace', fontSize: '14px' } }} />
        
        {/* ── HEADER ── */}
        <header className="sticky top-0 z-50 flex items-center justify-between h-15 px-8 bg-[#F8FAFC]/85 backdrop-blur border-b border-[#E2E8F0]">
          <div className="flex items-center gap-10">
            <Link to="/" className="font-bold text-lg tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              MACRO<span className="text-[#0EA5E9]">_</span>
            </Link>
            
            {token && (
              <nav className="hidden md:flex items-center gap-6 text-sm text-slate-500">
                <Link to="/dashboard" className="hover:text-[#0F172A] transition-colors">
                  Fleet Dashboard
                </Link>
                <Link to="/settings" className="hover:text-[#0F172A] transition-colors">
                  Settings
                </Link>
              </nav>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {token ? (
              <button 
                onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                className="text-xs text-slate-500 hover:text-[#F59E0B] transition-colors uppercase font-medium px-4 py-2"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-sm font-medium px-4 py-2 rounded-lg transition-all hover:-translate-y-px"
              >
                Sign In
              </button>
            )}
          </div>
        </header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <LoginView />} />
          <Route path="/dashboard" element={token ? <FleetManager /> : <Navigate to="/login" />} />
          <Route path="/settings" element={token ? <SettingsView /> : <Navigate to="/login" />} />
          <Route path="/canvas/:deviceId" element={token ? <HardwareCanvas /> : <Navigate to="/login" />} />
          <Route path="/automation/:deviceId" element={token ? <AutomationCanvas /> : <Navigate to="/login" />} />
          <Route path="/devices/:deviceId/analytics" element={token ? <DeviceAnalytics /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* ── FOOTER ── */}
        <footer className="mt-auto border-t border-[#E2E8F0] bg-white px-8 py-6 flex flex-wrap items-center justify-between gap-4">
          <span className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            MACRO<span className="text-[#0EA5E9]">_</span>
          </span>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Status", "API Docs"].map(l => (
              <a key={l} className="text-sm text-slate-400 hover:text-[#0F172A] transition-colors cursor-pointer">{l}</a>
            ))}
          </div>
          <span className="text-xs text-slate-400">© 2026 MACRO IoT Platform</span>
        </footer>
      </div>
    </>
  );
}

export default App;