import React from 'react';
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const Header = () => {

  const location = useLocation();

  //  Hide Header on doctors page
  if (location.pathname.startsWith('/doctors')) {
    return null;
  }

  return (
    <div className='flex flex-col md:flex-row items-center bg-primary rounded-xl px-6 md:px-12 lg:px-20 py-10 gap-8'>

      {/* ---- Left Side ---- */}
      <div className='md:w-1/2 flex flex-col items-start justify-center gap-6'>

        <h1 className='text-3xl md:text-4xl lg:text-5xl text-white font-bold leading-snug'>
          Book Appointment <br />
          with trusted doctors
        </h1>

        <div className='flex items-center gap-4'>
          <img
            className='w-20 h-auto'
            src={assets.group_profiles}
            alt="profiles"
          />
          <p className='text-white text-sm md:text-base leading-relaxed'>
            Simply browse and book appointments with top-rated doctors in your area.
            <br />
            Our platform connects you with trusted healthcare professionals.
          </p>
        </div>

        <a
          href="#speciality"
          className='flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 shadow-md'
        >
          Book Appointment
          <img className='w-4' src={assets.arrow_icon} alt="arrow" />
        </a>

      </div>

      {/* ---- Right Side ---- */}
      <div className='md:w-1/2 relative flex justify-center'>
        <img
          className='w-full max-w-md md:bottom-0 rounded-lg'
          src={assets.header_img}
          alt="header"
        />
      </div>

    </div>
  );
};

export default Header;