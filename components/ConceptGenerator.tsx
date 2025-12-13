import React, { useState, useRef } from 'react';
import { Clock, Lock, Users, MapPin, AlertCircle, Coffee, BookOpen, Activity, Monitor, Send, Camera, Zap, Award, Grid, Map as MapIcon, GraduationCap } from 'lucide-react';
import { LocationStatus, LiveUpdate, BeaconRequest, Professor } from '../types';
import FacultyTracker from './FacultyTracker';

interface ConceptGeneratorProps {
    locations: LocationStatus[];
    onAdminClick: () => void;
    onPostUpdate: (id: string, author: string, message: string) => void;
    // New Props
    karma: number;
    beaconRequests: Record<string, BeaconRequest[]>;
    onQueueAnalysis: (id: string, imageBase64: string) => Promise<void>;
    onBeaconRequest: (id: string, item: string, requester: string) => void;
    onBeaconFulfill: (reqId: string, locationId: string) => void;
    professors: Professor[];
}

// --- Live Crowd Feed Component ---
const LiveCrowdFeed: React.FC<{ 
    updates: LiveUpdate[]; 
    onPost: (author: string, msg: string) => void 
}> = ({ updates, onPost }) => {
    const [name, setName] = useState('');
    const [msg, setMsg] = useState('');

    const handleSubmit = () => {
        if (!msg.trim()) return;
        onPost(name || 'Anonymous', msg);
        setMsg('');
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 space-y-3 mb-4 max-h-48 overflow-y-auto no-scrollbar pt-2">
                {updates.length === 0 ? (
                    <div className="text-xs text-gray-300 italic py-2">No active reports. Be the first to check in.</div>
                ) : (
                    updates.map(u => (
                        <div key={u.id} className="text-xs bg-gray-50 p-2 rounded border border-gray-100 animate-in slide-in-from-bottom-2 duration-300">
                            <div className="flex justify-between items-baseline mb-1">
                                <span className="font-bold text-black">{u.author}</span>
                                <span className="text-[10px] text-gray-400 font-mono">{u.timestamp}</span>
                            </div>
                            <span className="text-gray-600 leading-snug block">{u.message}</span>
                        </div>
                    ))
                )}
            </div>
            
            <div className="flex flex-col gap-2 mt-auto">
                 <input 
                    className="w-full bg-white border border-gray-200 rounded p-2 text-xs focus:outline-none focus:border-black transition-colors placeholder-gray-400"
                    placeholder="Your Name (Optional)"
                    value={name}
                    onChange={e => setName(e.target.value)}
                 />
                 <div className="flex gap-2">
                     <input 
                        className="w-full bg-white border border-gray-200 rounded p-2 text-xs focus:outline-none focus:border-black transition-colors placeholder-gray-400"
                        placeholder="Current status (e.g. Too noisy)"
                        value={msg}
                        onChange={e => setMsg(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                     />
                     <button 
                        onClick={handleSubmit}
                        className="bg-black text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors flex items-center justify-center"
                     >
                        <Send size={12} />
                     </button>
                 </div>
            </div>
        </div>
    );
};

// --- Beacon Component ---
const BeaconSystem: React.FC<{
    requests: BeaconRequest[];
    onRequest: (item: string) => void;
    onFulfill: (id: string) => void;
}> = ({ requests, onRequest, onFulfill }) => {
    const [newItem, setNewItem] = useState('');

    const handleRequest = () => {
        if(!newItem.trim()) return;
        onRequest(newItem);
        setNewItem('');
    };

    return (
        <div className="flex flex-col h-full">
            <div className="bg-amber-50 border border-amber-100 p-3 rounded mb-3 text-[10px] text-amber-800 leading-relaxed">
                <span className="font-bold block mb-1 flex items-center gap-1"><Zap size={10} className="fill-amber-500 text-amber-500" /> THE BEACON</span>
                Request items (chargers, notes) from others in this location. Helping earns Karma.
            </div>

            <div className="flex-1 space-y-2 mb-4 max-h-48 overflow-y-auto no-scrollbar">
                {requests.length === 0 ? (
                    <div className="text-xs text-gray-300 italic text-center py-4">No active signals.</div>
                ) : (
                    requests.map(req => (
                        <div key={req.id} className={`text-xs p-3 rounded border flex justify-between items-center ${req.status === 'fulfilled' ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-200 shadow-sm'}`}>
                            <div>
                                <div className="font-bold text-black">{req.item}</div>
                                <div className="text-[10px] text-gray-500">Requested by {req.requester} • {req.timestamp}</div>
                            </div>
                            {req.status === 'pending' ? (
                                <button 
                                    onClick={() => onFulfill(req.id)}
                                    className="bg-black text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wide hover:scale-105 transition-transform"
                                >
                                    I Have It
                                </button>
                            ) : (
                                <span className="text-[10px] text-green-600 font-bold uppercase border border-green-200 px-2 py-0.5 rounded bg-green-50">Resolved</span>
                            )}
                        </div>
                    ))
                )}
            </div>

            <div className="flex gap-2 mt-auto border-t border-gray-100 pt-3">
                 <input 
                    className="w-full bg-white border border-gray-200 rounded p-2 text-xs focus:outline-none focus:border-amber-500 transition-colors placeholder-gray-400"
                    placeholder="I need..."
                    value={newItem}
                    onChange={e => setNewItem(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRequest()}
                 />
                 <button 
                    onClick={handleRequest}
                    className="bg-amber-500 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wide hover:bg-amber-600 transition-colors flex items-center justify-center whitespace-nowrap"
                 >
                    Signal
                 </button>
             </div>
        </div>
    );
};

// --- Main Dashboard ---
const GlimpseDashboard: React.FC<ConceptGeneratorProps> = ({ 
    locations, onAdminClick, onPostUpdate, 
    karma, beaconRequests, onQueueAnalysis, onBeaconRequest, onBeaconFulfill,
    professors
}) => {
  const [activeId, setActiveId] = useState<string>('1');
  const [tab, setTab] = useState<'feed' | 'beacon'>('feed');
  const [analyzing, setAnalyzing] = useState(false);
  const [mode, setMode] = useState<'campus' | 'faculty'>('campus');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle click for mobile, hover for desktop
  const handleInteraction = (id: string) => {
    setActiveId(id);
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setAnalyzing(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result as string;
            // Remove data url prefix
            const base64Clean = base64.split(',')[1];
            await onQueueAnalysis(activeId, base64Clean);
            setAnalyzing(false);
        };
        reader.readAsDataURL(file);
    }
  };

  const activeItem = locations.find(l => l.id === activeId) || locations[0];
  const activeRequests = beaconRequests[activeId] || [];

  return (
    <div className="relative w-full h-screen bg-white text-black overflow-hidden font-sans select-none flex flex-col">
      
      {/* Header / Logo */}
      <div className="absolute top-0 left-0 w-full z-50 p-6 md:p-8 flex justify-between items-start pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-bold tracking-tighter shadow-sm">
                IO
            </div>
            <span className="font-mono text-sm tracking-widest uppercase hidden md:block opacity-50">Glimpse Campus</span>
          </div>

          {/* Mobile Admin Lock (New) */}
          <button 
            onClick={onAdminClick}
            className="md:hidden pointer-events-auto p-2 bg-white/80 backdrop-blur rounded-full text-gray-400 hover:text-black border border-gray-200 shadow-sm"
          >
            <Lock size={16} />
          </button>
      </div>

      {/* Mode Switcher (Centered & Responsive) */}
      <div className="absolute left-0 w-full flex justify-center z-40 pointer-events-none top-20 md:top-8">
         <div className="bg-white/90 backdrop-blur border border-gray-200 p-1 rounded-full shadow-lg pointer-events-auto flex gap-1">
            <button 
                onClick={() => setMode('campus')}
                className={`px-4 py-2 md:py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${mode === 'campus' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-black'}`}
            >
                Campus
            </button>
            <button 
                onClick={() => setMode('faculty')}
                className={`px-4 py-2 md:py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${mode === 'faculty' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-black'}`}
            >
                Faculty
            </button>
         </div>
      </div>

      {/* Desktop Karma Display */}
      <div className="hidden md:flex absolute top-8 right-8 z-50 items-center gap-2 bg-white/80 backdrop-blur border border-gray-200 px-4 py-2 rounded-full shadow-sm">
        <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Karma Points</span>
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        <Award size={16} className="text-amber-500" />
        <span className="text-sm font-bold text-black">{karma}</span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full overflow-hidden relative flex flex-col">
        
        {mode === 'faculty' ? (
             <div className="w-full h-full pt-32 md:pt-32">
                 <FacultyTracker professors={professors} />
             </div>
        ) : (
            /* Existing Campus View */
            <div className="relative w-full max-w-6xl mx-auto min-h-full flex flex-col md:flex-row pt-32 md:pt-32 md:pb-32">
            
            {/* List Column */}
            <div className="flex flex-col w-full md:w-1/2 px-6 md:px-0 overflow-y-auto no-scrollbar pb-32 md:pb-0">
                {locations.map((item) => (
                <div 
                    key={item.id}
                    onMouseEnter={() => handleInteraction(item.id)}
                    onClick={() => handleInteraction(item.id)}
                    className={`
                    cursor-pointer py-4 md:py-6 flex items-center justify-between group transition-all duration-300
                    border-b border-gray-100 md:border-none last:border-0
                    `}
                >
                    <div className="flex items-center gap-4">
                        {/* Mobile Only Color Indicator */}
                        <div className={`md:hidden w-2 h-12 rounded-full transition-all duration-300 ${activeId === item.id ? 'scale-y-110' : 'scale-y-75 opacity-50'}`} style={{ backgroundColor: item.color }} />
                        
                        <span className={`
                        text-xl md:text-4xl font-medium tracking-tight transition-colors duration-200
                        ${activeId === item.id ? 'text-black md:translate-x-2' : 'text-gray-300 group-hover:text-gray-400'}
                        `}>
                        {item.name}
                        </span>
                    </div>
                    
                    {/* Desktop Status Text */}
                    <span className="hidden md:block text-xs font-mono uppercase text-gray-300 group-hover:text-gray-500">
                        {item.status}
                    </span>
                    
                    {/* Mobile Status Dot */}
                    <div className="md:hidden">
                        {activeId === item.id && <span className="text-[10px] font-bold uppercase bg-gray-100 px-2 py-1 rounded">{item.status}</span>}
                    </div>
                </div>
                ))}
            </div>

            {/* Right Column: Details (Desktop Only) */}
            <div className="hidden md:flex w-1/2 pl-12 flex-col relative h-[600px]">
                <div className="relative w-full h-full">
                    {/* Floating Details Card */}
                    <div className="w-full bg-white border border-gray-200 shadow-2xl p-8 relative overflow-hidden group transition-all duration-300">
                        {/* Queue-Cam Header Action */}
                        <div className="absolute top-0 right-0 p-4">
                                <input 
                                type="file" 
                                accept="image/*" 
                                capture="environment" 
                                ref={fileInputRef} 
                                className="hidden"
                                onChange={handleFileChange}
                                />
                                <button 
                                onClick={handleCameraClick}
                                disabled={analyzing}
                                className={`
                                    flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all
                                    ${analyzing ? 'bg-gray-100 text-gray-400 cursor-wait' : 'bg-black text-white hover:scale-105 shadow-lg'}
                                `}
                                >
                                {analyzing ? (
                                    <>Processing...</>
                                ) : (
                                    <><Camera size={14} /> Queue-Cam</>
                                )}
                                </button>
                        </div>

                        <div className="absolute top-0 left-0 w-1 h-full transition-colors duration-500" style={{ backgroundColor: activeItem.color }}></div>
                        
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gray-50 rounded-full text-black">{activeItem.icon}</div>
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">{activeItem.status}</h3>
                                <h2 className="text-2xl font-bold text-black">{activeItem.name}</h2>
                            </div>
                        </div>
                        
                        <div className="mb-8">
                                <p className="text-3xl font-medium leading-tight text-black mb-2">{activeItem.description}</p>
                                <p className="text-lg text-gray-500 font-mono">{activeItem.details}</p>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-4 border-b border-gray-100 mb-4">
                            <button onClick={() => setTab('feed')} className={`pb-2 text-[10px] font-bold uppercase tracking-widest ${tab === 'feed' ? 'text-black border-b-2 border-black' : 'text-gray-400'}`}>Live Feed</button>
                            <button onClick={() => setTab('beacon')} className={`pb-2 text-[10px] font-bold uppercase tracking-widest ${tab === 'beacon' ? 'text-amber-600 border-b-2 border-amber-500' : 'text-gray-400'}`}>Beacon</button>
                        </div>

                        <div className="h-48">
                            {tab === 'feed' ? (
                                <LiveCrowdFeed updates={activeItem.liveUpdates} onPost={(a, m) => onPostUpdate(activeItem.id, a, m)} />
                            ) : (
                                <BeaconSystem 
                                    requests={activeRequests} 
                                    onRequest={(item) => onBeaconRequest(activeItem.id, item, "You")} 
                                    onFulfill={(reqId) => onBeaconFulfill(reqId, activeItem.id)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            </div>
        )}
      </div>

      {/* Mobile Bottom Sheet (Only visible in Campus Mode) */}
      <div className={`
        md:hidden fixed bottom-0 left-0 w-full z-40 transition-transform duration-500 ease-in-out transform flex flex-col max-h-[85vh]
        ${activeId && mode === 'campus' ? 'translate-y-0' : 'translate-y-full'}
      `}>
          <div className="bg-white border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 pb-8 rounded-t-3xl">
            {/* Handle Bar */}
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6" onClick={() => setActiveId('')}></div>

            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeItem.color }}></span>
                    <span className="text-xs font-bold uppercase tracking-wide text-gray-500">{activeItem.status}</span>
                </div>
                 
                {/* Mobile Queue Cam */}
                <button 
                    onClick={handleCameraClick}
                    disabled={analyzing}
                    className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full"
                >
                    <Camera size={14} className={analyzing ? "animate-spin" : ""} />
                    <span className="text-[10px] font-bold uppercase">{analyzing ? 'AI Scanning' : 'Update'}</span>
                </button>
            </div>
            
            <h2 className="text-2xl font-bold leading-tight mb-1 text-black pr-8">{activeItem.name}</h2>
            <p className="text-base text-black font-medium mb-1">{activeItem.description}</p>
            <p className="text-sm text-gray-500 mb-6">{activeItem.details}</p>
            
            {/* Tabs Mobile */}
            <div className="flex gap-4 border-b border-gray-100 mb-4">
                <button onClick={() => setTab('feed')} className={`pb-2 text-[10px] font-bold uppercase tracking-widest ${tab === 'feed' ? 'text-black border-b-2 border-black' : 'text-gray-400'}`}>Live Feed</button>
                <button onClick={() => setTab('beacon')} className={`pb-2 text-[10px] font-bold uppercase tracking-widest ${tab === 'beacon' ? 'text-amber-600 border-b-2 border-amber-500' : 'text-gray-400'}`}>Beacon (Help)</button>
            </div>

            <div className="min-h-[200px]">
                 {tab === 'feed' ? (
                    <LiveCrowdFeed updates={activeItem.liveUpdates} onPost={(a, m) => onPostUpdate(activeItem.id, a, m)} />
                ) : (
                    <BeaconSystem 
                        requests={activeRequests} 
                        onRequest={(item) => onBeaconRequest(activeItem.id, item, "Mobile User")} 
                        onFulfill={(reqId) => onBeaconFulfill(reqId, activeItem.id)}
                    />
                )}
            </div>
          </div>
      </div>

      {/* Admin Toggle Button (Desktop Only) */}
      <button 
        onClick={onAdminClick}
        className="fixed bottom-6 right-6 z-50 p-3 bg-black text-white rounded-full shadow-lg hover:scale-110 transition-transform md:block hidden opacity-20 hover:opacity-100"
        title="Admin Panel"
      >
        <Lock size={16} />
      </button>

    </div>
  );
};

export default GlimpseDashboard;