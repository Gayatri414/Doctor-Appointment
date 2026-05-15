import React, { useContext, useEffect, useState, useMemo, useCallback } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability, isLoadingDoctors } =
    useContext(AdminContext);
  
  // FIXED: Separate loading state for initial load vs context loading
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpeciality, setFilterSpeciality] = useState("All");

  // FIXED: Proper useEffect with stable dependencies - only runs once when aToken is available
  useEffect(() => {
    if (aToken && doctors.length === 0) {
      setInitialLoading(true);
      getAllDoctors().finally(() => setInitialLoading(false));
    } else if (aToken && doctors.length > 0) {
      setInitialLoading(false);
    }
  }, [aToken]); // FIXED: Remove getAllDoctors from dependencies to prevent infinite loop

  // FIXED: Memoize filtered doctors to prevent unnecessary recalculations
  const filteredDoctors = useMemo(() => {
    if (!doctors || doctors.length === 0) return [];
    
    return doctors.filter(doctor => {
      const matchesSearch = doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doctor.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpeciality = filterSpeciality === "All" || doctor.speciality === filterSpeciality;
      return matchesSearch && matchesSpeciality;
    });
  }, [doctors, searchTerm, filterSpeciality]);

  // FIXED: Memoize specialities to prevent recalculation on every render
  const specialities = useMemo(() => {
    if (!doctors || doctors.length === 0) return ["All"];
    return ["All", ...new Set(doctors.map(doc => doc.speciality).filter(Boolean))];
  }, [doctors]);

  // FIXED: Memoize search handler to prevent unnecessary re-renders
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // FIXED: Memoize filter handler to prevent unnecessary re-renders
  const handleFilterChange = useCallback((e) => {
    setFilterSpeciality(e.target.value);
  }, []);

  // FIXED: Memoize availability toggle to prevent re-renders
  const handleAvailabilityToggle = useCallback((docId) => {
    changeAvailability(docId);
  }, [changeAvailability]);

  // Show loading state
  if (initialLoading || isLoadingDoctors) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400">Loading doctors...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
          All Doctors
        </h1>
        <p className="text-gray-400">Manage doctor profiles and availability status.</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          
          {/* Search Input */}
          <div className="flex-1">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Search Doctors
            </label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors duration-200"
            />
          </div>

          {/* Speciality Filter */}
          <div className="md:w-64">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Filter by Speciality
            </label>
            <select
              value={filterSpeciality}
              onChange={handleFilterChange}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors duration-200"
            >
              {specialities.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* Stats */}
          <div className="md:w-48 flex flex-col justify-end">
            <div className="bg-purple-600/20 border border-purple-500/30 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-purple-400">{filteredDoctors.length}</div>
              <div className="text-xs text-gray-400">Total Doctors</div>
            </div>
          </div>

        </div>
      </div>

      {/* Doctors Grid - FIXED: Optimized rendering with stable layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredDoctors.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">👨‍⚕️</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {searchTerm || filterSpeciality !== "All" ? "No Doctors Found" : "No Doctors Available"}
            </h3>
            <p className="text-gray-400">
              {searchTerm || filterSpeciality !== "All" 
                ? "Try adjusting your search criteria." 
                : "Add doctors to see them listed here."}
            </p>
          </div>
        ) : (
          filteredDoctors.map((item) => (
            <DoctorCard 
              key={item._id} // FIXED: Use stable _id as key instead of index
              doctor={item}
              onAvailabilityToggle={handleAvailabilityToggle}
            />
          ))
        )}
      </div>

      {/* Summary Stats */}
      {filteredDoctors.length > 0 && (
        <SummaryStats 
          filteredDoctors={filteredDoctors}
          specialitiesCount={specialities.length - 1}
        />
      )}

    </div>
  );
};

// FIXED: Separate DoctorCard component to prevent unnecessary re-renders
const DoctorCard = React.memo(({ doctor, onAvailabilityToggle }) => {
  // FIXED: Memoize availability toggle handler for this specific doctor
  const handleToggle = useCallback(() => {
    onAvailabilityToggle(doctor._id);
  }, [doctor._id, onAvailabilityToggle]);

  return (
    <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">
      {/* Doctor Image - FIXED: Fixed dimensions to prevent layout shift */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-purple-500/10">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-full h-full object-cover"
          loading="lazy" // FIXED: Lazy loading for better performance
          style={{ 
            minHeight: '192px', // FIXED: Prevent layout shift during image load
            backgroundColor: '#374151' // FIXED: Placeholder background
          }}
        />

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`text-xs px-3 py-1.5 rounded-full font-medium backdrop-blur-sm border ${
              doctor.available
                ? "bg-green-500/90 text-white border-green-400/50"
                : "bg-red-500/90 text-white border-red-400/50"
            }`}
          >
            {doctor.available ? "Available" : "Unavailable"}
          </span>
        </div>

        {/* Speciality Badge */}
        <div className="absolute top-3 left-3">
          <span className="text-xs px-2 py-1 bg-purple-600/90 text-white rounded-full backdrop-blur-sm border border-purple-400/50">
            {doctor.speciality}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        
        {/* Doctor Info */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2">
            {doctor.name}
          </h3>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <span>📧</span>
              <span className="truncate">{doctor.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span>🎓</span>
              <span>{doctor.degree}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-700/30 rounded-lg p-3 text-center">
            <div className="text-sm font-medium text-blue-400">{doctor.experience}</div>
            <div className="text-xs text-gray-500">Experience</div>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3 text-center">
            <div className="text-sm font-medium text-green-400">${doctor.fees}</div>
            <div className="text-xs text-gray-500">Consultation</div>
          </div>
        </div>

        {/* About Preview */}
        {doctor.about && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 line-clamp-2">
              {doctor.about.length > 80 ? `${doctor.about.substring(0, 80)}...` : doctor.about}
            </p>
          </div>
        )}

        {/* Availability Toggle */}
        <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg mb-4">
          <span className="text-sm font-medium text-gray-300">
            Availability Status
          </span>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={doctor.available}
              onChange={handleToggle}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 px-3 py-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30 text-sm font-medium">
            View Profile
          </button>
          <button className="flex-1 px-3 py-2 bg-orange-600/20 text-orange-400 rounded-lg border border-orange-500/30 text-sm font-medium">
            Edit Details
          </button>
        </div>
      </div>
    </div>
  );
});

// FIXED: Separate SummaryStats component to prevent unnecessary re-renders
const SummaryStats = React.memo(({ filteredDoctors, specialitiesCount }) => {
  // FIXED: Memoize stats calculations
  const stats = useMemo(() => ({
    total: filteredDoctors.length,
    available: filteredDoctors.filter(d => d.available).length,
    unavailable: filteredDoctors.filter(d => !d.available).length,
    specialities: specialitiesCount
  }), [filteredDoctors, specialitiesCount]);

  return (
    <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 mt-8">
      <h3 className="text-lg font-bold text-white mb-4">Summary</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">
            {stats.total}
          </div>
          <div className="text-sm text-gray-400">Total Doctors</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">
            {stats.available}
          </div>
          <div className="text-sm text-gray-400">Available</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">
            {stats.unavailable}
          </div>
          <div className="text-sm text-gray-400">Unavailable</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {stats.specialities}
          </div>
          <div className="text-sm text-gray-400">Specialities</div>
        </div>
      </div>
    </div>
  );
});

export default DoctorsList;