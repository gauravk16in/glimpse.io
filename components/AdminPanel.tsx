import React, { useState } from 'react';
import { LocationStatus } from '../types';
import { QrCode, X, Check, Save, LogOut, Smartphone, AlertCircle, ArrowLeft, Edit3 } from 'lucide-react';

interface AdminPanelProps {
  locations: LocationStatus[];
  onUpdateLocation: (id: string, updates: Partial<LocationStatus>) => void;
  onExit: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ locations, onUpdateLocation, onExit }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ description: string; details: string }>({ description: '', details: '' });
  const [showQrPreview, setShowQrPreview] = useState<string | null>(null); // 'Open' | 'Closed' | null

  const handleSelect = (loc: LocationStatus) => {
    setSelectedId(loc.id);
    setEditForm({ description: loc.description, details: loc.details });
    setShowQrPreview(null);
  };

  const handleBackToList = () => {
    setSelectedId(null);
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
      
      {/* Sidebar List - Hidden on mobile if item selected */}
      <div className={`
          w-full md:w-1/3 lg:w-1/4 border-r border-gray-800 flex-col h-full bg-[#111]
          ${selectedId ? 'hidden md:flex' : 'flex'}
      `}>
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0a0a0a] shrink-0">
          <div>
            <h2 className="text-xl font-bold tracking-tight">GLIMPSE<span className="text-gray-500">ADMIN</span></h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Facility Control</p>
          </div>
          <button onClick={onExit} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400">
            <LogOut size={18} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar p-2">
          {locations.map(loc => (
            <div 
              key={loc.id}
              onClick={() => handleSelect(loc)}
              className={`
                p-4 mb-1 rounded cursor-pointer transition-all duration-200 border border-transparent flex justify-between items-center
                ${selectedId === loc.id ? 'bg-[#1a1a1a] border-gray-700' : 'hover:bg-[#151515]'}
              `}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: loc.color }} />
                    <span className="font-semibold text-sm">{loc.name}</span>
                </div>
                <div className="text-xs text-gray-500 pl-4">{loc.status}</div>
              </div>
              <Edit3 size={14} className="text-gray-600" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Control Area - Full screen on mobile if selected */}
      <div className={`
          flex-1 flex-col bg-[#0a0a0a] h-full overflow-hidden
          ${selectedId ? 'flex' : 'hidden md:flex'}
      `}>
        {selectedLocation ? (
          <div className="w-full h-full flex flex-col">
            
            {/* Mobile Back Header */}
            <div className="md:hidden sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-gray-800 p-4 flex items-center gap-3 shrink-0">
                <button onClick={handleBackToList} className="p-2 -ml-2 text-gray-400 hover:text-white">
                    <ArrowLeft size={20} />
                </button>
                <span className="font-bold text-sm uppercase tracking-wider">Edit Location</span>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-12">
                <div className="max-w-4xl mx-auto w-full pb-20 md:pb-0">
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{selectedLocation.name}</h1>
                        <div className="flex items-center gap-2">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12">
                    {/* Card 1: Open Trigger */}
                    <div 
                        className="bg-[#111] border border-gray-800 p-6 rounded-lg hover:border-green-900 transition-colors group cursor-pointer relative overflow-hidden active:scale-95 duration-200"
                        onClick={() => simulateScan('Open')}
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/20 group-hover:bg-emerald-500 transition-colors"></div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-emerald-500 font-bold uppercase tracking-widest text-xs">Activation QR</h3>
                            <QrCode className="text-gray-600 group-hover:text-emerald-500 transition-colors" />
                        </div>
                        <p className="text-gray-400 text-sm mb-4">Scan to set status to <strong className="text-white">OPEN</strong>.</p>
                        <div className="mt-4 text-center text-[10px] text-emerald-500/50 uppercase tracking-widest group-hover:text-emerald-500">Tap to Simulate Scan</div>
                    </div>

                    {/* Card 2: Close Trigger */}
                    <div 
                        className="bg-[#111] border border-gray-800 p-6 rounded-lg hover:border-red-900 transition-colors group cursor-pointer relative overflow-hidden active:scale-95 duration-200"
                        onClick={() => simulateScan('Closed')}
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500/20 group-hover:bg-red-500 transition-colors"></div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-red-500 font-bold uppercase tracking-widest text-xs">Deactivation QR</h3>
                            <QrCode className="text-gray-600 group-hover:text-red-500 transition-colors" />
                        </div>
                        <p className="text-gray-400 text-sm mb-4">Scan to set status to <strong className="text-white">CLOSED</strong>.</p>
                        <div className="mt-4 text-center text-[10px] text-red-500/50 uppercase tracking-widest group-hover:text-red-500">Tap to Simulate Scan</div>
                    </div>
                    </div>

                    {/* Manual Text Updates */}
                    <div className="bg-[#111] border border-gray-800 rounded-lg p-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-800 pb-2">Manual Override</h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs text-gray-500 mb-2 uppercase">Status Note (Description)</label>
                                <input 
                                    type="text" 
                                    value={editForm.description}
                                    onChange={(e) => setEditForm(prev => ({...prev, description: e.target.value}))}
                                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg p-4 text-sm focus:outline-none focus:border-white transition-colors text-white placeholder-gray-700 appearance-none"
                                    placeholder="e.g. Silent zone available"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-2 uppercase">Details / Capacity</label>
                                <input 
                                    type="text" 
                                    value={editForm.details}
                                    onChange={(e) => setEditForm(prev => ({...prev, details: e.target.value}))}
                                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg p-4 text-sm focus:outline-none focus:border-white transition-colors text-white placeholder-gray-700 appearance-none"
                                    placeholder="e.g. 45% Capacity"
                                />
                            </div>
                            <div className="flex justify-end pt-4">
                                <button 
                                    onClick={handleSaveText}
                                    className="w-full md:w-auto bg-white text-black px-6 py-4 md:py-3 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-gray-200 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                                >
                                    <Save size={16} /> Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-700 p-8 text-center">
                <Smartphone size={48} className="mb-4 opacity-50" />
                <p className="uppercase tracking-widest text-xs mb-2">Select a location to manage</p>
                <p className="text-[10px] text-gray-800 max-w-xs">Use the list on the left to select a facility and update its live status.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;