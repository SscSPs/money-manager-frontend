import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  // Get userName, isLoading, and selectedWorkplaceId from context
  const { token, userId, userName, isLoading, selectedWorkplaceId, logout } = useAuth();

  return (
    <div>
      {token && userId ? (
        // Logged-in state
        <>
          <h2>Welcome!</h2>
          {isLoading ? (
            <p>Loading user details...</p> // Show loading message
          ) : userName ? (
            <p>Hello, {userName}</p> // Display the userName
          ) : (
            <p>Hello, User ID: {userId} (Could not fetch name)</p> // Fallback if name fetch failed
          )}

          {/* Display Selected Workplace Info */}
          <div style={{ marginTop: '15px', padding: '10px', border: '1px dashed #aaa' }}>
            {selectedWorkplaceId ? (
              <p>Selected Workplace ID: <strong>{selectedWorkplaceId}</strong></p>
            ) : (
              <p>No workplace selected. Please <Link to="/workplaces">select or create a workplace</Link>.</p>
            )}
          </div>

          <nav style={{ marginTop: '20px', marginBottom: '20px', display: 'flex', gap: '15px' }}>
            <Link to="/workplaces">Manage Workplaces</Link>
            {/* Conditionally render link to Journals */}
            {selectedWorkplaceId && (
              <Link to="/journals">View Journals</Link>
            )}
            {/* Add links to other sections here */}
          </nav>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        // Logged-out state
        <>
          <h2>Home Page</h2>
          <p>Please log in to manage your finances.</p> {/* Updated message */}
          <Link to="/login">
            <button>Login</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default Home; 