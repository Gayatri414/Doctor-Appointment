import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const AnimatedSection = ({ 
  children, 
  className = "", 
  animation = "fadeInUp",
  delay = 0,
  duration = 0.6 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const animations = {
    fadeInUp: {
      initial: { opacity: 0, y: 60 },
      animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }
    },
    fadeInLeft: {
      initial: { opacity: 0, x: -60 },
      animate: isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }
    },
    fadeInRight: {
      initial: { opacity: 0, x: 60 },
      animate: isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.8 },
      animate: isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
    },
    slideUp: {
      initial: { opacity: 0, y: 100 },
      animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={animations[animation].initial}
      animate={animations[animation].animate}
      transition={{
        duration,
        delay,
        ease: [0.6, -0.05, 0.01, 0.99]
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;