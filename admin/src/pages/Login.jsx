import React, { useState, useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setAToken, backendUrl } = useContext(AdminContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const endpoint = state.toLowerCase();

      const { data } = await axios.post(
        `${backendUrl}/api/${endpoint}/login`,
        { email, password }
      );

      if (data.success) {
        setAToken(data.token);

        // store based on role
        if (state === "Admin") {
          localStorage.setItem("aToken", data.token);
        } else {
          localStorage.setItem("dToken", data.token);
        }

        toast.success(`${state} Login Successful`);

        // Navigate to appropriate dashboard
        if (state === "Admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/doctor/dashboard");
        }

        // reset fields
        setEmail("");
        setPassword("");

      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <form
        onSubmit={onSubmitHandler}
        className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-8 rounded-2xl shadow-2xl w-[380px] relative z-10"
      >
        
        <p className="text-3xl font-bold text-center mb-8 text-white">
          <span className="text-blue-400 mr-2">{state}</span> 
          <span className="text-white">Login</span>
        </p>

        <div className="mb-6">
          <p className="text-sm mb-2 text-gray-300 font-medium">Email Address</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
          />
        </div>

        <div className="mb-6">
          <p className="text-sm mb-2 text-gray-300 font-medium">Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Logging in...</span>
            </div>
          ) : (
            "Login"
          )}
        </button>

        <p className="text-center text-sm mt-6 text-gray-400">
          {state === "Admin" ? "Doctor Login?" : "Admin Login?"}
          <span
            onClick={() =>
              setState(state === "Admin" ? "Doctor" : "Admin")
            }
            className="text-blue-400 cursor-pointer ml-1 font-medium hover:text-blue-300 hover:underline transition-colors duration-200"
          >
            Click here
          </span>
        </p>

      </form>
    </div>
  );
};

export default Login;