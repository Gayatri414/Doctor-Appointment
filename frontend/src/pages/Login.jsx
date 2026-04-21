import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(
          backendUrl + "/api/user/register",
          { name, email, password }
        );

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(
          backendUrl + "/api/user/login",
          { email, password }
        );

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-[80vh] flex items-center justify-center"
    >
      <div className="flex flex-col gap-4 w-full max-w-md p-8 border rounded-xl shadow-md">

        <p className="text-2xl font-semibold text-center">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>

        <p className="text-gray-500 text-sm text-center">
          Please {state === "Sign Up" ? "sign up" : "login"} to book appointment
        </p>

        {state === "Sign Up" && (
          <div>
            <p className="text-sm">Full Name</p>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mt-1"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}

        <div>
          <p className="text-sm">Email</p>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 mt-1"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div>
          <p className="text-sm">Password</p>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 mt-1"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <button className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>

        <p className="text-sm text-center">
          {state === "Sign Up"
            ? "Already have an account?"
            : "Create a new account?"}

          <span
            onClick={() =>
              setState(state === "Sign Up" ? "Login" : "Sign Up")
            }
            className="text-blue-500 cursor-pointer ml-1"
          >
            {state === "Sign Up" ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </form>
  );
};

export default Login;
