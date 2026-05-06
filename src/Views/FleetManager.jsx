import { useState, useEffect } from 'react';
import { Plus, Waves, Fish } from 'lucide-react';
import DeviceCard from '../components/DeviceCard';
import ProvisionModal from '../components/ProvisionModal';
import { api } from '../api/axios';
import { useNavigate } from 'react-router-dom';

// Animated Whale Component
const AnimatedWhale = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {/* Whale 1 - Large slow moving */}
    <div className="absolute top-1/4 left-1/4 animate-bounce" style={{ animationDuration: '8s', animationDelay: '0s' }}>
      <div className="text-cyan-500/20 text-8xl transform rotate-12 animate-pulse">
        🐋
      </div>
    </div>
    
    {/* Whale 2 - Medium faster */}
    <div className="absolute top-3/4 right-1/4 animate-bounce" style={{ animationDuration: '6s', animationDelay: '2s' }}>
      <div className="text-blue-500/15 text-6xl transform -rotate-12 animate-pulse">
        🐳
      </div>
    </div>
    
    {/* Whale 3 - Small fast */}
    <div className="absolute top-1/2 left-3/4 animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}>
      <div className="text-teal-500/10 text-4xl transform rotate-45 animate-pulse">
        🐬
      </div>
    </div>
    
    {/* Floating particles */}
    <div className="absolute top-1/3 right-1/3 animate-ping" style={{ animationDuration: '4s' }}>
      <div className="w-2 h-2 bg-cyan-400/30 rounded-full"></div>
    </div>
    <div className="absolute bottom-1/3 left-1/3 animate-ping" style={{ animationDuration: '5s', animationDelay: '1s' }}>
      <div className="w-1 h-1 bg-blue-400/40 rounded-full"></div>
    </div>
    <div className="absolute top-2/3 right-1/2 animate-ping" style={{ animationDuration: '6s', animationDelay: '2s' }}>
      <div className="w-1.5 h-1.5 bg-teal-400/25 rounded-full"></div>
    </div>
  </div>
);

// Enhanced Skeleton Loader with animations
const SkeletonCard = () => (
  <div className="border border-slate-800/60 bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 h-[280px] animate-pulse shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500">
    <div className="flex justify-between mb-8">
      <div className="h-4 w-20 bg-slate-700 rounded animate-pulse"></div>
      <div className="h-6 w-16 bg-slate-700 rounded animate-pulse"></div>
    </div>
    <div className="space-y-4">
      <div className="h-7 w-3/4 bg-slate-700 rounded animate-pulse"></div>
      <div className="h-4 w-1/2 bg-slate-700 rounded animate-pulse"></div>
      <div className="h-4 w-2/3 bg-slate-700 rounded animate-pulse"></div>
    </div>
    <div className="mt-6 flex gap-3">
      <div className="h-10 flex-1 bg-slate-700 rounded-lg animate-pulse"></div>
      <div className="h-10 flex-1 bg-slate-700 rounded-lg animate-pulse"></div>
      <div className="h-10 w-10 bg-slate-700 rounded-lg animate-pulse"></div>
    </div>
  </div>
);

export default function FleetManager() {
  const navigate = useNavigate();
  const [fleet, setFleet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchFleet = async () => {
    try {
      const response = await api.get('fleet/devices/');
      setFleet(response.data);
    } catch (error) {
      console.error("Failed to fetch fleet.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFleet(); }, []);

  // Placeholder navigation for when they click "Edit Architecture" on a card
  const navigateToCanvas = (deviceId) => {
    navigate(`/canvas/${deviceId}`);
  };

  return (
    <div className="relative min-h-screen p-8 max-w-7xl mx-auto overflow-hidden">
      {/* Animated Whale Background */}
      <AnimatedWhale />
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/50 to-cyan-950/20 pointer-events-none"></div>
      
      <div className="relative z-10">
        {/* Enhanced Header with futuristic styling */}
        <div className="flex justify-between items-end mb-12 border-b border-slate-800/60 pb-8 bg-slate-900/20 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full animate-pulse"></div>
              <h1 className="text-4xl font-bold text-white tracking-tight bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                Fleet Manager
              </h1>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Monitor, control, and architect your deployed IoT nodes in the Macro ecosystem.
            </p>
            <div className="flex items-center gap-2 text-sm text-cyan-400 font-mono">
              <Waves size={16} className="animate-bounce" />
              <span>Live Ocean Network</span>
            </div>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group relative bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 hover:scale-105 flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Plus size={18} className="relative z-10 group-hover:rotate-90 transition-transform duration-300" />
            <span className="relative z-10">Provision Node</span>
          </button>
        </div>

        {/* Enhanced Grid with better spacing and animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : fleet.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-12 shadow-2xl max-w-md mx-auto">
                <Fish size={48} className="text-slate-600 mx-auto mb-4 animate-bounce" />
                <p className="text-slate-400 text-lg mb-2">No devices found in your ocean</p>
                <p className="text-slate-500 text-sm">Provision a node to start your Macro journey.</p>
              </div>
            </div>
          ) : (
            fleet.map((device, index) => (
              <div 
                key={device.id} 
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <DeviceCard 
                  device={device} 
                  onRefresh={fetchFleet} 
                  onDesignCanvas={() => navigateToCanvas(device.id)}
                  onAutomation={() => navigate(`/automation/${device.id}`)}
                />
              </div>
            ))
          )}
        </div>
      </div>

      <ProvisionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchFleet} 
      />
    </div>
  );
}