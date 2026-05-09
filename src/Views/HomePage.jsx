import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// --- BACKGROUND ANIMATION COMPONENT ---
// This is isolated so it doesn't re-render your whole page logic.
const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#F8FAFC]">
      {/* Orb 1: Indigo */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-[#0EA5E9]/10 blur-[100px]"
      />

      {/* Orb 2: Amber */}
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 120, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[20%] -right-[5%] h-[600px] w-[600px] rounded-full bg-[#F59E0B]/10 blur-[120px]"
      />

      {/* Very subtle grid texture to stop it looking "muddy" */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
    </div>
  );
};

// --- DATA & STYLES ---
const devices = [
  { id: "SEN-0042", name: "Temp Sensor A1",   loc: "Warehouse A",     status: "online",  temp: "22.4°", hum: "61%", bat: "94%" },
  { id: "GW-019",   name: "Gateway Node 19",  loc: "Zone B — Roof",   status: "online",  temp: "—",     hum: "—",   bat: "AC"  },
  { id: "SEN-0107", name: "Humidity Probe",   loc: "Cold Storage",    status: "idle",    temp: "4.1°",  hum: "88%", bat: "8%"  },
  { id: "CAM-003",  name: "Camera Unit 3",    loc: "Entry Gate",      status: "online",  temp: "—",     hum: "—",   bat: "AC"  },
  { id: "SEN-0088", name: "CO₂ Monitor",      loc: "Lab B",           status: "online",  temp: "24.9°", hum: "55%", bat: "72%" },
  { id: "ACT-011",  name: "Actuator Valve",   loc: "Irrigation Z1",   status: "idle",    temp: "—",     hum: "—",   bat: "81%" },
  { id: "SEN-0031", name: "Light Sensor",     loc: "Greenhouse",      status: "online",  temp: "28.3°", hum: "70%", bat: "45%" },
  { id: "GW-007",   name: "Gateway Node 7",   loc: "Zone A — Main",   status: "offline", temp: "—",     hum: "—",   bat: "—"   },
];

const events = [
  { color: "bg-emerald-500", msg: <><strong>SEN-0042</strong> came online</>, time: "2m ago"  },
  { color: "bg-amber-400",   msg: <><strong>GW-019</strong> update scheduled</>, time: "5m ago"  },
  { color: "bg-red-500",     msg: <><strong>SEN-0107</strong> battery critical</>, time: "9m ago"  },
];

const usageBars = [
  { label: "Data Bandwidth",     pct: 78, color: "bg-sky-400"     },
  { label: "Storage Utilization",pct: 54, color: "bg-amber-400"   },
];

const statusStyles = {
  online:  { badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  idle:    { badge: "bg-amber-100 text-amber-700",     dot: "bg-amber-400"   },
  offline: { badge: "bg-red-100 text-red-600",         dot: "bg-red-400"     },
};

const FILTERS = ["All", "Online", "Idle", "Offline"];

// --- COMPONENTS ---
function Sparkline({ offline }) {
  const points = Array.from({ length: 10 }, (_, i) => `${i * 20},${4 + Math.random() * 20}`).join(" ");
  return (
    <svg viewBox="0 0 180 28" className="w-full h-7 mt-2" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={offline ? "#CBD5E1" : "#0EA5E9"} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function DeviceCard({ device }) {
  const s = statusStyles[device.status];
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-[#E2E8F0] rounded-xl p-4 hover:border-[#0EA5E9] hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl">🌡️</span>
        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${s.badge}`}>{device.status}</span>
      </div>
      <p className="text-sm font-semibold text-[#0F172A]">{device.name}</p>
      <p className="text-xs text-slate-400 mb-3">📍 {device.loc}</p>
      <Sparkline offline={device.status === "offline"} />
    </div>
  );
}

// --- MAIN PAGE ---
export default function HomePage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = devices.filter(d =>
    activeFilter === "All" ? true : d.status === activeFilter.toLowerCase()
  );

  return (
    <div className="relative min-h-screen w-full bg-transparent">
      
      {/* 1. FIXED BACKGROUND */}
      <BackgroundAnimation />

      {/* 2. SCROLLABLE CONTENT (Z-10 ensures it stays on top) */}
      <div className="relative z-10">
        
        {/* HERO SECTION */}
        <section className="flex flex-col items-center text-center px-6 pt-24 pb-16">
          <div className="bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 text-[#0EA5E9] text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] animate-pulse inline-block mr-2" />
            Live Fleet — 2,847 devices connected
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#0F172A] max-w-3xl mb-6">
            Manage your <span className="text-[#0EA5E9]">IoT fleet</span> with precision
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mb-10">
            A unified platform to monitor, automate, and architect your connected device networks at scale.
          </p>
          <div className="flex gap-4">
            <button onClick={() => navigate("/login")} className="bg-[#0EA5E9] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#0284C7] transition-all">
              Access Dashboard
            </button>
            <button className="bg-white border border-[#E2E8F0] px-8 py-3 rounded-xl font-medium hover:border-[#0EA5E9] transition-all">
              Documentation
            </button>
          </div>
        </section>

        {/* METRICS STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-y border-[#E2E8F0] bg-white/50 backdrop-blur-md">
          {[
            { val: "2,847+", lbl: "Active Devices" },
            { val: "99.97%", lbl: "Uptime SLA" },
            { val: "14ms",   lbl: "Avg. Latency" },
            { val: "3.2M",   lbl: "Events / Day" },
          ].map(({ val, lbl }) => (
            <div key={lbl} className="flex flex-col items-center py-8 border-x border-[#E2E8F0]/50">
              <span className="text-3xl font-bold text-[#0F172A]">{val}</span>
              <span className="text-xs text-slate-400 mt-1 uppercase tracking-widest">{lbl}</span>
            </div>
          ))}
        </div>

        {/* DEVICE GRID */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-3xl font-bold text-[#0F172A]">Live Fleet View</h2>
            <div className="flex gap-2">
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    activeFilter === f ? "bg-[#0EA5E9] text-white" : "bg-white text-slate-500 border-[#E2E8F0]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map(d => <DeviceCard key={d.id} device={d} />)}
          </div>
        </section>

        {/* RESOURCE USAGE & FEED */}
        <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-2 gap-8">
           <div className="bg-white/70 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-6">
              <h3 className="font-bold mb-4">Live Activity</h3>
              <div className="space-y-4">
                {events.map((e, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                    <span className={`w-2 h-2 rounded-full ${e.color}`} />
                    {e.msg}
                  </div>
                ))}
              </div>
           </div>
           <div className="bg-white/70 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-6">
              <h3 className="font-bold mb-4">Resource Usage</h3>
              {usageBars.map(bar => (
                <div key={bar.label} className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{bar.label}</span>
                    <span>{bar.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${bar.color}`} style={{ width: `${bar.pct}%` }} />
                  </div>
                </div>
              ))}
           </div>
        </section>

      </div>
    </div>
  );
}