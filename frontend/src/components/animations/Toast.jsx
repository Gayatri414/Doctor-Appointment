import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ 
  message, 
  type = "info", 
  duration = 4000, 
  onClose,
  position = "top-right" 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose && onClose(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: {
      bg: "bg-green-800/90",
      border: "border-green-600",
      icon: "✓",
      iconBg: "bg-green-600"
    },
    error: {
      bg: "bg-red-800/90",
      border: "border-red-600", 
      icon: "✕",
      iconBg: "bg-red-600"
    },
    warning: {
      bg: "bg-yellow-800/90",
      border: "border-yellow-600",
      icon: "⚠",
      iconBg: "bg-yellow-600"
    },
    info: {
      bg: "bg-blue-800/90",
      border: "border-blue-600",
      icon: "ℹ",
      iconBg: "bg-blue-600"
    }
  };

  const positions = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2"
  };

  const slideDirection = position.includes('right') ? 100 : position.includes('left') ? -100 : 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed ${positions[position]} z-100 max-w-sm w-full`}
          initial={{ 
            opacity: 0, 
            x: slideDirection,
            y: position.includes('bottom') ? 50 : -50,
            scale: 0.9
          }}
          animate={{ 
            opacity: 1, 
            x: 0,
            y: 0,
            scale: 1
          }}
          exit={{ 
            opacity: 0, 
            x: slideDirection,
            scale: 0.9
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        >
          <div className={`
            ${typeStyles[type].bg} ${typeStyles[type].border}
            backdrop-blur-xl border rounded-xl p-4 shadow-2xl
            flex items-start gap-3 relative overflow-hidden
          `}>
            
            {/* Background glow effect */}
            <div className={`absolute inset-0 ${typeStyles[type].iconBg}/10 blur-xl`} />
            
            {/* Icon */}
            <div className={`
              ${typeStyles[type].iconBg} 
              w-8 h-8 rounded-full flex items-center justify-center
              text-white font-bold text-sm flex-shrink-0 relative z-10
            `}>
              {typeStyles[type].icon}
            </div>

            {/* Content */}
            <div className="flex-1 relative z-10">
              <p className="text-white text-sm font-medium leading-relaxed">
                {message}
              </p>
            </div>

            {/* Close button */}
            <motion.button
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => onClose && onClose(), 300);
              }}
              className="text-gray-400 hover:text-white transition-colors duration-200 relative z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Progress bar */}
            <motion.div
              className={`absolute bottom-0 left-0 h-1 ${typeStyles[type].iconBg} rounded-full`}
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
            />

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Toast container for managing multiple toasts
export const ToastContainer = ({ toasts = [], removeToast }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-100">
      <AnimatePresence>
        {toasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            className="pointer-events-auto"
            initial={{ opacity: 0, y: -50 }}
            animate={{ 
              opacity: 1, 
              y: index * 80 + 20 // Stack toasts vertically
            }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'absolute', top: 0, right: 20 }}
          >
            <Toast
              {...toast}
              onClose={() => removeToast(toast.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success: (message, duration) => addToast(message, "success", duration),
    error: (message, duration) => addToast(message, "error", duration),
    warning: (message, duration) => addToast(message, "warning", duration),
    info: (message, duration) => addToast(message, "info", duration)
  };
};

export default Toast;