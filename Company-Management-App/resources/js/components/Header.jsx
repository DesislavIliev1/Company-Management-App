import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

const header = ( isAuthenticated) => {

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); 
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
          {isAuthenticated ? (
                <button onClick={handleLogout}>Logout</button>
            ) : (
            <Link to="/login">Login</Link>

            )}
        </div>
      </nav>
    </header>
  );
}

export default header
