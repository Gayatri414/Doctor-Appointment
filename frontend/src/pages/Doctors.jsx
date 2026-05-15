import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedSection from "../components/animations/AnimatedSection";
import GlowCard from "../components/animations/GlowCard";

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext);

  const specialities = [
    "General physician",
    "Gynecologist", 
    "Dermatologist",
    "Pediatrician",
    "Gastroenterologist",
    "Neurologist"
  ];

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(
        doctors.filter(
          (doc) =>
            doc.speciality.toLowerCase().trim() ===
            decodeURIComponent(speciality).toLowerCase().trim()
        )
      );
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div className="py-20 px-6 md:px-16 text-white relative">

      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Header */}
      <AnimatedSection animation="fadeInUp" className="text-center mb-12 relative z-10">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-white">Find </span>
          <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">Doctors</span>
        </motion.h1>
        <p className="text-gray-400 text-lg">
          Browse through our specialists and book your appointment today.
        </p>
      </AnimatedSection>

      <div className="flex flex-col lg:flex-row items-start gap-8 relative z-10">

        {/* LEFT SIDE - Filters */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <AnimatedSection animation="fadeInLeft">
            <GlowCard className="p-6 bg-gray-800/30 backdrop-blur-xl border border-gray-700/50">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">🏥</span>
                </div>
                Specialities
              </h3>
              
              <div className="space-y-3">
                {specialities.map((spec, index) => (
                  <motion.button
                    key={spec}
                    onClick={() =>
                      speciality === spec
                        ? navigate("/doctors")
                        : navigate(`/doctors/${spec}`)
                    }
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                      speciality === spec
                        ? "bg-gradient-to-r from-blue-600/20 to-blue-700/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10"
                        : "text-gray-300 hover:text-white hover:bg-gray-700/50 border border-gray-600/30"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        speciality === spec ? "bg-blue-500" : "bg-gray-600"
                      }`}></div>
                      <span className="font-medium">{spec}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Clear Filter */}
              {speciality && (
                <motion.button
                  onClick={() => navigate("/doctors")}
                  className="w-full mt-4 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors duration-200"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Clear Filter
                </motion.button>
              )}
            </GlowCard>
          </AnimatedSection>
        </div>

        {/* RIGHT SIDE - Doctors Grid */}
        <div className="flex-1">
          <AnimatedSection animation="fadeInRight">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filterDoc.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: [0.6, -0.05, 0.01, 0.99]
                  }}
                  onClick={() => navigate(`/appointment/${item._id}`)}
                >
                  <GlowCard className="overflow-hidden cursor-pointer bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group">
                    
                    {/* Doctor Image */}
                    <div className="relative overflow-hidden">
                      <motion.img
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        src={item.image}
                        alt={item.name}
                        whileHover={{ scale: 1.05 }}
                      />
                      
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Availability badge */}
                      <motion.div 
                        className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                      >
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                        Available
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      
                      {/* Name */}
                      <motion.h3 
                        className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors duration-300 mb-1"
                        whileHover={{ scale: 1.02 }}
                      >
                        {item.name}
                      </motion.h3>

                      {/* Speciality */}
                      <p className="text-gray-400 text-sm mb-3">
                        {item.speciality}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <motion.span
                              key={i}
                              className="text-yellow-400 text-sm"
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.7 + i * 0.1 }}
                            >
                              ★
                            </motion.span>
                          ))}
                        </div>
                        <span className="text-gray-400 text-xs">(4.9)</span>
                      </div>

                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>

            {/* No doctors found */}
            {filterDoc.length === 0 && (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Doctors Found</h3>
                <p className="text-gray-400">Try adjusting your search criteria or browse all doctors.</p>
                <motion.button
                  onClick={() => navigate("/doctors")}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View All Doctors
                </motion.button>
              </motion.div>
            )}
          </AnimatedSection>
        </div>

      </div>
    </div>
  );
};

export default Doctors;