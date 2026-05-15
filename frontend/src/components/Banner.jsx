import React from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import AnimatedSection from "./animations/AnimatedSection";
import AnimatedButton from "./animations/AnimatedButton";

const Banner = () => {

    const navigate = useNavigate();
return(
    <div className="relative my-20 mx-4 md:mx-10 overflow-hidden">
        
        {/* Background with gradient and glow effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 rounded-2xl" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-orange-600/20 rounded-2xl" />
        
        {/* Animated background elements */}
        <motion.div
            className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"
            animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
        <motion.div
            className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
            }}
        />

        <div className="relative flex items-center bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl px-6 sm:px-10 md:px-14 lg:px-12 min-h-[400px]">
            
            {/*---left side---*/}
            <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5 relative z-10">
                
                <AnimatedSection animation="fadeInLeft">
                    <motion.div 
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white leading-tight"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <motion.p
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Book Appointment
                        </motion.p>
                        <motion.p 
                            className="mt-2 bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            With 100+ Trusted Doctors
                        </motion.p>
                    </motion.div>
                </AnimatedSection>

                <AnimatedSection animation="fadeInLeft" delay={0.6}>
                    <motion.p
                        className="text-gray-300 text-lg mt-6 max-w-md leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        Join thousands of satisfied patients who trust our platform for their healthcare needs.
                    </motion.p>
                </AnimatedSection>

                <AnimatedSection animation="fadeInLeft" delay={0.8}>
                    <AnimatedButton
                        onClick={() => {
                            navigate('/login');
                            window.scrollTo(0, 0);
                        }}
                        variant="primary"
                        size="lg"
                        className="mt-8 bg-white text-gray-900 hover:bg-gray-100 font-bold shadow-2xl"
                    >
                        Create Account
                    </AnimatedButton>
                </AnimatedSection>

                {/* Stats */}
                <motion.div 
                    className="flex items-center gap-8 mt-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 1 }}
                >
                    <div className="text-center">
                        <motion.div 
                            className="text-2xl font-bold text-orange-400"
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 1.2 }}
                        >
                            100+
                        </motion.div>
                        <div className="text-sm text-gray-400">Doctors</div>
                    </div>
                    <div className="w-px h-12 bg-gray-600"></div>
                    <div className="text-center">
                        <motion.div 
                            className="text-2xl font-bold text-blue-400"
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 1.4 }}
                        >
                            24/7
                        </motion.div>
                        <div className="text-sm text-gray-400">Support</div>
                    </div>
                </motion.div>

            </div>
            
            {/*---right side---*/}
            <div className="hidden md:block md:w-1/2 lg:w-[370px] relative">
                <AnimatedSection animation="fadeInRight" delay={0.4}>
                    <motion.img  
                        className="w-full relative z-10 max-w-md ml-auto"
                        src={assets.appointment_img} 
                        alt="appointment"
                        initial={{ opacity: 0, scale: 0.8, x: 50 }}
                        whileInView={{ opacity: 1, scale: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        whileHover={{ scale: 1.05, y: -10 }}
                    />
                </AnimatedSection>
                
                {/* Floating elements around the image */}
                <motion.div
                    className="absolute top-10 right-10 w-4 h-4 bg-orange-500/60 rounded-full blur-sm"
                    animate={{
                        y: [-15, 15, -15],
                        opacity: [0.4, 1, 0.4]
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-5 w-3 h-3 bg-blue-500/60 rounded-full blur-sm"
                    animate={{
                        y: [15, -15, 15],
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

        </div>
    </div>
)

}
;
export default Banner;