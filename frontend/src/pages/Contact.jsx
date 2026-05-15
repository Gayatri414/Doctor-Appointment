import React from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import AnimatedSection from "../components/animations/AnimatedSection";
import GlowCard from "../components/animations/GlowCard";
import AnimatedButton from "../components/animations/AnimatedButton";

const Contact = () => {
  return (
    <div className="px-6 md:px-16 py-20 text-white relative">

      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 8,
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
          <span className="text-white">CONTACT </span>
          <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">US</span>
        </motion.h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Get in touch with us. We're here to help and answer any questions you might have.
        </p>
      </AnimatedSection>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-12 items-center mb-20 relative z-10">

        {/* Image */}
        <AnimatedSection animation="fadeInLeft" className="w-full lg:w-[45%]">
          <GlowCard className="overflow-hidden" glowColor="blue" intensity="medium">
            <motion.img
              className="w-full rounded-2xl shadow-2xl"
              src={assets.contact_image}
              alt="Contact"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </GlowCard>
        </AnimatedSection>

        {/* Contact Info */}
        <AnimatedSection animation="fadeInRight" className="w-full lg:w-[55%]">
          <GlowCard className="p-8 bg-gray-800/30 backdrop-blur-xl border border-gray-700/50">
            
            <motion.h2 
              className="text-2xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              OUR OFFICE
            </motion.h2>

            <div className="space-y-6">
              <motion.div 
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400">📍</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Address</h3>
                  <p className="text-gray-400 leading-relaxed">
                    123 Health Street,<br />
                    Pune, Maharashtra,<br />
                    India
                  </p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-400">📞</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Phone</h3>
                  <p className="text-gray-400">+91 98765 43210</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-400">📧</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Email</h3>
                  <p className="text-gray-400">support@healthcare.com</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400">🕒</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Working Hours</h3>
                  <p className="text-gray-400">Mon - Sat (9:00 AM - 8:00 PM)</p>
                </div>
              </motion.div>
            </div>

          </GlowCard>
        </AnimatedSection>

      </div>

      {/* Careers Section */}
      <AnimatedSection animation="fadeInUp" className="relative z-10">

        {/* Heading */}
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-white">Careers at </span>
          <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">Prescripto</span>
        </motion.h2>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-12 items-center">

          {/* Left Text */}
          <motion.div 
            className="lg:w-[60%] flex flex-col gap-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-6 text-lg leading-relaxed">
              <p className="text-gray-300">
                Join Prescripto and be part of a mission-driven team transforming the
                healthcare experience. We are always looking for <span className="text-blue-400">passionate individuals</span> who want to make a difference in people's lives.
              </p>

              <p className="text-gray-300">
                Whether you are a developer, designer, or healthcare professional, we
                offer opportunities to grow, innovate, and contribute to <span className="text-orange-400">meaningful solutions</span>.
              </p>

              <p className="text-gray-300">
                We believe in collaboration, continuous learning, and building products
                that truly <span className="text-green-400">impact society</span>.
              </p>
            </div>

            {/* Button */}
            <div className="mt-6">
              <AnimatedButton variant="primary" size="lg">
                <span className="flex items-center gap-2">
                  🚀 Explore Jobs
                </span>
              </AnimatedButton>
            </div>
          </motion.div>

          {/* Right Card */}
          <motion.div 
            className="lg:w-[40%]"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <GlowCard className="p-8 text-center bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">

              <motion.h3 
                className="text-xl font-bold mb-6 text-white"
                whileHover={{ scale: 1.05 }}
              >
                Why Work With Us?
              </motion.h3>

              <div className="space-y-4">
                {[
                  { icon: "🚀", text: "Growth Opportunities", color: "text-blue-400" },
                  { icon: "🤝", text: "Collaborative Culture", color: "text-orange-400" },
                  { icon: "💡", text: "Innovative Projects", color: "text-green-400" },
                  { icon: "🌍", text: "Real-world Impact", color: "text-purple-400" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className={`font-medium ${item.color}`}>{item.text}</span>
                  </motion.div>
                ))}
              </div>

            </GlowCard>
          </motion.div>

        </div>

      </AnimatedSection>

    </div>
  );
};

export default Contact;