import { useState } from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../api/axios';

export default function ProvisionModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  
  // Form Data
  const [name, setName] = useState('');
  const [deviceType, setDeviceType] = useState('ESP32');
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleCreateDevice = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('fleet/devices/', { name, device_type: deviceType });
      setDeviceId(res.data.id);
      toast.success('Device registered in database.');
      setStep(2); // Move to WiFi setup
    } catch (err) {
      toast.error('Failed to create device.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFirmware = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Compiling firmware factory...');

    try {
      const response = await api.post(`fleet/devices/${deviceId}/generate-firmware/`, 

        { 

          ssid: ssid, 
          password: password, 
          server_ip: serverIp 
        },

        { responseType: 'blob' }
);

      // Force browser to download the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `nexus_firmware_${deviceId.substring(0,8)}.ino`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Firmware downloaded!', { id: toastId });
      onSuccess(); // Refresh the fleet grid
      onClose();   // Close modal
    } catch (error) {
      toast.error('Firmware compilation failed.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Add New Device</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {step === 1 ? (
            <form onSubmit={handleCreateDevice} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Device Name</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. Living Room Node" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Hardware Type</label>
                <select value={deviceType} onChange={e => setDeviceType(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
                  <option value="ESP32">ESP32 (Wi-Fi)</option>
                  <option value="RPI">Raspberry Pi (Linux)</option>
                </select>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-white text-slate-950 font-medium py-2 rounded-lg hover:bg-slate-200 transition-colors mt-4">
                {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Register Device'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleDownloadFirmware} className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded text-sm text-blue-400 p-3 mb-4">
                Device registered. Enter the Wi-Fi credentials it will use to connect to the internet.
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Wi-Fi SSID (Network Name)</label>
                <input type="text" required value={ssid} onChange={e => setSsid(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Wi-Fi Password</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors mt-4 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Download size={18} /> Download Firmware</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}