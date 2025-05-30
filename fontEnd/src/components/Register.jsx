import axios from "axios";
import React from "react";
import { useState } from "react";
import './Auth.css';


const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    try {
      e.preventDefault();
      console.log(form);
      const res = await axios.post("http://localhost:3000/register", form);
      setForm({ name: "", email: "", password: "" });
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error during registration");
    }
  };

  return (
    <div className="auth-container">
  <form onSubmit={handleRegister}>
    <label htmlFor="name">Name:</label>
    <input
      type="text"
      id="name"
      name="name"
      value={form.name}
      onChange={handleChange}
    />

    <label htmlFor="email">Email:</label>
    <input
      type="email"
      id="email"
      name="email"
      value={form.email}
      onChange={handleChange}
    />

    <label htmlFor="password">Password:</label>
    <input
      type="password"
      id="password"
      name="password"
      value={form.password}
      onChange={handleChange}
    />

    <button type="submit">Submit</button>
  </form>
  <p className={message.toLowerCase().includes('error') ? 'error-message' : ''}>
    {message}
  </p>
</div>

  );
};

export default Register;
