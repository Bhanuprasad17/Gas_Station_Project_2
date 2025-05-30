import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Auth.css';

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post("http://localhost:3000/login", form);
      setMessage(res.data.message);
      localStorage.setItem("token", res.data.token);
      navigate("/profile");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input
          type="email"
          value={form.email}
          name="email"
          onChange={handleChange}
        />
        <label>Password:</label>
        <input
          type="password"
          value={form.password}
          name="password"
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
      <p
        className={
          message.toLowerCase().includes("fail") ? "error-message" : ""
        }
      >
        {message}
      </p>
    </div>
  );
};

export default Login;
