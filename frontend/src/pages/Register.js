import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';  // ADD THIS IMPORT

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '',phone: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // UPDATE THIS LINE:
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, form);
      setMessage('Registration successful!');
      console.log(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" className="form-control mb-2" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" className="form-control mb-2" onChange={handleChange} />
        <input type="tel" name="phone" placeholder="phone" className="form-control mb-2" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" className="form-control mb-2" onChange={handleChange} />
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
}

export default Register;