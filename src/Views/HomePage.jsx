import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
function LightningCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      setPos({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", move);

    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, []);

  return (
    <motion.div
      animate={{
        x: pos.x - 12,
        y: pos.y - 12,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 28,
        mass: 0.2,
      }}
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
    >
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.85, 1, 0.85],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="text-[22px] drop-shadow-[0_0_12px_rgba(14,165,233,0.9)]"
      >
        ⚡
      </motion.div>
    </motion.div>
  );
}
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

// Sparkline Component with slower path animation
function Sparkline({ offline }) {
  const points = Array.from({ length: 10 }, (_, i) => `${i * 20},${4 + Math.random() * 20}`).join(" ");
  return (
    <svg viewBox="0 0 180 28" className="w-full h-7 mt-2" preserveAspectRatio="none">
      <motion.polyline
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.0, delay: 0.5, ease: "easeInOut" }} // Slower duration & added delay
        points={points}
        fill="none"
        stroke={offline ? "#CBD5E1" : "#0EA5E9"}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// DeviceCard with longer duration and updated stagger delay
function DeviceCard({ device, index }) {
  const s = statusStyles[device.status];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      // Adds a base 0.5s delay, plus 0.1s for each card to create a slow cascade
      transition={{ duration: 0.8, delay: 0.5 + (index * 0.1), ease: "easeOut" }} 
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(14, 165, 233, 0.15)" }}
      className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 hover:border-[#0EA5E9] transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl">🌡️</span>
        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${s.badge}`}>{device.status}</span>
      </div>
      <p className="text-sm font-semibold text-[#0F172A]">{device.name}</p>
      <p className="text-xs text-slate-400 mb-3">📍 {device.loc}</p>
      <Sparkline offline={device.status === "offline"} />
    </motion.div>
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

    
    <div className="relative bg-[#F8FAFC] text-[#0F172A] min-h-screen overflow-x-hidden cursor-none">
      <LightningCursor />
      {/* ── LAYERED BACKGROUND ANIMATION ── */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
            x: [0, 100, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }} // Kept very slow for background
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-sky-300/30 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
            x: [0, -100, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-200/20 blur-[100px] rounded-full"
        />
      </div>

      <main className="relative z-10">
        {/* ── HERO ── */}
        <section className="relative flex flex-col items-center text-center px-6 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }} // Added 0.5s delay
            className="flex items-center gap-2 bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 text-[#0EA5E9] text-xs font-medium px-3 py-1.5 rounded-full mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] animate-pulse inline-block" />
            Live Fleet — 2,847 devices connected
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }} // Deliberately staggered after the badge
            className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.05] tracking-[-2px] text-[#0F172A] max-w-2xl mb-5"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Manage your <span className="text-[#0EA5E9]">IoT fleet</span> with precision
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }} // Further staggered
            className="text-lg text-slate-500 max-w-xl leading-relaxed mb-10"
          >
            MACRO gives engineering teams a unified platform to monitor, automate, and architect their connected device networks at scale.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
            className="flex gap-3 flex-wrap justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="bg-[#0EA5E9] text-white px-6 py-3 rounded-xl text-sm font-medium shadow-lg shadow-[#0EA5E9]/20"
            >
              Access Dashboard →
            </motion.button>
            <motion.button
              whileHover={{ backgroundColor: "#f1f5f9" }}
              className="bg-white border border-[#E2E8F0] text-[#0F172A] px-6 py-3 rounded-xl text-sm font-medium"
            >
              View Documentation
            </motion.button>
          </motion.div>
        </section>

        {/* ── METRICS STRIP ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }} // Delayed scroll-in
          className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#E2E8F0] border-y border-[#E2E8F0] bg-white/80 backdrop-blur-md"
        >
          {[
            { val: "2,847+", lbl: "Active Devices" },
            { val: "99.97%", lbl: "Uptime SLA" },
            { val: "14ms", lbl: "Avg. Latency" },
            { val: "3.2M", lbl: "Events / Day" },
          ].map(({ val, lbl }) => (
            <div key={lbl} className="flex flex-col items-center py-6">
              <span className="text-3xl font-bold tracking-tight text-[#0F172A]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {val}
              </span>
              <span className="text-xs text-slate-400 mt-1">{lbl}</span>
            </div>
          ))}
        </motion.div>

        {/* ── DEVICE GRID ── */}
        <div className="bg-white/50 backdrop-blur-sm border-y border-[#E2E8F0]">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Device Grid</h2>
              <div className="flex gap-2 flex-wrap">
                {FILTERS.map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      activeFilter === f ? "bg-[#0EA5E9] text-white border-[#0EA5E9]" : "bg-white text-slate-500 border-[#E2E8F0]"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((d, i) => <DeviceCard key={d.id} device={d} index={i} />)}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* ── ACTIVITY + USAGE ── */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Events */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }} // Scroll delay
              className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-[#E2E8F0] font-semibold">Recent Events</div>
              {events.map((e, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0">
                  <span className={`w-2 h-2 rounded-full mt-1.5 ${e.color}`} />
                  <p className="text-sm text-slate-600 flex-1">{e.msg}</p>
                </div>
              ))}
            </motion.div>

            {/* Usage with animated bars */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }} // Staggered slightly after events
              className="bg-white border border-[#E2E8F0] rounded-2xl p-5"
            >
              <div className="font-semibold mb-4">Resource Usage</div>
              {usageBars.map(({ label, pct, color }) => (
                <div key={label} className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{label}</span>
                    <span className="font-bold">{pct}%</span>
                  </div>
                  <div className="bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }} // Much slower fill rate, delayed start
                      className={`h-full ${color}`}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}