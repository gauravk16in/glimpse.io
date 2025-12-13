import React, { useState, useMemo } from 'react';
import { Teacher } from '../types';
import { 
  Search, 
  MapPin, 
  Clock, 
  Mail, 
  Phone, 
  ChevronRight, 
  X, 
  User,
  Building,
  BookOpen,
  Filter,
  ArrowLeft
} from 'lucide-react';

interface TeacherFinderProps {
  teachers: Teacher[];
  onBack: () => void;
}

const TeacherFinder: React.FC<TeacherFinderProps> = ({ teachers, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique departments
  const departments = useMemo(() => {
    const depts = ['All', ...new Set(teachers.map(t => t.department))];
    return depts;
  }, [teachers]);

  // Filter teachers
  const filteredTeachers = useMemo(() => {
    return teachers.filter(teacher => {
      const matchesSearch = 
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.room.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDepartment = selectedDepartment === 'All' || teacher.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'All' || teacher.status === selectedStatus;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [teachers, searchQuery, selectedDepartment, selectedStatus]);

  // Status color mapping
  const getStatusColor = (status: Teacher['status']) => {
    switch (status) {
      case 'Available': return 'bg-emerald-500';
      case 'In Class': return 'bg-amber-500';
      case 'Meeting': return 'bg-blue-500';
      case 'Away': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusBgColor = (status: Teacher['status']) => {
    switch (status) {
      case 'Available': return 'bg-emerald-500/10 text-emerald-600';
      case 'In Class': return 'bg-amber-500/10 text-amber-600';
      case 'Meeting': return 'bg-blue-500/10 text-blue-600';
      case 'Away': return 'bg-gray-500/10 text-gray-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-white text-black font-sans">
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={onBack}
              className="p-2 -ml-2 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">Find Your Teacher</h1>
              <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">Doubt Clearing Sessions</p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, subject, or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all"
            />
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${showFilters ? 'bg-black text-white' : 'hover:bg-gray-200 text-gray-500'}`}
            >
              <Filter size={16} />
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
                ))}
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
              >
                <option value="All">All Status</option>
                <option value="Available">Available</option>
                <option value="In Class">In Class</option>
                <option value="Meeting">Meeting</option>
                <option value="Away">Away</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Teacher List */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 pb-24">
        
        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">
            {filteredTeachers.length} Teacher{filteredTeachers.length !== 1 ? 's' : ''} Found
          </p>
          {filteredTeachers.filter(t => t.status === 'Available').length > 0 && (
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {filteredTeachers.filter(t => t.status === 'Available').length} Available Now
            </span>
          )}
        </div>

        {/* Teacher Cards */}
        <div className="space-y-3">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              onClick={() => setSelectedTeacher(teacher)}
              className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-lg active:scale-[0.99] transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 overflow-hidden">
                    {teacher.profileImage ? (
                      <img src={teacher.profileImage} alt={teacher.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(teacher.status)}`} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-black transition-colors">
                        {teacher.name}
                      </h3>
                      <p className="text-sm text-gray-500">{teacher.subject}</p>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBgColor(teacher.status)}`}>
                      {teacher.status}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                      <MapPin size={12} />
                      {teacher.room}, {teacher.floor}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredTeachers.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No teachers found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Teacher Detail Modal */}
      {selectedTeacher && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center animate-in fade-in duration-200"
          onClick={() => setSelectedTeacher(null)}
        >
          <div 
            className="w-full md:max-w-lg bg-white md:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
              <h2 className="font-bold text-lg">Teacher Details</h2>
              <button 
                onClick={() => setSelectedTeacher(null)}
                className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Profile Section */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 overflow-hidden">
                    {selectedTeacher.profileImage ? (
                      <img src={selectedTeacher.profileImage} alt={selectedTeacher.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={32} />
                    )}
                  </div>
                  <span className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white ${getStatusColor(selectedTeacher.status)}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedTeacher.name}</h3>
                  <p className="text-gray-500">{selectedTeacher.department}</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold mt-1 ${getStatusBgColor(selectedTeacher.status)}`}>
                    {selectedTeacher.status}
                  </span>
                </div>
              </div>

              {/* Info Cards */}
              <div className="space-y-3">
                {/* Subject */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <BookOpen size={18} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Subject</p>
                    <p className="font-medium">{selectedTeacher.subject}</p>
                  </div>
                </div>

                {/* Room Location */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <MapPin size={18} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Room Location</p>
                    <p className="font-medium">{selectedTeacher.room}, {selectedTeacher.floor}</p>
                  </div>
                </div>

                {/* Building */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Building size={18} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Building</p>
                    <p className="font-medium">{selectedTeacher.floor}</p>
                  </div>
                </div>

                {/* Available Slots */}
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Clock size={18} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Available Slots for Doubts</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 ml-13">
                    {selectedTeacher.availableSlots.map((slot, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium"
                      >
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="mt-6 space-y-2">
                <a 
                  href={`mailto:${selectedTeacher.email}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 active:bg-gray-900 transition-colors"
                >
                  <Mail size={18} />
                  Send Email
                </a>
                {selectedTeacher.phone && (
                  <a 
                    href={`tel:${selectedTeacher.phone}`}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 text-black rounded-xl font-medium hover:bg-gray-200 active:bg-gray-300 transition-colors"
                  >
                    <Phone size={18} />
                    Call
                  </a>
                )}
              </div>

              {/* Availability Note */}
              {selectedTeacher.status === 'Available' && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <p className="text-sm text-emerald-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Teacher is currently available for doubt clearing
                  </p>
                </div>
              )}

              {selectedTeacher.status === 'In Class' && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm text-amber-700">
                    Teacher is currently in class. Please visit during available slots.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherFinder;
