import React, { useState } from 'react';
import { Clock, Lock, Users, MapPin, AlertCircle, Coffee, BookOpen, Activity, Monitor } from 'lucide-react';
import { LocationStatus } from '../types';

interface ConceptGeneratorProps {
    locations: LocationStatus[];
    onAdminClick: () => void;
}

const GlimpseDashboard: React.FC<ConceptGeneratorProps> = ({ locations, onAdminClick }) => {
  const [activeId, setActiveId] = useState<string>('1');

  // Handle click for mobile, hover for desktop
  const handleInteraction = (id: string) => {
    setActiveId(id);
  };

  const activeItem = locations.find(l => l.id === activeId) || locations[0];

  return (
    <div className="relative w-full h-screen bg-white text-black overflow-hidden font-sans select-none flex flex-col">
      
      {/* Header / Logo */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-50 flex items-center gap-2">
        <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-bold tracking-tighter">
            IO
        </div>
        <span className="font-mono text-sm tracking-widest uppercase hidden md:block opacity-50">Glimpse Campus</span>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 w-full overflow-y-auto no-scrollbar relative">
        
        {/* Container */}
        <div className="relative w-full max-w-5xl mx-auto min-h-full flex flex-row pt-24 pb-48 md:pt-32 md:pb-32">
          
          {/* Left Column: List */}
          <div className="flex flex-col w-full md:w-1/2 px-6 md:px-0">
            {locations.map((item) => (
              <div 
                key={item.id}
                onMouseEnter={() => handleInteraction(item.id)}
                onClick={() => handleInteraction(item.id)}
                className={`
                  cursor-pointer py-4 md:py-6 flex items-center justify-between group transition-all duration-300
                  border-b border-gray-100 md:border-none
                `}
                style={{ height: 'auto', minHeight: '80px' }} 
              >
                <span className={`
                  text-2xl md:text-4xl font-medium tracking-tight transition-colors duration-200
                  ${activeId === item.id ? 'text-black translate-x-2' : 'text-gray-300 group-hover:text-gray-400'}
                `}>
                  {item.name}
                </span>
                
                {/* Mobile Status Indicator (Dot) */}
                <div 
                    className={`md:hidden w-3 h-3 rounded-full transition-opacity duration-300 ${activeId === item.id ? 'opacity-100' : 'opacity-0'}`}
                    style={{ backgroundColor: item.color }}
                />
              </div>
            ))}
          </div>

          {/* Right Column: Color Blocks (Desktop Only Visuals) */}
          <div className="hidden md:flex w-1/2 flex-col items-end relative pointer-events-none">
            
            {/* The Stack of Blocks */}
            <div className="flex flex-col absolute right-0 top-10">
               {locations.map((item) => (
                 <div 
                    key={item.id}
                    className="w-24 lg:w-32 transition-all duration-300"
                    style={{ 
                        height: '80px', 
                        backgroundColor: item.color,
                        opacity: activeId === item.id ? 1 : 0.8,
                        transform: activeId === item.id ? 'scaleX(1.1)' : 'scaleX(1)',
                        transformOrigin: 'right'
                    }}
                 />
               ))}
            </div>

            {/* Floating Details Box (Desktop) */}
            {locations.map((item, index) => (
               <div 
                 key={`detail-${item.id}`}
                 className={`absolute right-24 lg:right-32 transition-all duration-500 ease-out flex flex-col items-start z-10
                   ${activeId === item.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}
                 `}
                 // 80px is block height + top offset matching the list somewhat
                 style={{ top: (index * 80) + 40 }} 
               >
                 <div className="bg-gray-100 text-black px-3 py-1 text-xs font-bold uppercase tracking-wide w-fit flex items-center gap-2 mb-2 shadow-sm">
                    <span className={`w-2 h-2 rounded-full ${item.status === 'Open' ? 'animate-pulse' : ''}`} style={{ backgroundColor: item.color }}></span>
                    {item.status}
                 </div>
                 
                 <div className="bg-white/90 backdrop-blur-md border border-gray-200 p-6 w-72 lg:w-96 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: item.color }}></div>
                    
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">{item.details}</h3>
                        <div className="text-gray-400">{item.icon}</div>
                    </div>
                    
                    <p className="text-2xl md:text-3xl leading-tight font-medium text-black">
                        {item.description}
                    </p>
                    
                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 font-mono uppercase">
                        <Clock size={12} />
                        Updated 2m ago
                    </div>
                 </div>
               </div>
            ))}
          </div>

        </div>
      </div>

      {/* Mobile Bottom Sheet Detail View */}
      <div className={`
        md:hidden fixed bottom-0 left-0 w-full z-40 transition-transform duration-500 ease-in-out transform
        ${activeId ? 'translate-y-0' : 'translate-y-full'}
      `}>
          <div className="bg-white border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 pb-10">
            <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeItem.color }}></span>
                <span className="text-xs font-bold uppercase tracking-wide text-gray-500">{activeItem.status} • {activeItem.name}</span>
            </div>
            
            <h2 className="text-3xl font-medium leading-tight mb-2 text-black">{activeItem.description}</h2>
            <p className="text-lg text-gray-500 mb-4">{activeItem.details}</p>
            
            <div className="flex items-center justify-between text-xs text-gray-400 font-mono border-t pt-4 border-gray-100">
                <span className="flex items-center gap-1"><Clock size={12}/> LIVE UPDATE</span>
                <span>GLIMPSE.IO</span>
            </div>
          </div>
      </div>

      {/* Footer Elements */}
      <div className="fixed bottom-6 right-6 md:right-auto md:left-6 text-gray-400 text-[10px] md:text-xs font-medium tracking-widest pointer-events-none uppercase z-50">
        Real-time Campus Intelligence
      </div>
      
      {/* Admin Toggle Button */}
      <button 
        onClick={onAdminClick}
        className="fixed bottom-24 right-6 z-50 p-3 bg-black text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform opacity-30 hover:opacity-100 md:bottom-6 md:opacity-20"
        title="Admin Panel"
      >
        <Lock size={16} />
      </button>

    </div>
  );
};

export default GlimpseDashboard;