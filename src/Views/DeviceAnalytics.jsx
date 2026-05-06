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

  // Custom Tooltip for Light Mode Recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-[#E2E8F0] p-3 rounded-lg shadow-lg">
          <p className="text-[#0F172A] text-xs mb-2 font-mono">{label}</p>
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
    return <div className="h-screen w-full bg-[#F8FAFC] flex items-center justify-center text-[#0EA5E9] font-mono">Connecting to Data Stream...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F8FAFC] via-white to-[#0EA5E9]/5 p-6 flex flex-col gap-8 relative overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Enhanced Header with futuristic design */}
      <div className="relative z-10 flex justify-between items-center bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-[#E2E8F0] shadow-xl">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/')} 
            className="group p-3 text-slate-500 hover:text-slate-800 transition-all duration-300 bg-[#F8FAFC] hover:bg-[#E2E8F0] rounded-xl hover:scale-110 shadow-sm"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
          </button>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <Activity className="text-emerald-500 animate-pulse" size={24} />
              Telemetry & Analytics
            </h2>
            <p className="text-sm text-slate-500 font-mono">Device: <span className="text-[#0EA5E9]">{deviceId}</span></p>
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
            <div className={`group relative p-6 rounded-2xl border flex flex-col justify-center overflow-hidden transition-all duration-500 shadow-lg hover:-translate-y-1 ${
              isLightOn 
                ? 'bg-amber-50 border-amber-200 shadow-amber-500/10' 
                : 'bg-white/90 border-[#E2E8F0] backdrop-blur-sm'
            }`}>
              {/* Enhanced glow effect */}
              {isLightOn && (
                <>
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/20 blur-3xl rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-2xl"></div>
                </>
              )}
              
              <div className="flex items-center gap-4 z-10 relative">
                <div className={`p-4 rounded-xl transition-all duration-300 shadow-sm ${
                  isLightOn 
                    ? 'bg-amber-100 text-amber-600 shadow-amber-500/20 animate-pulse' 
                    : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                }`}>
                  <Lightbulb size={28} className={isLightOn ? "animate-pulse" : "group-hover:scale-110 transition-transform"} />
                </div>
                <div>
                  <p className={`text-sm font-bold uppercase tracking-wider mb-1 ${isLightOn ? 'text-amber-500' : 'text-slate-500'}`}>
                    Main Light
                  </p>
                  <h3 className={`text-2xl font-bold ${isLightOn ? 'text-amber-600' : 'text-slate-700'}`}>
                    {isLightOn ? 'ACTIVE' : 'OFF'}
                  </h3>
                </div>
              </div>
            </div>
          );
        })()}

        {/* 2. Temperature Gauge */}
        <div className="group bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-[#E2E8F0] shadow-lg hover:border-rose-300 hover:shadow-rose-500/10 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-rose-50 text-rose-500 rounded-xl group-hover:bg-rose-100 transition-colors duration-300">
              <Thermometer size={28} className="group-hover:scale-110 transition-transform duration-200" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Temperature</p>
              <h3 className="text-3xl font-bold text-slate-800">{latestReadings.temp_01 || '--'} <span className="text-lg text-slate-500">°C</span></h3>
            </div>
          </div>
        </div>
        
        {/* 3. Humidity Gauge */}
        <div className="group bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-[#E2E8F0] shadow-lg hover:border-blue-300 hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-50 text-blue-500 rounded-xl group-hover:bg-blue-100 transition-colors duration-300">
              <Droplets size={28} className="group-hover:scale-110 transition-transform duration-200" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Humidity</p>
              <h3 className="text-3xl font-bold text-slate-800">{latestReadings.humidity_01 || '--'} <span className="text-lg text-slate-500">%</span></h3>
            </div>
          </div>
        </div>

        {/* 4. Motor Speed Gauge */}
        <div className="group bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-[#E2E8F0] shadow-lg hover:border-emerald-300 hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-50 text-emerald-500 rounded-xl group-hover:bg-emerald-100 transition-colors duration-300">
              <Gauge size={28} className="group-hover:scale-110 transition-transform duration-200" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Motor (PWM)</p>
              <h3 className="text-3xl font-bold text-slate-800">{latestReadings.motor_01 || '--'} <span className="text-lg text-slate-500">/ 255</span></h3>
            </div>
          </div>
        </div>

      </div>

      {/* Enhanced Main Chart Area */}
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl border border-[#E2E8F0] shadow-xl flex-1 relative z-10">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3 mb-2">
            <History size={20} className="text-purple-500 animate-pulse"/> Historical Telemetry
          </h3>
          <p className="text-slate-500 text-lg">Real-time sensor readings over the last hour with live data streaming.</p>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
            <span className="text-sm text-emerald-400 font-mono">Live Data Feed Active</span>
          </div>
        </div>
        
        <div className="h-[400px] w-full bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0] shadow-inner">
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
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#94A3B8" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: '#64748B' }}
              />
              <YAxis 
                stroke="#94A3B8" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: '#64748B' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ 
                  fontSize: '14px', 
                  color: '#475569',
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
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xl relative z-10">
        <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <TerminalSquare size={20} className="text-[#0EA5E9] animate-pulse"/> Command Audit Trail
          </h3>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <div className="w-2 h-2 bg-[#0EA5E9] rounded-full animate-pulse"></div>
            <span>Real-time Activity</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-[#F8FAFC]">
              <tr>
                <th className="px-8 py-4 font-semibold text-slate-600">Timestamp</th>
                <th className="px-8 py-4 font-semibold text-slate-600">Issued By</th>
                <th className="px-8 py-4 font-semibold text-slate-600">Target Limb</th>
                <th className="px-8 py-4 font-semibold text-slate-600">Command</th>
                <th className="px-8 py-4 font-semibold text-slate-600">Value</th>
              </tr>
            </thead>
            <tbody>
              {commandHistory.map((cmd, index) => (
                <tr key={cmd.id} className="border-b border-[#E2E8F0] hover:bg-slate-50 transition-all duration-200 hover:-translate-y-0.5">
                  <td className="px-8 py-5 font-mono text-sm text-slate-500">{cmd.timestamp}</td>
                  <td className="px-8 py-5 text-slate-700 font-medium">{cmd.user}</td>
                  <td className="px-8 py-5 font-mono text-sm text-[#0EA5E9] bg-blue-50 rounded-lg px-3 py-1">{cmd.limb}</td>
                  <td className="px-8 py-5">
                    <span className="bg-white text-slate-800 text-xs px-4 py-2 rounded-xl border border-slate-200 font-bold tracking-wider shadow-sm">
                      {cmd.type}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-emerald-500 font-bold text-lg">{cmd.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}