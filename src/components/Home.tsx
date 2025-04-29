import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  // Get the selectedWorkplace object from context
  const { token, userId, selectedWorkplace } = useAuth();

  // Logged-out view is less relevant now as ProtectedRoute redirects
  // but we keep it as a fallback or if ProtectedRoute logic changes.
  if (!token || !userId) {
    return (
      <div>
        <h2>Home Page</h2>
        <p>Please log in to manage your finances.</p>
        {/* Login link is in Navbar */}
      </div>
    );
  }

  // Logged-in view
  return (
    <div>
      <h2>Dashboard</h2> {/* Changed title */}

      {/* Display Selected Workplace Info - kept here for main content area */}
      <div style={{ marginTop: '15px', padding: '10px', border: '1px dashed #aaa' }}>
        {/* Check for the selectedWorkplace object */}
        {selectedWorkplace ? (
          <>
            {/* Display name and ID */}
            <p>Current Workplace: <strong>{selectedWorkplace.name}</strong> ({selectedWorkplace.id})</p>
            <p style={{marginTop: '10px'}}>
              <Link to="/journals">View Journals</Link>
            </p>
            {/* Add more workplace-specific components/summaries here */}
          </>
        ) : (
          <p>No workplace selected. Please <Link to="/workplaces">select or create a workplace</Link>.</p>
        )}
      </div>

      {/* Other dashboard content can go here */}

    </div>
  );
};

export default Home; 