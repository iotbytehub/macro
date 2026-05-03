import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import DeviceCard from '../components/DeviceCard';
import ProvisionModal from '../components/ProvisionModal';
import { api } from '../api/axios';

// The Skeleton Loader Component
const SkeletonCard = () => (
  <div className="border border-slate-800 bg-slate-900/50 rounded-xl p-5 h-[200px] animate-pulse">
    <div className="flex justify-between mb-8">
      <div className="h-4 w-16 bg-slate-800 rounded"></div>
      <div className="h-6 w-16 bg-slate-800 rounded"></div>
    </div>
    <div className="space-y-3">
      <div className="h-6 w-3/4 bg-slate-800 rounded"></div>
      <div className="h-3 w-1/2 bg-slate-800 rounded"></div>
    </div>
  </div>
);

export default function FleetManager() {
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

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Fleet Manager</h1>
          <p className="text-slate-400 text-sm mt-1">Monitor and control your deployed IoT nodes.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-slate-950 px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-200 transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Add Device
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <>
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </>
        ) : fleet.length === 0 ? (
          <div className="col-span-full text-slate-500 p-8 border border-dashed border-slate-800 rounded-xl text-center">
            No devices found in your organization.
          </div>
        ) : (
          fleet.map((device) => <DeviceCard key={device.id} device={device} />)
        )}
      </div>

      <ProvisionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchFleet} 
      />
    </div>
  );
}