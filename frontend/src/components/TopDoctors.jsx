import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import AnimatedSection from "./animations/AnimatedSection";
import GlowCard from "./animations/GlowCard";
import AnimatedButton from "./animations/AnimatedButton";

const TopDoctors = () => {

    const navigate=useNavigate();
    const {doctors}=useContext(AppContext)
  return (
    <div className="flex flex-col items-center gap-8 my-20 relative">

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-900/5 to-transparent" />

      {/* Heading */}
      <AnimatedSection animation="fadeInUp" className="text-center relative z-10">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">
            Top Doctors to Book
          </span>
        </motion.h1>

        <motion.p 
          className="text-gray-400 text-center max-w-2xl mx-auto text-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Simply browse through our extensive list of <span className="text-orange-400">trusted doctors</span>
        </motion.p>
      </AnimatedSection>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full max-w-7xl mx-auto px-6 relative z-10">

        {doctors.slice(0, 10).map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              ease: [0.6, -0.05, 0.01, 0.99]
            }}
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              window.scrollTo(0, 0);
            }}
          >
            <GlowCard className="overflow-hidden cursor-pointer bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 group">

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
                  className="font-bold text-lg text-white group-hover:text-orange-400 transition-colors duration-300 mb-1"
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
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              </div>
            </GlowCard>
          </motion.div>
        ))}

      </div>

      {/* Button */}
      <AnimatedSection animation="fadeInUp" delay={0.6} className="relative z-10">
        <AnimatedButton
          onClick={() => {
            navigate('/doctors');
            window.scrollTo(0, 0);
          }}
          variant="secondary"
          size="lg"
          className="mt-8"
        >
          View All Doctors
        </AnimatedButton>
      </AnimatedSection>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-20 left-20 w-3 h-3 bg-orange-500/40 rounded-full blur-sm"
        animate={{
          scale: [1, 1.8, 1],
          opacity: [0.4, 0.9, 0.4]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-5 h-5 bg-blue-500/40 rounded-full blur-sm"
        animate={{
          scale: [1.5, 1, 1.5],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

    </div>
  );
};

export default TopDoctors;