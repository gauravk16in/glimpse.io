import React, { useState } from 'react';
import { Professor } from '../types';
import { User, MapPin, Clock, Search, BookOpen, UserCheck, Coffee } from 'lucide-react';

interface FacultyTrackerProps {
  professors: Professor[];
}

const FacultyTracker: React.FC<FacultyTrackerProps> = ({ professors }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProfs = professors.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Professor['status']) => {
    switch (status) {
        case 'Available': return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]';
        case 'In Class': return 'bg-amber-500';
        case 'Busy': return 'bg-red-500';
        default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: Professor['status']) => {
    switch (status) {
        case 'Available': return <UserCheck size={14} className="text-emerald-600" />;
        case 'In Class': return <BookOpen size={14} className="text-amber-600" />;
        case 'Busy': return <User size={14} className="text-red-600" />;
        default: return <Coffee size={14} className="text-gray-500" />;
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto no-scrollbar pb-32">
        <div className="max-w-4xl mx-auto px-6 md:px-0">
            
            {/* Header / Search */}
            <div className="mb-6 md:mb-8 pt-4">
                <h2 className="text-2xl font-bold tracking-tight mb-2">Faculty Tracker</h2>
                <p className="text-sm text-gray-500 mb-6 max-w-md">Real-time availability for doubt solving & meetings. Check before you walk.</p>
                
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search professor or department..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-black focus:bg-white transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-12">
                {filteredProfs.map(prof => (
                    <div 
                        key={prof.id} 
                        className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group active:scale-[0.99] duration-150"
                    >
                        {/* Status Bar Indicator */}
                        <div className={`absolute top-0 left-0 w-1 h-full ${getStatusColor(prof.status).split(' ')[0]}`} />

                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-lg leading-tight">{prof.name}</h3>
                                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mt-1">{prof.department}</p>
                            </div>
                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-50 border border-gray-100`}>
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(prof.status)} ${prof.status === 'Available' ? 'animate-pulse' : ''}`} />
                                <span className="text-[10px] font-bold uppercase text-gray-600">{prof.status}</span>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 mb-2 text-gray-700">
                            <MapPin size={14} className="text-gray-400" />
                            <span className="text-sm font-medium">{prof.location}</span>
                        </div>

                        {/* Note / Availability */}
                        <div className="mt-4 pt-3 border-t border-gray-50 flex items-start gap-2">
                             <div className="mt-0.5">{getStatusIcon(prof.status)}</div>
                             <div className="text-xs leading-relaxed">
                                {prof.status === 'Available' ? (
                                    <span className="text-emerald-700 font-medium">
                                        {prof.note || "Available for doubts."}
                                    </span>
                                ) : prof.status === 'In Class' ? (
                                    <span className="text-amber-700">
                                        Currently teaching. <span className="font-bold block md:inline">Available at {prof.availabilityTime}</span>
                                    </span>
                                ) : (
                                    <span className="text-gray-500">
                                        Unavailable. {prof.availabilityTime && `Back at ${prof.availabilityTime}`}
                                    </span>
                                )}
                             </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProfs.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    <p>No faculty members found.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default FacultyTracker;