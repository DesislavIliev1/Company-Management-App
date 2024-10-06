import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login'; 
import Register from '../pages/Register';
import Company from '../pages/Company';
import Home from '../pages/Home';
import ProtectedRoute from '../components/ProtectedRoute';
const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    useEffect(() => {
        const checkAuthStatus = async () => {
          const token = localStorage.getItem('token');
          if (token) {
            try {
              const response = await fetch('/api/auth/verify', {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });
    
              if (response.ok) {
                const data = await response.json();
                if (data.isAuthenticated) {
                  setIsAuthenticated(true);
                } else {
                  setIsAuthenticated(false);
                }
              } else {
                setIsAuthenticated(false);
              }
            } catch (error) {
              console.error('Error verifying token:', error);
              setIsAuthenticated(false);
            }
          } else {
            setIsAuthenticated(false);
          }
        };
    
        checkAuthStatus();
      }, []);
    
  
    return (
      <div>
        {/* <Header /> */}
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/company" element={<ProtectedRoute isAuthenticated={isAuthenticated} element={Company} />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
        </Routes>
      </div>
    );
  };

export default App
