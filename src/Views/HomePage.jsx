import { useNavigate } from 'react-router-dom';
import { Cpu, Zap, Activity, ArrowRight, Waves } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/20 flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>

        {/* Floating whale */}
        <div className="absolute top-1/3 right-1/4 animate-bounce" style={{ animationDuration: '6s' }}>
          <div className="text-cyan-500/10 text-6xl transform rotate-12">🐋</div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 h-16 border-b border-slate-800/60 bg-slate-900/20 backdrop-blur-sm flex items-center px-8 justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-white tracking-wider text-2xl">
            MACRO<span className="text-blue-500">_</span>
          </span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 hover:scale-105 flex items-center gap-2"
        >
          <span>Sign In</span>
          <ArrowRight size={16} />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-12">

          {/* Hero Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-3 h-12 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full"></div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                MACRO
              </h1>
              <div className="w-3 h-12 bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"></div>
            </div>

            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Advanced IoT Fleet Management Platform for the Ocean of Connected Devices.
              Monitor, control, and architect your deployed IoT nodes with precision and intelligence.
            </p>

            <div className="flex items-center justify-center gap-2 text-cyan-400 font-mono text-lg">
              <Waves size={20} className="animate-bounce" />
              <span>Live Ocean Network</span>
              <Waves size={20} className="animate-bounce" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-slate-900/60 backdrop-blur-sm p-8 rounded-2xl border border-slate-800/60 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:scale-105 group">
              <div className="p-4 bg-cyan-500/10 text-cyan-500 rounded-xl w-fit mb-4 group-hover:bg-cyan-500/20 transition-colors">
                <Cpu size={32} className="group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Device Architecture</h3>
              <p className="text-slate-400">Design and deploy complex IoT device architectures with visual blueprint tools.</p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-sm p-8 rounded-2xl border border-slate-800/60 shadow-2xl hover:border-blue-500/30 transition-all duration-300 hover:scale-105 group">
              <div className="p-4 bg-blue-500/10 text-blue-500 rounded-xl w-fit mb-4 group-hover:bg-blue-500/20 transition-colors">
                <Activity size={32} className="group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Real-time Analytics</h3>
              <p className="text-slate-400">Monitor sensor data, telemetry, and device performance with live dashboards.</p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-sm p-8 rounded-2xl border border-slate-800/60 shadow-2xl hover:border-emerald-500/30 transition-all duration-300 hover:scale-105 group">
              <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-xl w-fit mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <Zap size={32} className="group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Automation Rules</h3>
              <p className="text-slate-400">Create intelligent automation workflows and control sequences for your devices.</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 space-y-6">
            <h2 className="text-3xl font-bold text-white">Ready to Dive In?</h2>
            <p className="text-slate-400 text-lg">Join the ocean of connected devices and start building your IoT ecosystem.</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 hover:from-cyan-500 hover:via-blue-500 hover:to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-cyan-500/30 hover:scale-110 flex items-center gap-3 mx-auto animate-pulse"
            >
              <span>Access Fleet Dashboard</span>
              <ArrowRight size={20} className="animate-bounce" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/60 bg-slate-900/20 backdrop-blur-sm px-8 py-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="text-slate-500 text-sm">
            © 2026 MACRO IoT Platform. Built for the future of connected devices.
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-mono">System Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
}