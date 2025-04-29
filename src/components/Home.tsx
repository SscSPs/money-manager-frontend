import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { token, logout } = useAuth();

  return (
    <div>
      {token ? (
        // Logged-in state
        <>
          <h2>Welcome!</h2>
          <p>Hello, token: {token.substring(0, 10)}...</p> {/* Display part of the token */}
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        // Logged-out state
        <>
          <h2>Home Page</h2>
          <p>Click login to login</p>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default Home; 