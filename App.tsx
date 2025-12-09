import React, { useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import ConceptGenerator from './components/ConceptGenerator';
import AdminPanel from './components/AdminPanel';
import { LocationStatus } from './types';
import { Clock, Users, MapPin, AlertCircle, Coffee, BookOpen, Activity, Monitor, Lock, ArrowRight } from 'lucide-react';

// Initial Data
const INITIAL_LOCATIONS: LocationStatus[] = [
  { 
    id: '1', 
    name: 'Library', 
    status: 'Open', 
    description: 'Silent zone available', 
    details: '45% Capacity', 
    color: '#059669', // Emerald
    icon: <BookOpen size={20} />
  },
  { 
    id: '2', 
    name: 'Food Court', 
    status: 'Busy', 
    description: 'Fresh Pasta & Salad Bar', 
    details: 'High Traffic • 15min wait', 
    color: '#EA580C', // Orange
    icon: <Coffee size={20} />
  },
  { 
    id: '3', 
    name: 'Badminton Court', 
    status: 'Open', 
    description: 'Court 3 & 4 Free', 
    details: 'Book via App', 
    color: '#0EA5E9', // Sky Blue
    icon: <Activity size={20} />
  },
  { 
    id: '4', 
    name: 'Comp Lab A', 
    status: 'Maintenance', 
    description: 'System Upgrades', 
    details: 'Closed until 2 PM', 
    color: '#DC2626', // Red
    icon: <Monitor size={20} />
  },
  { 
    id: '5', 
    name: 'Auditorium', 
    status: 'Closed', 
    description: 'Event Setup: Tech Talk', 
    details: 'Opens at 5 PM', 
    color: '#7C3AED', // Violet
    icon: <Users size={20} />
  },
  { 
    id: '6', 
    name: 'Health Centre', 
    status: 'Open', 
    description: 'General Physician Available', 
    details: 'Walk-ins Welcome', 
    color: '#BE123C', // Rose
    icon: <Activity size={20} />
  },
  { 
    id: '7', 
    name: 'Chemistry Lab', 
    status: 'Busy', 
    description: 'Practical Session in progress', 
    details: 'Restricted Access', 
    color: '#4338CA', // Indigo
    icon: <AlertCircle size={20} />
  },
  { 
    id: '8', 
    name: 'Parking Lot B', 
    status: 'Open', 
    description: 'Spaces available near Block C', 
    details: '120/200 Slots Free', 
    color: '#64748B', // Slate
    icon: <MapPin size={20} />
  },
    { 
    id: '9', 
    name: 'Gymnasium', 
    status: 'Open', 
    description: 'Cardio section free', 
    details: 'Low Occupancy', 
    color: '#0D9488', // Teal
    icon: <Activity size={20} />
  },
];

const App: React.FC = () => {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [view, setView] = useState<'student' | 'login' | 'admin'>('student');
  const [locations, setLocations] = useState<LocationStatus[]>(INITIAL_LOCATIONS);
  
  // Login State
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const handleUpdateLocation = (id: string, updates: Partial<LocationStatus>) => {
    setLocations(prev => prev.map(loc => 
      loc.id === id ? { ...loc, ...updates } : loc
    ));
  };

  const handleLoginAttempt = () => {
    if (password === 'root@123') {
        setView('admin');
        setLoginError(false);
        setPassword('');
    } else {
        setLoginError(true);
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      {!loadingComplete && (
        <LoadingScreen onComplete={() => setLoadingComplete(true)} />
      )}
      
      {loadingComplete && (
        <>
          {view === 'student' && (
            <ConceptGenerator 
              locations={locations} 
              onAdminClick={() => {
                  setView('login');
                  setLoginError(false);
                  setPassword('');
              }} 
            />
          )}

          {view === 'login' && (
            <div className="fixed inset-0 z-[60] bg-[#0a0a0a] flex items-center justify-center text-white">
                <div className="w-full max-w-xs p-6 animate-in fade-in zoom-in duration-300">
                    <div className="mb-10 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-4 border border-white/10">
                            <Lock size={18} className="text-gray-400" />
                        </div>
                        <h2 className="text-[10px] font-mono tracking-[0.3em] text-gray-500 uppercase">Secure Environment</h2>
                    </div>

                    <div className="relative group">
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setLoginError(false);
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && handleLoginAttempt()}
                            autoFocus
                            placeholder="PASSWORD"
                            className={`
                                w-full bg-transparent border-b py-3 text-center font-mono text-xl focus:outline-none transition-all placeholder-gray-800 tracking-widest
                                ${loginError ? 'border-red-500 text-red-500' : 'border-gray-800 focus:border-white text-white'}
                            `}
                        />
                         <button 
                            onClick={handleLoginAttempt}
                            className="absolute right-0 top-3 text-gray-600 hover:text-white transition-colors"
                        >
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    <div className="h-6 mt-4 flex items-center justify-center">
                        {loginError && (
                            <span className="text-red-500 text-[10px] font-mono uppercase tracking-widest">
                                Incorrect Credentials
                            </span>
                        )}
                    </div>

                    <button 
                        onClick={() => setView('student')}
                        className="mt-12 w-full text-center text-[10px] text-gray-600 hover:text-gray-400 font-mono uppercase tracking-widest transition-colors"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
          )}

          {view === 'admin' && (
            <AdminPanel 
              locations={locations} 
              onUpdateLocation={handleUpdateLocation}
              onExit={() => setView('student')}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;