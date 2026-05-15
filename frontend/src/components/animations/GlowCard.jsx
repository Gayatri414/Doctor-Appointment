import React from 'react';
import { motion } from 'framer-motion';

const GlowCard = ({ 
  children, 
  className = "", 
  glowColor = "blue",
  intensity = "medium" 
}) => {
  const glowColors = {
    blue: "rgba(59, 130, 246, 0.3)",
    orange: "rgba(251, 146, 60, 0.3)",
    purple: "rgba(147, 51, 234, 0.3)",
    green: "rgba(34, 197, 94, 0.3)"
  };

  const intensities = {
    low: "0 0 20px",
    medium: "0 0 40px",
    high: "0 0 60px"
  };

  return (
    <motion.div
      className={`relative group ${className}`}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glow effect */}
      <div 
        className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-orange-600 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"
        style={{
          filter: `blur(20px)`,
          background: `linear-gradient(45deg, ${glowColors[glowColor]}, ${glowColors.orange})`
        }}
      />
      
      {/* Card content */}
      <div className={`relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg ${className}`}>
        {children}
      </div>
    </motion.div>
  );
};

export default GlowCard;