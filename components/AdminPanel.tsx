import React, { useState } from 'react';
import { LocationStatus } from '../types';
import { QrCode, X, Check, Save, LogOut, Smartphone, AlertCircle } from 'lucide-react';

interface AdminPanelProps {
  locations: LocationStatus[];
  onUpdateLocation: (id: string, updates: Partial<LocationStatus>) => void;
  onExit: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ locations, onUpdateLocation, onExit }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ description: string; details: string }>({ description: '', details: '' });
  const [showQrPreview, setShowQrPreview] = useState<string | null>(null); // 'Open' | 'Closed' | null
  const [mobileView, setMobileView] = useState<'list' | 'details'>('list');

  const handleSelect = (loc: LocationStatus) => {
    setSelectedId(loc.id);
    setEditForm({ description: loc.description, details: loc.details });
    setShowQrPreview(null);
    setMobileView('details'); // Switch to details view on mobile
  };

  const handleBackToList = () => {
    setMobileView('list');
  };

  const handleSaveText = () => {
    if (selectedId) {
      onUpdateLocation(selectedId, editForm);
      // Optional: Show success feedback
    }
  };

  // Simulates scanning a QR code
  const simulateScan = (status: 'Open' | 'Closed') => {
    if (selectedId) {
      onUpdateLocation(selectedId, { status });
      setShowQrPreview(null); // Close modal after "scanning"
    }
  };

  const selectedLocation = locations.find(l => l.id === selectedId);

  return (
    <div className="fixed inset-0 z-[60] bg-[#0a0a0a] text-white font-mono flex flex-col md:flex-row overflow-hidden">
      
      {/* Sidebar List - Hidden on mobile when viewing details */}
      <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-gray-800 flex flex-col bg-[#111] ${mobileView === 'details' ? 'hidden md:flex' : 'flex'} ${mobileView === 'list' ? 'h-full' : 'md:h-full'}`}>
        <div className="p-4 md:p-6 border-b border-gray-800 flex justify-between items-center bg-[#0a0a0a]">
          <div>
            <h2 className="text-lg md:text-xl font-bold tracking-tight">GLIMPSE<span className="text-gray-500">ADMIN</span></h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Facility Control</p>
          </div>
          <button onClick={onExit} className="p-2 hover:bg-gray-800 active:bg-gray-700 rounded-full transition-colors text-gray-400">
            <LogOut size={18} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar p-2">
          {locations.map(loc => (
            <div 
              key={loc.id}
              onClick={() => handleSelect(loc)}
              className={`
                p-4 mb-1 rounded cursor-pointer transition-all duration-200 border border-transparent active:scale-[0.98]
                ${selectedId === loc.id ? 'bg-[#1a1a1a] border-gray-700' : 'hover:bg-[#151515] active:bg-[#1a1a1a]'}
              `}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-sm">{loc.name}</span>
                <span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: loc.color }} />
              </div>
              <div className="text-xs text-gray-500 truncate">{loc.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Control Area - Hidden on mobile when viewing list */}
      <div className={`flex-1 flex flex-col bg-[#0a0a0a] h-full overflow-y-auto ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
        {selectedLocation ? (
          <div className="p-4 md:p-12 max-w-4xl mx-auto w-full">
            
            {/* Mobile Back Button */}
            <button 
              onClick={handleBackToList}
              className="md:hidden flex items-center gap-2 text-gray-400 mb-6 p-2 -ml-2 active:text-white transition-colors"
            >
              <X size={18} />
              <span className="text-xs uppercase tracking-widest">Back to List</span>
            </button>
            
            <div className="mb-6 md:mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{selectedLocation.name}</h1>
                <div className="flex items-center gap-2 flex-wrap">
                   <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-800 text-gray-300">
                     ID: {selectedLocation.id}
                   </span>
                   <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: selectedLocation.color, color: 'white' }}>
                     {selectedLocation.status}
                   </span>
                </div>
              </div>
              <div className="text-gray-600 hidden md:block">{selectedLocation.icon}</div>
            </div>

            {/* QR Code Action Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
              {/* Card 1: Open Trigger */}
              <div 
                className="bg-[#111] border border-gray-800 p-4 md:p-6 rounded-lg hover:border-green-900 active:border-green-700 transition-colors group cursor-pointer relative overflow-hidden"
                onClick={() => simulateScan('Open')}
              >
                 <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/20 group-hover:bg-emerald-500 group-active:bg-emerald-500 transition-colors"></div>
                 <div className="flex items-center justify-between mb-3 md:mb-4">
                    <h3 className="text-emerald-500 font-bold uppercase tracking-widest text-xs">Activation QR</h3>
                    <QrCode className="text-gray-600 group-hover:text-emerald-500 group-active:text-emerald-500 transition-colors" size={20} />
                 </div>
                 <p className="text-gray-400 text-sm mb-3 md:mb-4">Tap to set status to <strong className="text-white">OPEN</strong>.</p>
                 <div className="bg-white p-2 w-fit rounded-sm mx-auto opacity-70 group-hover:opacity-100 group-active:opacity-100 transition-opacity">
                    {/* Simulated QR Visual */}
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-black/10 flex flex-wrap gap-1 p-1">
                        {[...Array(16)].map((_, i) => <div key={i} className={`w-4 h-4 md:w-5 md:h-5 bg-black ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`} />)}
                    </div>
                 </div>
                 <div className="mt-3 md:mt-4 text-center text-[10px] text-emerald-500/50 uppercase tracking-widest group-hover:text-emerald-500 group-active:text-emerald-500">Tap to Simulate Scan</div>
              </div>

              {/* Card 2: Close Trigger */}
              <div 
                className="bg-[#111] border border-gray-800 p-4 md:p-6 rounded-lg hover:border-red-900 active:border-red-700 transition-colors group cursor-pointer relative overflow-hidden"
                onClick={() => simulateScan('Closed')}
              >
                 <div className="absolute top-0 left-0 w-1 h-full bg-red-500/20 group-hover:bg-red-500 group-active:bg-red-500 transition-colors"></div>
                 <div className="flex items-center justify-between mb-3 md:mb-4">
                    <h3 className="text-red-500 font-bold uppercase tracking-widest text-xs">Deactivation QR</h3>
                    <QrCode className="text-gray-600 group-hover:text-red-500 group-active:text-red-500 transition-colors" size={20} />
                 </div>
                 <p className="text-gray-400 text-sm mb-3 md:mb-4">Tap to set status to <strong className="text-white">CLOSED</strong>.</p>
                 <div className="bg-white p-2 w-fit rounded-sm mx-auto opacity-70 group-hover:opacity-100 group-active:opacity-100 transition-opacity">
                    {/* Simulated QR Visual */}
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-black/10 flex flex-wrap gap-1 p-1">
                        {[...Array(16)].map((_, i) => <div key={i} className={`w-4 h-4 md:w-5 md:h-5 bg-black ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`} />)}
                    </div>
                 </div>
                 <div className="mt-3 md:mt-4 text-center text-[10px] text-red-500/50 uppercase tracking-widest group-hover:text-red-500 group-active:text-red-500">Tap to Simulate Scan</div>
              </div>
            </div>

            {/* Manual Text Updates */}
            <div className="bg-[#111] border border-gray-800 rounded-lg p-4 md:p-6 mb-8">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 md:mb-6 border-b border-gray-800 pb-2">Manual Override</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs text-gray-500 mb-2 uppercase">Status Note (Description)</label>
                        <input 
                            type="text" 
                            value={editForm.description}
                            onChange={(e) => setEditForm(prev => ({...prev, description: e.target.value}))}
                            className="w-full bg-[#0a0a0a] border border-gray-800 rounded p-3 text-sm focus:outline-none focus:border-white transition-colors text-white placeholder-gray-700"
                            placeholder="e.g. Silent zone available"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-2 uppercase">Details / Capacity</label>
                        <input 
                            type="text" 
                            value={editForm.details}
                            onChange={(e) => setEditForm(prev => ({...prev, details: e.target.value}))}
                            className="w-full bg-[#0a0a0a] border border-gray-800 rounded p-3 text-sm focus:outline-none focus:border-white transition-colors text-white placeholder-gray-700"
                            placeholder="e.g. 45% Capacity"
                        />
                    </div>
                    <div className="flex justify-end pt-4">
                        <button 
                            onClick={handleSaveText}
                            className="bg-white text-black px-4 md:px-6 py-2 rounded text-sm font-bold uppercase tracking-wide hover:bg-gray-200 active:bg-gray-300 flex items-center gap-2 w-full md:w-auto justify-center"
                        >
                            <Save size={16} /> Save Changes
                        </button>
                    </div>
                </div>
            </div>

          </div>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-700 p-6">
                <Smartphone size={48} className="mb-4 opacity-50" />
                <p className="uppercase tracking-widest text-xs text-center">Select a location to manage</p>
                {/* Mobile hint */}
                <button 
                  onClick={handleBackToList}
                  className="md:hidden mt-6 text-gray-500 text-xs uppercase tracking-widest underline"
                >
                  View Locations
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;