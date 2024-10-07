import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const login =({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password,  }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        setIsAuthenticated(true);
        navigate('/company');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="form-wrapper">
        <h1 className="loggin-title">Login</h1>
        <form onSubmit={handleLogin} className="loggin-form">
          <div className="input-wrapper"> 
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className=""
            />
          </div>
          <div className="input-wrapper">
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className=""
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="login-btn"
          >
            Login
          </button>
          <Link to="/register">Register</Link>
        </form>
      </div>
    </div>
  );
};

export default login
