import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login'; 
import Register from '../pages/Register';
import Company from '../pages/Company';
import Task from '../pages/Task'
import Employee from '../pages/Employee';
import Home from '../pages/Home';
import Header from '../components/Header';
import ProtectedRoute from '../components/ProtectedRoute';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state

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

      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  if (loading) {
    // Show a loading screen while the token is being verified
    return <div>Loading...</div>;
  }
    
    return (
      <div>
         <Header setIsAuthenticated={setIsAuthenticated}/>
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/company" element={<ProtectedRoute isAuthenticated={isAuthenticated} element={Company} />} />
          <Route path="/employee" element={<ProtectedRoute isAuthenticated={isAuthenticated} element={Employee} />} />
          <Route path="/tasks" element={<ProtectedRoute isAuthenticated={isAuthenticated} element={Task} />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/company" : "/login"} />} />
        </Routes>
      </div>
    );
  };

export default App
