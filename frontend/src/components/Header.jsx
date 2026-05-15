import React from 'react';
import { motion } from 'framer-motion';
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';
import AnimatedSection from './animations/AnimatedSection';
import AnimatedButton from './animations/AnimatedButton';
import GlowCard from './animations/GlowCard';

const Header = () => {

  const location = useLocation();

  if (location.pathname.startsWith('/doctors')) {
    return null;
  }

  return (
    <div className='relative min-h-screen flex items-center justify-center overflow-hidden'>
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
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
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className='relative z-10 flex flex-col md:flex-row items-center max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20 gap-12'>

        {/* ---- Left Side ---- */}
        <div className='md:w-1/2 flex flex-col items-start justify-center gap-8'>

          <AnimatedSection animation="fadeInLeft" delay={0.2}>
            <motion.h1 
              className='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
                Book Appointment
              </span>
              <br />
              <motion.span 
                className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                with trusted doctors
              </motion.span>
            </motion.h1>
          </AnimatedSection>

          <AnimatedSection animation="fadeInLeft" delay={0.4}>
            <div className='flex items-center gap-6'>
              <motion.img
                className='w-24 h-auto'
                src={assets.group_profiles}
                alt="profiles"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              />
              <p className='text-gray-300 text-base md:text-lg leading-relaxed max-w-md'>
                Simply browse and book appointments with top-rated doctors in your area.
                <br />
                <span className="text-blue-400">Our platform connects you with trusted healthcare professionals.</span>
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeInLeft" delay={0.6}>
            <motion.a
              href="#speciality"
              className='group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-full font-semibold shadow-2xl overflow-hidden'
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <span className="relative z-10">Book Appointment</span>
              <motion.img 
                className='w-5 relative z-10' 
                src={assets.arrow_icon} 
                alt="arrow"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.a>
          </AnimatedSection>

          {/* Stats */}
          <AnimatedSection animation="fadeInLeft" delay={0.8}>
            <div className="flex items-center gap-8 mt-8">
              <div className="text-center">
                <motion.div 
                  className="text-2xl font-bold text-blue-400"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  500+
                </motion.div>
                <div className="text-sm text-gray-400">Doctors</div>
              </div>
              <div className="w-px h-12 bg-gray-700"></div>
              <div className="text-center">
                <motion.div 
                  className="text-2xl font-bold text-orange-400"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                >
                  10k+
                </motion.div>
                <div className="text-sm text-gray-400">Patients</div>
              </div>
              <div className="w-px h-12 bg-gray-700"></div>
              <div className="text-center">
                <motion.div 
                  className="text-2xl font-bold text-green-400"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.6 }}
                >
                  98%
                </motion.div>
                <div className="text-sm text-gray-400">Satisfaction</div>
              </div>
            </div>
          </AnimatedSection>

        </div>

        {/* ---- Right Side ---- */}
        <div className='md:w-1/2 relative flex justify-center'>
          <AnimatedSection animation="fadeInRight" delay={0.4}>
            <GlowCard className="p-4" glowColor="blue" intensity="medium">
              <motion.img
                className='w-full max-w-lg rounded-2xl shadow-2xl'
                src={assets.header_img}
                alt="header"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
              />
            </GlowCard>
          </AnimatedSection>
          
          {/* Floating elements around the image */}
          <motion.div
            className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500 rounded-full blur-sm"
            animate={{
              y: [-10, 10, -10],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-4 -right-4 w-6 h-6 bg-orange-500 rounded-full blur-sm"
            animate={{
              y: [10, -10, 10],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>

      </div>
    </div>
  );
};

export default Header;