import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ 
  size = "md", 
  color = "blue", 
  text = "Loading...",
  fullScreen = false 
}) => {
  
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10", 
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };

  const colors = {
    blue: "border-blue-500",
    orange: "border-orange-500",
    purple: "border-purple-500",
    green: "border-green-500"
  };

  const LoadingContent = () => (
    <div className="flex flex-col items-center gap-4">
      {/* Animated spinner */}
      <div className="relative">
        <motion.div
          className={`${sizes[size]} border-4 border-gray-700 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className={`absolute inset-0 ${sizes[size]} border-4 ${colors[color]} border-t-transparent rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Glow effect */}
        <motion.div
          className={`absolute inset-0 ${sizes[size]} ${colors[color].replace('border', 'bg')}/20 rounded-full blur-md`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Loading text */}
      {text && (
        <motion.p
          className="text-gray-400 text-sm font-medium"
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {text}
        </motion.p>
      )}

      {/* Animated dots */}
      <div className="flex gap-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 ${colors[color].replace('border', 'bg')} rounded-full`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div
        className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LoadingContent />
        </motion.div>
      </motion.div>
    );
  }

  return <LoadingContent />;
};

// Skeleton loader component
export const SkeletonLoader = ({ 
  lines = 3, 
  className = "",
  animated = true 
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          className="h-4 bg-gray-700 rounded-lg"
          style={{ width: `${Math.random() * 40 + 60}%` }}
          animate={animated ? {
            opacity: [0.5, 1, 0.5]
          } : {}}
          transition={animated ? {
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut"
          } : {}}
        />
      ))}
    </div>
  );
};

// Card skeleton loader
export const CardSkeleton = ({ className = "" }) => {
  return (
    <motion.div
      className={`bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 ${className}`}
      animate={{
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Image placeholder */}
      <div className="w-full h-48 bg-gray-700 rounded-lg mb-4" />
      
      {/* Title placeholder */}
      <div className="h-6 bg-gray-700 rounded-lg mb-2 w-3/4" />
      
      {/* Subtitle placeholder */}
      <div className="h-4 bg-gray-700 rounded-lg mb-4 w-1/2" />
      
      {/* Content placeholders */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-700 rounded-lg w-full" />
        <div className="h-3 bg-gray-700 rounded-lg w-5/6" />
        <div className="h-3 bg-gray-700 rounded-lg w-4/6" />
      </div>
    </motion.div>
  );
};

// Button loading state
export const ButtonLoader = ({ size = "sm" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <motion.div
      className={`${sizes[size]} border-2 border-white border-t-transparent rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};

export default LoadingSpinner;