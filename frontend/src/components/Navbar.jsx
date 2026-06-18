import React, { useState, useContext, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { navItemHover, buttonHover } from '../utils/animations';

const Navbar = () => {

  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { token, setToken, userData, isLoadingProfile } = useContext(AppContext);
  const navigate = useNavigate();

  const dropdownRef = useRef();

  //  Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    toast.success("Logged out successfully");
    navigate('/');
  };

  return (
    <motion.nav 
      className='fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50'
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
    >
      <div className='flex items-center justify-between py-4 px-6 max-w-7xl mx-auto'>

        {/* Logo */}
        <motion.img 
          onClick={() => navigate('/')}
          className='w-36 cursor-pointer filter brightness-0 invert'
          src={assets.logo} 
          alt="logo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        />

        {/* Desktop Menu */}
        <ul className='hidden lg:flex items-center gap-8 font-medium'>
          {navLinks.map((link, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
            >
              <NavLink to={link.path}>
                {({ isActive }) => (
                  <motion.div 
                    className='flex flex-col items-center group cursor-pointer relative'
                    {...navItemHover}
                  >
                    <p className={`text-sm lg:text-base transition-colors duration-300 ${
                      isActive ? "text-blue-400" : "text-gray-300 group-hover:text-blue-400"
                    }`}>
                      {link.name}
                    </p>
                    
                    {/* Animated underline */}
                    <motion.span 
                      className="absolute -bottom-1 h-0.5 bg-gradient-to-r from-blue-400 to-orange-400"
                      initial={{ width: 0 }}
                      animate={{ width: isActive ? "100%" : 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                    
                    {/* Glow effect on hover */}
                    <motion.div
                      className="absolute inset-0 bg-blue-400/20 rounded-lg blur-lg opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                )}
              </NavLink>
            </motion.li>
          ))}
        </ul>

        {/* Right Side */}
        <div className='flex items-center gap-4 relative' ref={dropdownRef}>

          {/* NOT Logged In */}
          {!token ? (
            <motion.button 
              onClick={() => navigate('/login')}
              className='bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-full hidden md:block font-semibold shadow-lg relative overflow-hidden group'
              {...buttonHover}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10">Create Account</span>
            </motion.button>
          ) : isLoadingProfile ? (
            <motion.div 
              className='hidden md:flex items-center gap-3 bg-gray-800/50 rounded-full px-4 py-2 backdrop-blur-sm border border-gray-700/50'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-400 text-sm">Loading...</span>
            </motion.div>
          ) : (
            <motion.div 
              className='hidden md:flex items-center gap-3 cursor-pointer bg-gray-800/50 rounded-full px-4 py-2 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300'
              onClick={() => setShowDropdown(prev => !prev)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              {/* Profile Icon */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ring-2 ring-blue-400/50">
                <svg 
                  className="w-4 h-4 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              
              <motion.img 
                src={assets.dropdown_icon} 
                className='w-3 filter invert'
                animate={{ rotate: showDropdown ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                alt="dropdown" 
              />

              {/* User Name Display */}
              {userData?.name && (
                <span className="text-sm text-gray-300 max-w-24 truncate">
                  {userData.name}
                </span>
              )}

              {/* Dropdown */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div 
                    className='absolute top-14 right-0 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl py-3 w-48 shadow-2xl'
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    
                    <motion.p 
                      onClick={() => {
                        navigate('/my-profile');
                        setShowDropdown(false);
                      }}
                      className='px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 cursor-pointer transition-all duration-200 flex items-center gap-3'
                      whileHover={{ x: 4 }}
                    >
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      My Profile
                    </motion.p>

                    <motion.p 
                      onClick={() => {
                        navigate('/my-appointments');
                        setShowDropdown(false);
                      }}
                      className='px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 cursor-pointer transition-all duration-200 flex items-center gap-3'
                      whileHover={{ x: 4 }}
                    >
                      <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                      My Appointments
                    </motion.p>

                    <motion.p 
                      onClick={() => {
                        // Check if admin is already logged in
                        const adminToken = localStorage.getItem('aToken');
                        const adminPanelUrl = import.meta.env.VITE_ADMIN_PANEL_URL || 'http://localhost:5176';
                        
                        if (adminToken) {
                          // Admin is logged in, go to dashboard
                          window.location.href = `${adminPanelUrl}/admin/dashboard`;
                        } else {
                          // Admin not logged in, go to login page
                          window.location.href = `${adminPanelUrl}/admin/login`;
                        }
                        setShowDropdown(false);
                      }}
                      className='px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 cursor-pointer transition-all duration-200 flex items-center gap-3'
                      whileHover={{ x: 4 }}
                    >
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      Admin Panel
                    </motion.p>

                    <hr className='my-2 border-gray-700/50' />

                    <motion.p 
                      onClick={logout}
                      className='px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 cursor-pointer transition-all duration-200 flex items-center gap-3'
                      whileHover={{ x: 4 }}
                    >
                      <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                      Logout
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Hamburger */}
          <motion.button 
            className='lg:hidden text-2xl text-gray-300 hover:text-white transition-colors duration-200'
            onClick={() => setShowMenu(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="flex flex-col gap-1">
              <span className="w-6 h-0.5 bg-current"></span>
              <span className="w-6 h-0.5 bg-current"></span>
              <span className="w-6 h-0.5 bg-current"></span>
            </div>
          </motion.button>

        </div>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {showMenu && (
          <motion.div 
            className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40'
            onClick={() => setShowMenu(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div 
            className='fixed top-0 right-0 h-full w-full sm:w-2/3 bg-gray-900/95 backdrop-blur-xl border-l border-gray-700/50 p-6 z-50'
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.6, -0.05, 0.01, 0.99] }}
          >

            <motion.button 
              className='text-xl mb-8 text-gray-300 hover:text-white transition-colors duration-200'
              onClick={() => setShowMenu(false)}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              ✖
            </motion.button>

            <ul className='flex flex-col gap-6 text-lg font-medium'>
              {navLinks.map((link, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
                >
                  <NavLink 
                    to={link.path}
                    onClick={() => setShowMenu(false)}
                    className={({ isActive }) =>
                      `block py-2 px-4 rounded-lg transition-all duration-300 ${
                        isActive 
                          ? "text-blue-400 bg-blue-400/10 border-l-4 border-blue-400" 
                          : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </motion.li>
              ))}
            </ul>

            {/* Mobile Auth */}
            {!token ? (
              <motion.button  
                onClick={() => {
                  setShowMenu(false);
                  navigate('/login');
                }}
                className='mt-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-full w-full font-semibold shadow-lg'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Account
              </motion.button>
            ) : isLoadingProfile ? (
              <motion.div  
                className='mt-8 bg-gray-800/50 px-6 py-3 rounded-full w-full flex items-center justify-center gap-3'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-400">Loading profile...</span>
              </motion.div>
            ) : (
              <div className="space-y-4 mt-8">
                {/* User Info */}
                {userData?.name && (
                  <motion.div  
                    className='bg-gray-800/50 px-6 py-3 rounded-full w-full text-center flex items-center gap-3'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    {/* Profile Icon */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <svg 
                        className="w-5 h-5 text-white" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-white font-semibold">{userData.name}</p>
                      <p className="text-gray-400 text-sm">{userData?.email || ""}</p>
                    </div>
                  </motion.div>
                )}

                {/* Admin Panel Button */}
                <motion.button  
                  onClick={() => {
                    // Check if admin is already logged in
                    const adminToken = localStorage.getItem('aToken');
                    const adminPanelUrl = import.meta.env.VITE_ADMIN_PANEL_URL || 'http://localhost:5176';
                    
                    if (adminToken) {
                      // Admin is logged in, go to dashboard
                      window.location.href = `${adminPanelUrl}/admin/dashboard`;
                    } else {
                      // Admin not logged in, go to login page
                      window.location.href = `${adminPanelUrl}/admin/login`;
                    }
                    setShowMenu(false);
                  }}
                  className='bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-full w-full font-semibold shadow-lg'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Admin Panel
                </motion.button>

                {/* Logout Button */}
                <motion.button  
                  onClick={() => {
                    logout();
                    setShowMenu(false);
                  }}
                  className='bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-full w-full font-semibold shadow-lg'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Logout
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </motion.nav>
  );
};

export default Navbar;