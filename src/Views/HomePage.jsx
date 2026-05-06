import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  { color: "bg-emerald-500", msg: <><strong>SEN-0042</strong> came online — temperature 22.4°C</>,         time: "2m ago"  },
  { color: "bg-amber-400",   msg: <><strong>GW-019</strong> firmware update scheduled for 03:00 UTC</>,    time: "5m ago"  },
  { color: "bg-red-500",     msg: <><strong>SEN-0107</strong> battery critical — 8% remaining</>,          time: "9m ago"  },
  { color: "bg-sky-500",     msg: <><strong>Automation #14</strong> triggered — Warehouse A cooling on</>, time: "12m ago" },
  { color: "bg-emerald-500", msg: <><strong>CAM-003</strong> motion detected, snapshot saved</>,           time: "18m ago" },
  { color: "bg-sky-500",     msg: <><strong>3 devices</strong> provisioned to Fleet Zone B</>,             time: "24m ago" },
];

const usageBars = [
  { label: "Data Bandwidth",     pct: 78, color: "bg-sky-400"     },
  { label: "Storage Utilization",pct: 54, color: "bg-amber-400"   },
  { label: "Active Automations", pct: 91, color: "bg-sky-400"     },
  { label: "API Rate Limit",     pct: 32, color: "bg-emerald-400" },
  { label: "Offline Devices",    pct: 3,  color: "bg-slate-300"   },
];

const statusStyles = {
  online:  { badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  idle:    { badge: "bg-amber-100 text-amber-700",     dot: "bg-amber-400"   },
  offline: { badge: "bg-red-100 text-red-600",         dot: "bg-red-400"     },
};

const FILTERS = ["All", "Online", "Idle", "Offline"];

function Sparkline({ offline }) {
  const points = Array.from({ length: 10 }, (_, i) => {
    const x = i * 20;
    const y = 4 + Math.random() * 20;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 180 28" className="w-full h-7 mt-2" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={offline ? "#CBD5E1" : "#0EA5E9"}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DeviceCard({ device }) {
  const s = statusStyles[device.status];
  return (
    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 hover:border-[#0EA5E9] hover:shadow-md hover:shadow-[#0EA5E9]/10 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl">
          {device.status === "offline" ? "🔌" : device.id.startsWith("GW") ? "📡" : device.id.startsWith("CAM") ? "📷" : device.id.startsWith("ACT") ? "⚙️" : "🌡️"}
        </span>
        <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${s.badge}`}>
          {device.status}
        </span>
      </div>
      <p className="text-sm font-semibold text-[#0F172A] mb-0.5">{device.name}</p>
      <p className="text-xs text-slate-400 mb-3">📍 {device.loc}</p>
      <div className="flex justify-between text-center">
        {[["Temp", device.temp], ["Hum", device.hum], ["Bat", device.bat]].map(([k, v]) => (
          <div key={k}>
            <p className="text-sm font-semibold font-mono text-[#0F172A]">{v}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{k}</p>
          </div>
        ))}
      </div>
      <Sparkline offline={device.status === "offline"} />
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = devices.filter(d =>
    activeFilter === "All" ? true : d.status === activeFilter.toLowerCase()
  );

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A]">

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center text-center px-6 pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 900px 500px at 50% 0%, #BAE6FD33 0%, transparent 70%)" }} />

        <div className="flex items-center gap-2 bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 text-[#0EA5E9] text-xs font-medium px-3 py-1.5 rounded-full mb-6 relative z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] animate-pulse inline-block" />
          Live Fleet — 2,847 devices connected
        </div>

        <h1
          className="relative z-10 text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.05] tracking-[-2px] text-[#0F172A] max-w-2xl mb-5"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Manage your <span className="text-[#0EA5E9]">IoT fleet</span> with precision
        </h1>
        <p className="relative z-10 text-lg text-slate-500 max-w-xl leading-relaxed mb-10">
          MACRO gives engineering teams a unified platform to monitor, automate, and architect their connected device networks at scale.
        </p>
        <div className="relative z-10 flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white px-6 py-3 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#0EA5E9]/20"
          >
            Access Dashboard →
          </button>
          <button className="bg-white border border-[#E2E8F0] hover:border-[#0EA5E9] text-[#0F172A] px-6 py-3 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5">
            View Documentation
          </button>
        </div>
      </section>

      {/* ── METRICS STRIP ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#E2E8F0] border-y border-[#E2E8F0] bg-white">
        {[
          { val: "2,847+", lbl: "Active Devices" },
          { val: "99.97%", lbl: "Uptime SLA" },
          { val: "14ms",   lbl: "Avg. Latency" },
          { val: "3.2M",   lbl: "Events / Day" },
        ].map(({ val, lbl }) => (
          <div key={lbl} className="flex flex-col items-center py-6 hover:bg-[#F8FAFC] transition-colors">
            <span className="text-3xl font-bold tracking-tight text-[#0F172A]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {val}
            </span>
            <span className="text-xs text-slate-400 mt-1">{lbl}</span>
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0EA5E9] mb-1">Platform Capabilities</p>
            <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Everything your fleet needs
            </h2>
            <p className="text-slate-500 mt-2 max-w-md">From device provisioning to real-time telemetry — all in one intelligent platform.</p>
          </div>
          <span className="text-xs font-semibold bg-[#F59E0B]/10 text-[#F59E0B] px-3 py-1.5 rounded-full border border-[#F59E0B]/30">
            ✦ New: AI Anomaly Detection
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 border border-[#E2E8F0] rounded-2xl overflow-hidden divide-x divide-y divide-[#E2E8F0]">
          {[
            { icon: "🗺️",  color: "bg-[#0EA5E9]/10 text-[#0EA5E9]",     title: "Device Architecture",    desc: "Design complex IoT topologies with a visual blueprint editor. Define device roles, hierarchies, and protocols." },
            { icon: "📈",  color: "bg-[#0EA5E9]/10 text-[#0EA5E9]",     title: "Real-time Analytics",    desc: "Stream sensor telemetry, track performance KPIs, and build dashboards with live updates every 200ms." },
            { icon: "⚡",  color: "bg-[#F59E0B]/10 text-[#F59E0B]", title: "Automation Rules",       desc: "Build conditional trigger chains and scheduled workflows. React to sensor thresholds without code." },
            { icon: "🔒",  color: "bg-emerald-50 text-emerald-600", title: "Security & Access", desc: "Role-based access control, end-to-end encrypted channels, and full audit logs on every device interaction." },
            { icon: "🔌",  color: "bg-[#0EA5E9]/10 text-[#0EA5E9]",     title: "REST & WebSocket API",   desc: "Integrate via a documented REST API or subscribe to real-time event streams over WebSocket." },
            { icon: "🧠",  color: "bg-[#E2E8F0] text-[#0F172A]",title: "AI Anomaly Detection",   desc: "ML models trained on your fleet baseline automatically surface unusual patterns before they become incidents." },
          ].map(({ icon, color, title, desc }) => (
            <div
              key={title}
              className="group relative bg-white p-8 hover:bg-[#F8FAFC] transition-all duration-200 cursor-default overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4 relative z-10 ${color}`}>
                {icon}
              </div>
              <h3 className="text-sm font-semibold text-[#0F172A] mb-2 relative z-10">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed relative z-10">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DEVICE GRID ── */}
      <div className="bg-white border-y border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#0EA5E9] mb-1">Live Fleet View</p>
              <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Device Grid
              </h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    activeFilter === f
                      ? "bg-[#0EA5E9] text-white border-[#0EA5E9]"
                      : "bg-white text-slate-500 border-[#E2E8F0] hover:border-[#0EA5E9]/50"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filtered.map(d => <DeviceCard key={d.id} device={d} />)}
          </div>
        </div>
      </div>

      {/* ── ACTIVITY + USAGE ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0EA5E9] mb-1">Operations</p>
        <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Live Activity Feed
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Events */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
              <span className="text-sm font-semibold text-[#0F172A]">Recent Events</span>
              <span className="text-xs text-slate-400">Last 30 minutes</span>
            </div>
            <div>
              {events.map((e, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3 hover:bg-[#F8FAFC] transition-colors">
                  <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${e.color}`} />
                  <p className="text-sm text-slate-600 leading-snug flex-1">{e.msg}</p>
                  <span className="text-xs text-slate-400 flex-shrink-0 mt-0.5">{e.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Usage */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
              <span className="text-sm font-semibold text-[#0F172A]">Resource Usage</span>
              <span className="text-xs text-slate-400">Across all zones</span>
            </div>
            <div className="px-5 py-4 space-y-4">
              {usageBars.map(({ label, pct, color }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm text-slate-600">{label}</span>
                    <span className="text-sm font-semibold text-[#0F172A]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{pct}%</span>
                  </div>
                  <div className="bg-[#E2E8F0] rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 pb-5">
              <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl p-4 flex gap-3 items-start">
                <span className="text-[#F59E0B] mt-0.5 flex-shrink-0">⚠️</span>
                <div>
                  <p className="text-sm font-semibold text-[#F59E0B] mb-0.5">Bandwidth Alert</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Zone C approaching 80% threshold. Consider upgrading your plan or optimizing telemetry frequency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="bg-gradient-to-r from-[#0EA5E9]/10 to-[#F59E0B]/10 px-6 py-20 text-center border-y border-[#E2E8F0]">
        <h2
          className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-tight text-[#0F172A] mb-3"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Ready to take control of your fleet?
        </h2>
        <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto">
          Join 400+ engineering teams already managing their IoT infrastructure with MACRO.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => navigate("/login")}
            className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white px-7 py-3 rounded-xl font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#0EA5E9]/20"
          >
            Start Free Trial
          </button>
          <button className="bg-white border border-[#E2E8F0] hover:border-[#0EA5E9] text-[#0F172A] px-7 py-3 rounded-xl font-medium transition-all hover:bg-[#F8FAFC]">
            Talk to Sales
          </button>
        </div>
      </div>

    </div>
  );
}