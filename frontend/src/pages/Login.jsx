import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";   

const Login = () => {

  const { backendUrl, setToken } = useContext(AppContext);
  const navigate = useNavigate();   

  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(
          backendUrl + "/api/user/register",
          { name, email, password }
        );

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Account created successfully!");
          
          // Navigate after a short delay to ensure state updates
          setTimeout(() => {
            navigate("/");
          }, 500);
        } else {
          toast.error(data.message);
        }

      } else {
        const { data } = await axios.post(
          backendUrl + "/api/user/login",
          { email, password }
        );

        if (data.success) {
          // Verify token before storing
          if (!data.token) {
            toast.error("Login failed - no token received");
            return;
          }
          
          // Store token first
          localStorage.setItem("token", data.token);
          
          // Verify storage
          const storedToken = localStorage.getItem("token");
          if (!storedToken) {
            toast.error("Failed to store authentication token");
            return;
          }
          
          // Set token in context
          setToken(data.token);
          
          toast.success("Login successful!");
          
          // Navigate after a delay to ensure state updates
          setTimeout(() => {
            navigate("/");
          }, 800); // Increased delay to ensure profile loads
        } else {
          toast.error(data.message);
        }
      }

    } catch (error) {
      console.error("Authentication error:", error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.message || error.message || "An error occurred";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden py-20">
      
      {/* Background Elements */}
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

      <motion.form
        onSubmit={onSubmitHandler}
        className="relative z-10 w-full max-w-md mx-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">

          {/* Title */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
                {state === "Sign Up" ? "Create Account" : "Welcome Back"}
              </span>
            </h1>
            <p className="text-gray-400">
              Please {state === "Sign Up" ? "sign up" : "login"} to continue
            </p>
          </motion.div>

          <div className="space-y-6">
            {/* Name Field */}
            {state === "Sign Up" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                    placeholder="Enter your full name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-orange-500/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </motion.div>
            )}

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: state === "Sign Up" ? 0.4 : 0.3 }}
            >
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-orange-500/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: state === "Sign Up" ? 0.5 : 0.4 }}
            >
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 pr-12 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                />
                
                {/* Eye Icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-orange-500/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </motion.div>
          </div>

          {/* Submit Button */}
          <motion.button 
            type="submit"
            disabled={isLoading}
            className="group relative w-full mt-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {state === "Sign Up" ? "Creating Account..." : "Signing In..."}
                </>
              ) : (
                state === "Sign Up" ? "Create Account" : "Sign In"
              )}
            </span>
          </motion.button>

          {/* Toggle */}
          <motion.div 
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <p className="text-gray-400">
              {state === "Sign Up"
                ? "Already have an account?"
                : "Don't have an account?"}
              {" "}
              <button
                type="button"
                onClick={() =>
                  setState(state === "Sign Up" ? "Login" : "Sign Up")
                }
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
              >
                {state === "Sign Up" ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </motion.div>

          {/* Demo Credentials */}
          <motion.div 
            className="mt-6 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            <p className="text-xs text-gray-400 text-center mb-2">Demo Credentials:</p>
            <div className="text-xs text-gray-300 space-y-1">
              <p><span className="text-blue-400">Email:</span> test@example.com</p>
              <p><span className="text-orange-400">Password:</span> test123</p>
            </div>
          </motion.div>

        </div>
      </motion.form>
    </div>
  );
};

export default Login;