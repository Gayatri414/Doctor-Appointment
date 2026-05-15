import React from 'react';
import { motion } from 'framer-motion';
import { assets } from '../assets/assets';
import AnimatedSection from './animations/AnimatedSection';

const Footer = () => {
  return (
    <footer className="relative bg-gray-900 border-t border-gray-800 px-6 md:px-12 lg:px-20 py-16 mt-20 overflow-hidden">

      {/* Background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Main Section */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">

        {/* Left Section */}
        <AnimatedSection animation="fadeInUp" delay={0.1} className="md:col-span-2">
          <motion.img 
            src={assets.logo} 
            alt="logo" 
            className="w-36 mb-6 filter brightness-0 invert"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          />
          <p className="text-gray-400 text-base leading-relaxed max-w-md mb-6">
            Connecting you with trusted healthcare professionals, anytime, anywhere.
            <br />
            <span className="text-blue-400">We care for your health.</span> Book appointments with ease.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {['facebook', 'twitter', 'linkedin', 'instagram'].map((social, index) => (
              <motion.div
                key={social}
                className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <span className="text-white text-sm font-bold">
                  {social.charAt(0).toUpperCase()}
                </span>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* Company Section */}
        <AnimatedSection animation="fadeInUp" delay={0.2}>
          <motion.h3 
            className="text-lg font-bold mb-6 text-white"
            whileHover={{ color: "#60a5fa" }}
            transition={{ duration: 0.2 }}
          >
            COMPANY
          </motion.h3>
          <ul className="space-y-3">
            {['Home', 'About us', 'Contact us', 'Privacy policy'].map((item, index) => (
              <motion.li
                key={item}
                className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-200 relative"
                whileHover={{ x: 5 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <span className="relative">
                  {item}
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400"
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </span>
              </motion.li>
            ))}
          </ul>
        </AnimatedSection>

        {/* Contact Section */}
        <AnimatedSection animation="fadeInUp" delay={0.3}>
          <motion.h3 
            className="text-lg font-bold mb-6 text-white"
            whileHover={{ color: "#fb923c" }}
            transition={{ duration: 0.2 }}
          >
            GET IN TOUCH
          </motion.h3>
          <ul className="space-y-4">
            <motion.li
              className="text-gray-400 flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="hover:text-blue-400 transition-colors duration-200">
                +1-22-33-456-7890
              </span>
            </motion.li>
            <motion.li
              className="text-gray-400 flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span className="hover:text-orange-400 transition-colors duration-200">
                info@healthconnect.com
              </span>
            </motion.li>
          </ul>

          {/* Newsletter */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-sm text-gray-400 mb-3">Subscribe to our newsletter</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors duration-200"
              />
              <motion.button
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </AnimatedSection>

      </div>

      {/* Divider */}
      <motion.hr 
        className="border-gray-800 mb-8"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      />

      {/* Copyright */}
      <AnimatedSection animation="fadeInUp" delay={0.9}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <motion.p 
            className="text-center text-sm text-gray-500"
            whileHover={{ color: "#9ca3af" }}
          >
            © 2026 HealthConnect. All rights reserved.
          </motion.p>
          
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <motion.span
              className="hover:text-gray-400 cursor-pointer transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
            >
              Terms of Service
            </motion.span>
            <span>•</span>
            <motion.span
              className="hover:text-gray-400 cursor-pointer transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
            >
              Privacy Policy
            </motion.span>
            <span>•</span>
            <motion.span
              className="hover:text-gray-400 cursor-pointer transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
            >
              Cookie Policy
            </motion.span>
          </div>
        </div>
      </AnimatedSection>

    </footer>
  );
};

export default Footer;