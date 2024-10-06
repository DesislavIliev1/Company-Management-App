import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const handleRegister = async (e) => {
      e.preventDefault();
      setError('');
  
      if (password !== passwordConfirmation) {
        setError('Passwords do not match');
        return;
      }
  
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation }),
        });
  
        if (response.ok) {
          navigate('/login');
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Registration failed');
        }
      } catch (error) {
        setError('An error occurred. Please try again.');
      }
    };
  
    return (
        <div className="login-page-wrapper">
          <div className="form-wrapper">
            <h1 className="loggin-title">Register</h1>
            <form onSubmit={handleRegister} className="loggin-form">
              <div className="input-wrapper">
                <label className="block text-gray-700">Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className=""
                />
              </div>
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
              <div className="input-wrapper">
                <label className="block text-gray-700">Confirm Password:</label>
                <input
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  className=""
                />
              </div>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <button type="submit" className="register-btn">
                Register
              </button>
            </form>
          </div>
        </div>
      );
  };

export default register
