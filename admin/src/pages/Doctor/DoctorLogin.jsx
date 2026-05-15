import React, { useContext, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { DoctorContext } from "../../context/DoctorContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorLogin = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken, backendUrl: docBackendUrl } = useContext(DoctorContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (state === "Admin") {
        console.log("Admin login attempt with URL:", backendUrl + "/api/admin/login");
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });

        console.log("Admin login response:", data);

        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
          toast.success("Admin login successful!");
        } else {
          toast.error(data.message);
        }
      } else {
        console.log("Doctor login attempt with URL:", docBackendUrl + "/api/doctor/login");
        const { data } = await axios.post(docBackendUrl + "/api/doctor/login", {
          email,
          password,
        });

        console.log("Doctor login response:", data);

        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          toast.success("Doctor login successful!");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response);
      
      if (error.response?.status === 404) {
        toast.error(`Backend server not found. Please ensure the backend is running on the correct port.`);
      } else {
        toast.error(error.response?.data?.message || error.message || "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <form onSubmit={onSubmitHandler} className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
                {state}
              </span>
              <span className="text-white"> Login</span>
            </h1>
            <p className="text-gray-400">Welcome back! Please sign in to continue.</p>
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                type="email"
                placeholder="Enter your email"
                required
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-orange-500/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                type="password"
                placeholder="Enter your password"
                required
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-orange-500/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Login Button */}
          <button 
            type="submit"
            disabled={isLoading}
            className="group relative w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </span>
          </button>

          {/* Switch Login Type */}
          <div className="mt-6 text-center">
            {state === "Admin" ? (
              <p className="text-gray-400">
                Doctor Login?{" "}
                <button
                  type="button"
                  className="text-blue-400 hover:text-blue-300 underline font-medium transition-colors duration-200"
                  onClick={() => setState("Doctor")}
                >
                  Click here
                </button>
              </p>
            ) : (
              <p className="text-gray-400">
                Admin Login?{" "}
                <button
                  type="button"
                  className="text-orange-400 hover:text-orange-300 underline font-medium transition-colors duration-200"
                  onClick={() => setState("Admin")}
                >
                  Click here
                </button>
              </p>
            )}
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
            <p className="text-xs text-gray-400 text-center mb-2">Demo Credentials:</p>
            <div className="text-xs text-gray-300 space-y-1">
              <p><span className="text-blue-400">Admin:</span> admin@example.com / admin123</p>
              <p><span className="text-orange-400">Doctor:</span> doctor@example.com / doctor123</p>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};

export default DoctorLogin;