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

        navigate(
          state === "Admin"
            ? "/admin-dashboard"
            : "/doctor-dashboard"
        );

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-500">
      
      <form
        onSubmit={onSubmitHandler}
        className="bg-white p-8 rounded-xl shadow-lg w-[320px]"
      >
        
        <p className="text-2xl font-semibold text-center mb-6">
          <span className="text-indigo-600 mr-1">{state}</span> Login
        </p>

        <div className="mb-4">
          <p className="text-sm mb-1 text-gray-600">Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 border rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-300"
          />
        </div>

        <div className="mb-4">
          <p className="text-sm mb-1 text-gray-600">Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Enter your password"
            className="w-full px-3 py-2 border rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-300"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm mt-4 text-gray-600">
          {state === "Admin" ? "Doctor Login?" : "Admin Login?"}
          <span
            onClick={() =>
              setState(state === "Admin" ? "Doctor" : "Admin")
            }
            className="text-indigo-600 cursor-pointer ml-1 font-medium hover:underline"
          >
            Click here
          </span>
        </p>

      </form>
    </div>
  );
};

export default Login;