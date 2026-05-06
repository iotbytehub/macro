import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
import { ArrowLeft, Activity, Thermometer, Droplets, Gauge, History, TerminalSquare, Lightbulb, Power } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

export default function DeviceAnalytics() {
  const { deviceId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [telemetryHistory, setTelemetryHistory] = useState([]);
  const [latestReadings, setLatestReadings] = useState({});
  const [commandHistory, setCommandHistory] = useState([]);

  // Fetch Data from Django Backend
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Hit the new Django endpoint we just built
        const response = await api.get(`fleet/devices/${deviceId}/analytics/`);
        
        // Populate the React state with the live PostgreSQL data!
        setLatestReadings(response.data.latestReadings);
        setTelemetryHistory(response.data.telemetryHistory);
        setCommandHistory(response.data.commandHistory);
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to load analytics", error);
        setLoading(false);
      }
    };

    fetchAnalytics();
    
    // Optional: Refresh the charts every 10 seconds automatically!
    const interval = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(interval);
    
  }, [deviceId]);

  // Custom Tooltip for Dark Mode Recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-slate-300 text-xs mb-2 font-mono">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-bold" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div className="h-screen w-full bg-slate-950 flex items-center justify-center text-emerald-500 font-mono">Connecting to Data Stream...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/20 p-6 flex flex-col gap-8 relative overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Enhanced Header with futuristic design */}
      <div className="relative z-10 flex justify-between items-center bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/60 shadow-2xl">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/')} 
            className="group p-3 text-slate-400 hover:text-white transition-all duration-300 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl hover:scale-110 shadow-lg hover:shadow-cyan-500/20"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
          </button>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              <Activity className="text-emerald-500 animate-pulse" size={24} />
              Telemetry & Analytics
            </h2>
            <p className="text-sm text-slate-400 font-mono">Device: <span className="text-cyan-400">{deviceId}</span></p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-sm font-mono text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-full border border-emerald-400/20 shadow-lg">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-lg shadow-emerald-500/50"></span>
          </span>
          Live Connection
        </div>
      </div>

      {/* Enhanced KPI Gauges with futuristic design */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        
        {/* 1. Digital Twin: Boolean State (Light/Relay) */}
        {/* We check if relay_01 is 1 (ON) or 'ON' */}
        {(() => {
          const isLightOn = latestReadings.relay_01 === 1 || latestReadings.relay_01 === "ON";
          return (
            <div className={`group relative p-6 rounded-2xl border flex flex-col justify-center overflow-hidden transition-all duration-500 shadow-2xl hover:scale-105 ${
              isLightOn 
                ? 'bg-amber-500/10 border-amber-500/50 shadow-amber-500/20' 
                : 'bg-slate-900/80 border-slate-800/60 backdrop-blur-sm'
            }`}>
              {/* Enhanced glow effect */}
              {isLightOn && (
                <>
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/20 blur-3xl rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-2xl"></div>
                </>
              )}
              
              <div className="flex items-center gap-4 z-10 relative">
                <div className={`p-4 rounded-xl transition-all duration-300 shadow-lg ${
                  isLightOn 
                    ? 'bg-amber-500 text-white shadow-amber-500/30 animate-pulse' 
                    : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'
                }`}>
                  <Lightbulb size={28} className={isLightOn ? "animate-pulse" : "group-hover:scale-110 transition-transform"} />
                </div>
                <div>
                  <p className={`text-sm font-bold uppercase tracking-wider mb-1 ${isLightOn ? 'text-amber-200' : 'text-slate-400'}`}>
                    Main Light
                  </p>
                  <h3 className={`text-2xl font-bold ${isLightOn ? 'text-amber-400' : 'text-slate-500'}`}>
                    {isLightOn ? 'ACTIVE' : 'OFF'}
                  </h3>
                </div>
              </div>
            </div>
          );
        })()}

        {/* 2. Temperature Gauge */}
        <div className="group bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-800/60 shadow-2xl hover:border-rose-500/30 hover:shadow-rose-500/10 transition-all duration-300 hover:scale-105">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-rose-500/10 text-rose-500 rounded-xl group-hover:bg-rose-500/20 transition-colors duration-300">
              <Thermometer size={28} className="group-hover:scale-110 transition-transform duration-200" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Temperature</p>
              <h3 className="text-3xl font-bold text-white">{latestReadings.temp_01 || '--'} <span className="text-lg text-slate-500">°C</span></h3>
            </div>
          </div>
        </div>
        
        {/* 3. Humidity Gauge */}
        <div className="group bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-800/60 shadow-2xl hover:border-blue-500/30 hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-500/10 text-blue-500 rounded-xl group-hover:bg-blue-500/20 transition-colors duration-300">
              <Droplets size={28} className="group-hover:scale-110 transition-transform duration-200" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Humidity</p>
              <h3 className="text-3xl font-bold text-white">{latestReadings.humidity_01 || '--'} <span className="text-lg text-slate-500">%</span></h3>
            </div>
          </div>
        </div>

        {/* 4. Motor Speed Gauge */}
        <div className="group bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-800/60 shadow-2xl hover:border-emerald-500/30 hover:shadow-emerald-500/10 transition-all duration-300 hover:scale-105">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-xl group-hover:bg-emerald-500/20 transition-colors duration-300">
              <Gauge size={28} className="group-hover:scale-110 transition-transform duration-200" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Motor (PWM)</p>
              <h3 className="text-3xl font-bold text-white">{latestReadings.motor_01 || '--'} <span className="text-lg text-slate-500">/ 255</span></h3>
            </div>
          </div>
        </div>

      </div>

      {/* Enhanced Main Chart Area */}
      <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-800/60 shadow-2xl flex-1 relative z-10">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
            <History size={20} className="text-purple-400 animate-pulse"/> Historical Telemetry
          </h3>
          <p className="text-slate-400 text-lg">Real-time sensor readings over the last hour with live data streaming.</p>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
            <span className="text-sm text-emerald-400 font-mono">Live Data Feed Active</span>
          </div>
        </div>
        
        <div className="h-[400px] w-full bg-slate-950/50 rounded-xl p-4 border border-slate-800/40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={telemetryHistory} margin={{ top: 5, right: 30, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: '#94a3b8' }}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: '#94a3b8' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ 
                  fontSize: '14px', 
                  color: '#cbd5e1',
                  paddingTop: '20px'
                }}
                iconType="rect"
              />
              
              <Line 
                type="monotone" 
                dataKey="temp_01" 
                name="Temperature (°C)" 
                stroke="#f43f5e" 
                strokeWidth={4} 
                dot={{ r: 6, strokeWidth: 3, fill: '#f43f5e' }} 
                activeDot={{ r: 8, strokeWidth: 0, fill: '#f43f5e' }}
                fill="url(#tempGradient)"
              />
              <Line 
                type="monotone" 
                dataKey="humidity_01" 
                name="Humidity (%)" 
                stroke="#3b82f6" 
                strokeWidth={4} 
                dot={{ r: 6, strokeWidth: 3, fill: '#3b82f6' }} 
                activeDot={{ r: 8, strokeWidth: 0, fill: '#3b82f6' }}
                fill="url(#humidityGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Enhanced Command Audit Log */}
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/60 overflow-hidden shadow-2xl relative z-10">
        <div className="p-6 border-b border-slate-800/60 flex justify-between items-center bg-gradient-to-r from-slate-800/20 to-slate-900/20">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <TerminalSquare size={20} className="text-blue-400 animate-pulse"/> Command Audit Trail
          </h3>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Real-time Activity</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="text-xs text-slate-500 uppercase bg-slate-950/60 backdrop-blur-sm">
              <tr>
                <th className="px-8 py-4 font-semibold text-slate-300">Timestamp</th>
                <th className="px-8 py-4 font-semibold text-slate-300">Issued By</th>
                <th className="px-8 py-4 font-semibold text-slate-300">Target Limb</th>
                <th className="px-8 py-4 font-semibold text-slate-300">Command</th>
                <th className="px-8 py-4 font-semibold text-slate-300">Value</th>
              </tr>
            </thead>
            <tbody>
              {commandHistory.map((cmd, index) => (
                <tr key={cmd.id} className="border-b border-slate-800/40 hover:bg-slate-800/30 transition-all duration-200 hover:scale-[1.01]">
                  <td className="px-8 py-5 font-mono text-sm text-slate-300">{cmd.timestamp}</td>
                  <td className="px-8 py-5 text-slate-200 font-medium">{cmd.user}</td>
                  <td className="px-8 py-5 font-mono text-sm text-blue-400 bg-blue-500/10 rounded-lg px-3 py-1">{cmd.limb}</td>
                  <td className="px-8 py-5">
                    <span className="bg-gradient-to-r from-slate-700 to-slate-800 text-slate-200 text-xs px-4 py-2 rounded-xl border border-slate-600 font-bold tracking-wider shadow-lg">
                      {cmd.type}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-emerald-400 font-bold text-lg">{cmd.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}