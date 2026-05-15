import React from 'react'
import { motion } from 'framer-motion';
import { specialityData } from '../assets/assets';
import { Link, useLocation } from 'react-router-dom';
import AnimatedSection from './animations/AnimatedSection';
import GlowCard from './animations/GlowCard';

const SpecialityMenu = () => {

    const location = useLocation();

    //  Hide on doctors page
    if (location.pathname.startsWith('/doctors')) {
        return null;
    }

    return(
        <div id='speciality' className='flex flex-col items-center gap-8 py-20 relative'>

            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent" />

            <AnimatedSection animation="fadeInUp" className="text-center relative z-10">
                <motion.h1 
                    className='text-4xl md:text-5xl font-bold mb-4'
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
                        Find by Speciality
                    </span>
                </motion.h1>

                <motion.p 
                    className='text-gray-400 text-center max-w-2xl mx-auto text-lg leading-relaxed'
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Simply browse through our extensive list of trusted doctors,
                    <br />
                    <span className="text-blue-400">schedule your appointment hassle-free</span>
                </motion.p>
            </AnimatedSection>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 pt-8 w-full max-w-6xl mx-auto px-4 relative z-10'>

                {specialityData.map((item,index)=>(
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                            duration: 0.5, 
                            delay: index * 0.1,
                            ease: [0.6, -0.05, 0.01, 0.99]
                        }}
                    >
                        <Link 
                            to={`/doctors/${item.speciality}`}
                            state={{
                                speciality: item.speciality,
                                description: `Find experienced ${item.speciality} doctors and book appointments easily.`
                            }}
                        >
                            <GlowCard className="p-6 text-center group cursor-pointer bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
                                <motion.div
                                    whileHover={{ 
                                        scale: 1.1,
                                        rotate: [0, -5, 5, 0],
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="mb-4"
                                >
                                    <img 
                                        className='w-16 h-16 mx-auto object-contain filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300' 
                                        src={item.image} 
                                        alt={item.speciality} 
                                    />
                                </motion.div>
                                
                                <motion.p 
                                    className='text-sm font-semibold text-gray-300 group-hover:text-white transition-colors duration-300'
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {item.speciality}
                                </motion.p>

                                {/* Hover glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-orange-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                            </GlowCard>
                        </Link>
                    </motion.div>
                ))}

            </div>

            {/* Decorative elements */}
            <motion.div
                className="absolute top-10 left-10 w-4 h-4 bg-blue-500/30 rounded-full blur-sm"
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute bottom-10 right-10 w-6 h-6 bg-orange-500/30 rounded-full blur-sm"
                animate={{
                    scale: [1.5, 1, 1.5],
                    opacity: [0.5, 1, 0.5]
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
            />

        </div>
    )
}

export default SpecialityMenu;