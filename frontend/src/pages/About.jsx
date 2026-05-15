import React from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import AnimatedSection from "../components/animations/AnimatedSection";
import GlowCard from "../components/animations/GlowCard";

const About = () => {
  return (
    <div className="px-6 md:px-16 py-20 text-white relative">

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
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"
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

      {/* Heading */}
      <AnimatedSection animation="fadeInUp" className="text-center mb-16 relative z-10">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-white">ABOUT </span>
          <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">US</span>
        </motion.h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Transforming healthcare through technology and compassionate care
        </p>
      </AnimatedSection>

      {/* Content Section */}
      <div className="flex flex-col lg:flex-row gap-12 items-center mb-20 relative z-10">

        {/* Image */}
        <AnimatedSection animation="fadeInLeft" className="w-full lg:w-[45%]">
          <GlowCard className="overflow-hidden" glowColor="blue" intensity="medium">
            <motion.img
              className="w-full h-full object-cover rounded-2xl"
              src={assets.about_image}
              alt="About"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </GlowCard>
        </AnimatedSection>

        {/* Text Content */}
        <AnimatedSection animation="fadeInRight" className="flex flex-col gap-6 lg:w-[55%]">
          <div className="space-y-6 text-lg leading-relaxed">

            <motion.p 
              className="text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Welcome to our platform, where your health and well-being are our
              top priorities. We aim to simplify the process of booking
              appointments with <span className="text-blue-400">trusted doctors</span> and healthcare professionals.
            </motion.p>

            <motion.p 
              className="text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Our system provides a seamless experience, allowing users to browse,
              compare, and choose doctors based on their specialization,
              availability, and <span className="text-orange-400">expertise</span>.
            </motion.p>

            <motion.h3 
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Our Vision
            </motion.h3>

            <motion.p 
              className="text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              We envision a future where healthcare is easily accessible to
              everyone. Our mission is to bridge the gap between patients and
              doctors through technology, ensuring <span className="text-green-400">timely and efficient medical care</span>.
            </motion.p>

          </div>
        </AnimatedSection>
      </div>

      {/* WHY CHOOSE US */}
      <AnimatedSection animation="fadeInUp" className="mb-20 relative z-10">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-white">Why </span>
          <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">Choose Us</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlowCard className="p-8 text-center bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📅</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-white group-hover:text-blue-400 transition-colors duration-300">Easy Booking</h3>
              <p className="text-gray-400 leading-relaxed">
                Book appointments with just a few clicks anytime, anywhere.
              </p>
            </GlowCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <GlowCard className="p-8 text-center bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">👨‍⚕️</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-white group-hover:text-orange-400 transition-colors duration-300">Verified Doctors</h3>
              <p className="text-gray-400 leading-relaxed">
                All doctors are verified professionals with trusted experience.
              </p>
            </GlowCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <GlowCard className="p-8 text-center bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🕐</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-white group-hover:text-green-400 transition-colors duration-300">24/7 Support</h3>
              <p className="text-gray-400 leading-relaxed">
                Our support team is available anytime to assist you.
              </p>
            </GlowCard>
          </motion.div>

        </div>
      </AnimatedSection>

      {/* Stats Section */}
      <AnimatedSection animation="fadeInUp" className="relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlowCard className="p-6 text-center bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group min-h-[140px] flex flex-col justify-center">
              <motion.p 
                className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2"
                whileHover={{ scale: 1.1 }}
              >
                100+
              </motion.p>
              <p className="text-gray-400 font-medium">
                Expert Doctors
              </p>
            </GlowCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <GlowCard className="p-6 text-center bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 group min-h-[140px] flex flex-col justify-center">
              <motion.p 
                className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-2"
                whileHover={{ scale: 1.1 }}
              >
                10K+
              </motion.p>
              <p className="text-gray-400 font-medium">
                Happy Patients
              </p>
            </GlowCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <GlowCard className="p-6 text-center bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 group min-h-[140px] flex flex-col justify-center">
              <motion.p 
                className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-2"
                whileHover={{ scale: 1.1 }}
              >
                500+
              </motion.p>
              <p className="text-gray-400 font-medium">
                Appointments
              </p>
            </GlowCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <GlowCard className="p-6 text-center bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group min-h-[140px] flex flex-col justify-center">
              <motion.p 
                className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2"
                whileHover={{ scale: 1.1 }}
              >
                24/7
              </motion.p>
              <p className="text-gray-400 font-medium">
                Support Available
              </p>
            </GlowCard>
          </motion.div>

        </div>
      </AnimatedSection>

    </div>
  );
};

export default About;