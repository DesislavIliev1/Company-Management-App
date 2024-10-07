import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

const header = () => {

  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.post('/api/logout', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  return (
    <header>
      <nav className="nav-wrapper">
        <ul>
          <li>
            <Link to="/company">Company</Link>
          </li>
          <li>
            <Link to="/employee">Employee</Link>
          </li>
          <li>
            <Link to="/tasks">Tasks</Link>
          </li>
        </ul>
        <div  className="right-side">
          {isAuthRoute ? (
            <Link to="/login">Login</Link>
          ) : (
            
            <button onClick={handleLogout}>Logout</button>
            )}
        </div>
      </nav>
    </header>
  );
}

export default header
