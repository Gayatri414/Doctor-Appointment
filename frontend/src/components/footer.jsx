import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <div className="bg-gray-100 px-6 md:px-12 lg:px-20 py-10 mt-20">

      {/* Main Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

        {/* Left Section */}
        <div>
          <img src={assets.logo} alt="logo" className="w-32 mb-4" />
          <p className="text-gray-600 text-sm leading-relaxed">
            Connecting you with trusted healthcare professionals, anytime, anywhere.
            We care for your health. Book appointments with ease.
          </p>
        </div>

        {/* Center Section */}
        <div>
          <p className="text-lg font-semibold mb-4 text-gray-800">COMPANY</p>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="cursor-pointer hover:text-blue-500 transition">Home</li>
            <li className="cursor-pointer hover:text-blue-500 transition">About us</li>
            <li className="cursor-pointer hover:text-blue-500 transition">Contact us</li>
            <li className="cursor-pointer hover:text-blue-500 transition">Privacy policy</li>
          </ul>
        </div>

        {/* Right Section */}
        <div>
          <p className="text-lg font-semibold mb-4 text-gray-800">GET IN TOUCH</p>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>+1-22-33-456-7890</li>
            <li>info@healthconnect.com</li>
          </ul>
        </div>

      </div>

      {/* Divider */}
      <hr className="my-8 border-gray-300" />

      {/* Copyright */}
      <p className="text-center text-sm text-gray-500">
        © 2026 HealthConnect. All rights reserved.
      </p>

    </div>
  );
};

export default Footer;