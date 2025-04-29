import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { token, userName, selectedWorkplace, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  // Add console log for debugging
  console.log('Navbar rendering, selectedWorkplace:', selectedWorkplace);

  const handleLogout = () => {
    logout();
    // Optionally navigate to login or home after logout
    navigate('/login');
  };

  // Updated styles for dark theme and sticky positioning
  const navStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#242424', // Darker background
    borderBottom: '1px solid #3a3a3a', // Darker border
    color: 'rgba(255, 255, 255, 0.87)', // Light text color (matching Vite dark default)
    position: 'sticky', // Make it sticky
    top: 0, // Stick to the top
    zIndex: 1000, // Ensure it stays on top
    width: '100%', // Ensure it spans full width
    boxSizing: 'border-box', // Include padding in width calculation
  };

  const linkStyle: React.CSSProperties = {
    marginRight: '15px',
    textDecoration: 'none',
    color: 'rgba(255, 255, 255, 0.87)', // Light link color
    fontWeight: 500,
  };

  const buttonStyle: React.CSSProperties = {
     backgroundColor: '#1a1a1a', // Dark button background
     color: 'rgba(255, 255, 255, 0.87)',
     border: '1px solid transparent',
     padding: '0.6em 1.2em',
     fontSize: '1em',
     fontWeight: 500,
     fontFamily: 'inherit',
     cursor: 'pointer',
     transition: 'border-color 0.25s',
  };

  const userInfoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  };

  return (
    <nav style={navStyle}>
      <div>
        <Link to="/" style={linkStyle}>Money Manager</Link>
        {/* Add other general navigation links here if needed */}
      </div>
      <div style={userInfoStyle}>
        {isLoading ? (
          <span>Loading...</span>
        ) : token ? (
          // Logged-in view
          <>
            {userName && <span>Welcome, {userName}</span>}
            {selectedWorkplace && (
              <span style={{ fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.6)' }}>
                | Workplace: {selectedWorkplace.name}
              </span>
            )}
            {/* Link to switch workplace */}
            <Link to="/workplaces" style={linkStyle}>Workplaces</Link>
            <button onClick={handleLogout} style={buttonStyle}>Logout</button>
          </>
        ) : (
          // Logged-out view
          <Link to="/login" style={{ ...linkStyle, marginRight: 0 }}>
            <button style={buttonStyle}>Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 