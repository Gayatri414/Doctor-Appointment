import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 50,
      scale: 0.98
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      y: -50,
      scale: 1.02
    }
  };

  const pageTransition = {
    type: "tween",
    ease: [0.6, -0.05, 0.01, 0.99],
    duration: 0.6
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Slide transition variant
export const SlidePageTransition = ({ children, direction = "right" }) => {
  const location = useLocation();

  const slideVariants = {
    initial: {
      opacity: 0,
      x: direction === "right" ? 100 : -100
    },
    in: {
      opacity: 1,
      x: 0
    },
    out: {
      opacity: 0,
      x: direction === "right" ? -100 : 100
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={slideVariants}
        transition={{
          type: "tween",
          ease: [0.6, -0.05, 0.01, 0.99],
          duration: 0.5
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Fade transition variant
export const FadePageTransition = ({ children }) => {
  const location = useLocation();

  const fadeVariants = {
    initial: {
      opacity: 0
    },
    in: {
      opacity: 1
    },
    out: {
      opacity: 0
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={fadeVariants}
        transition={{
          duration: 0.4,
          ease: "easeInOut"
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Scale transition variant
export const ScalePageTransition = ({ children }) => {
  const location = useLocation();

  const scaleVariants = {
    initial: {
      opacity: 0,
      scale: 0.9
    },
    in: {
      opacity: 1,
      scale: 1
    },
    out: {
      opacity: 0,
      scale: 1.1
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={scaleVariants}
        transition={{
          type: "tween",
          ease: [0.6, -0.05, 0.01, 0.99],
          duration: 0.5
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Route-specific transitions
export const RouteTransition = ({ children }) => {
  const location = useLocation();
  
  // Different transitions for different routes
  const getTransitionType = (pathname) => {
    if (pathname.includes('/doctors')) return 'slide';
    if (pathname.includes('/appointment')) return 'scale';
    if (pathname.includes('/login')) return 'fade';
    return 'default';
  };

  const transitionType = getTransitionType(location.pathname);

  const variants = {
    default: {
      initial: { opacity: 0, y: 50 },
      in: { opacity: 1, y: 0 },
      out: { opacity: 0, y: -50 }
    },
    slide: {
      initial: { opacity: 0, x: 100 },
      in: { opacity: 1, x: 0 },
      out: { opacity: 0, x: -100 }
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      in: { opacity: 1, scale: 1 },
      out: { opacity: 0, scale: 1.1 }
    },
    fade: {
      initial: { opacity: 0 },
      in: { opacity: 1 },
      out: { opacity: 0 }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={variants[transitionType]}
        transition={{
          type: "tween",
          ease: [0.6, -0.05, 0.01, 0.99],
          duration: 0.6
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;