import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://assignment.stage.crafto.app/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, otp }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/quotes');
      } else {
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Login;

