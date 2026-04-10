import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const Navbar = () => {

  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "All Doctors", path: "/doctors" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <div className='flex items-center justify-between py-4 px-6 border-b border-gray-200 bg-white shadow-sm sticky top-0 z-50'>

      {/* Logo */}
      <img 
        onClick={() => navigate('/')}
        className='w-36 cursor-pointer hover:scale-105 transition'
        src={assets.logo} 
        alt="logo" 
      />

      {/* Desktop Menu */}
      <ul className='hidden lg:flex items-center gap-6 font-medium'>
        {navLinks.map((link, index) => (
          <li key={index}>
            <NavLink to={link.path}>
              {({ isActive }) => (
                <div className='flex flex-col items-center group cursor-pointer'>
                  <p className={`text-sm lg:text-base ${
                    isActive ? "text-blue-500" : "text-gray-700 group-hover:text-blue-500"
                  }`}>
                    {link.name}
                  </p>
                  <span className={`h-[2px] bg-blue-500 mt-1 transition-all duration-300 ${
                    isActive ? "w-6" : "w-0 group-hover:w-6"
                  }`}></span>
                </div>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Right Side */}
      <div className='flex items-center gap-4 relative'>

        {/* NOT Logged In */}
        {!token ? (
          <button 
            onClick={() => navigate('/login')}
            className='bg-blue-500 text-white px-5 py-2 rounded-full hidden md:block hover:bg-blue-600 transition'
          >
            Create Account
          </button>
        ) : (
          <div 
            className='hidden md:flex items-center gap-2 cursor-pointer'
            onClick={() => setShowDropdown(prev => !prev)}
          >
            <img 
              src={assets.profile_pic} 
              className='w-8 h-8 rounded-full object-cover' 
              alt="profile" 
            />
            <img 
              src={assets.dropdown_icon} 
              className={`w-3 transition-transform ${
                showDropdown ? "rotate-180" : ""
              }`} 
              alt="dropdown" 
            />

            {/* Dropdown */}
            {showDropdown && (
              <div className='absolute top-12 right-0 bg-white shadow-lg rounded-md py-3 w-40 z-50'>
                <p 
                  onClick={() => {
                    navigate('/my-profile');
                    setShowDropdown(false);
                  }}
                  className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                >
                  My Profile
                </p>

                <p 
                  onClick={() => {
                    navigate('/my-appointments');
                    setShowDropdown(false);
                  }}
                  className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                >
                  My Appointments
                </p>

                <hr className='my-2' />

                <p 
                  onClick={logout}
                  className='px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer'
                >
                  Logout
                </p>
              </div>
            )}
          </div>
        )}

        {/* Hamburger (Mobile Only) */}
        <button 
          className='lg:hidden text-2xl'
          onClick={() => setShowMenu(true)}
        >
          ☰
        </button>

      </div>

      {/* Overlay */}
      {showMenu && (
        <div 
          className='fixed inset-0 bg-black/40 z-40'
          onClick={() => setShowMenu(false)}
        ></div>
      )}

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-2/3 bg-white shadow-xl p-6 z-50 transform transition-transform duration-300 ${
        showMenu ? "translate-x-0" : "translate-x-full"
      }`}>

        {/* Close Button */}
        <button 
          className='text-xl mb-6'
          onClick={() => setShowMenu(false)}
        >
          ✖
        </button>

        {/* Links */}
        <ul className='flex flex-col gap-6 text-lg font-medium'>
          {navLinks.map((link, index) => (
            <li key={index}>
              <NavLink 
                to={link.path}
                onClick={() => setShowMenu(false)}
                className={({ isActive }) =>
                  isActive ? "text-blue-500 font-semibold" : "text-gray-700"
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile Auth */}
        {!token ? (
          <button  
            onClick={() => {
              setShowMenu(false);
              navigate('/login');
            }}
            className='mt-8 bg-blue-500 text-white px-6 py-2 rounded-full w-full'
          >
            Create Account
          </button>
        ) : (
          <button  
            onClick={() => {
              logout();
              setShowMenu(false);
            }}
            className='mt-8 bg-red-500 text-white px-6 py-2 rounded-full w-full'
          >
            Logout
          </button>
        )}

      </div>

    </div>
  );
};

export default Navbar;