import React, { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
// Import Workplace type from types, API functions from services
import { apiGetWorkplaces, apiCreateWorkplace } from '../services/api';
import type { Workplace } from '../types';

const WorkplaceManager: React.FC = () => {
  // Use selectedWorkplace (object) from context now
  const { token, selectedWorkplace, setSelectedWorkplace } = useAuth();
  // Use the imported Workplace type for state
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const [newWorkplaceName, setNewWorkplaceName] = useState('');
  const [newWorkplaceDescription, setNewWorkplaceDescription] = useState('');
  // Separate loading states for fetching list vs creating
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch workplaces
  const fetchWorkplaces = async () => {
    if (!token) return;
    setIsLoadingList(true);
    setError(null);
    try {
      // Use apiGetWorkplaces service function
      const data = await apiGetWorkplaces(token);
      setWorkplaces(data.workplaces || []);

      // Update logic to check selectedWorkplace.id
      const currentWorkplaces = data.workplaces || [];
      if (
        currentWorkplaces.length > 0 &&
        (!selectedWorkplace || !currentWorkplaces.some(wp => wp.workplaceID === selectedWorkplace.id))
      ) {
         // console.log("Selected workplace not in list or none selected");
         // Potential auto-select logic here if desired
      }

    } catch (err: any) {
      console.error('Fetch workplaces error:', err);
      setError(err.message || 'Failed to fetch workplaces');
      setWorkplaces([]);
    } finally {
      setIsLoadingList(false);
    }
  };

  // Function to handle workplace creation
  const handleCreateWorkplace = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || !newWorkplaceName) return;
    setIsCreating(true);
    setError(null);
    try {
      // Use apiCreateWorkplace service function
      const createdWorkplace = await apiCreateWorkplace(
        { name: newWorkplaceName, description: newWorkplaceDescription },
        token
      );
      setNewWorkplaceName('');
      setNewWorkplaceDescription('');
      // Pass the object { id, name } to setSelectedWorkplace
      setSelectedWorkplace({
        id: createdWorkplace.workplaceID,
        name: createdWorkplace.name,
      });
      fetchWorkplaces(); // Refresh list after successful creation
    } catch (err: any) {
      console.error('Create workplace error:', err);
      setError(err.message || 'Failed to create workplace');
    } finally {
      setIsCreating(false);
    }
  };

  // Fetch workplaces on component mount or when token changes
  useEffect(() => {
    fetchWorkplaces();
    // Dependency on selectedWorkplace added if we want fetchWorkplaces
    // to potentially clear selection if the selected one disappears
  }, [token, selectedWorkplace?.id]); // Re-run if token or selected ID changes

  return (
    <div>
      <h2>Workplace Management</h2>

      {/* Create Workplace Form */}
      <form onSubmit={handleCreateWorkplace} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px' }}>
        <h3>Create New Workplace</h3>
        <div>
          <label htmlFor="wp-name">Name: </label>
          <input
            id="wp-name"
            type="text"
            value={newWorkplaceName}
            onChange={(e) => setNewWorkplaceName(e.target.value)}
            required
            disabled={isCreating}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label htmlFor="wp-desc">Description: </label>
          <input
            id="wp-desc"
            type="text"
            value={newWorkplaceDescription}
            onChange={(e) => setNewWorkplaceDescription(e.target.value)}
            disabled={isCreating}
          />
        </div>
        <button type="submit" disabled={isCreating || !newWorkplaceName} style={{ marginTop: '10px' }}>
          {isCreating ? 'Creating...' : 'Create & Select Workplace'}
        </button>
      </form>

      {/* Display Error */}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* List Workplaces */}
      <h3>Existing Workplaces</h3>
      {isLoadingList ? (
        <p>Loading workplaces...</p>
      ) : workplaces.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {workplaces.map((wp) => (
            <li key={wp.workplaceID} style={{ border: '1px solid #eee', marginBottom: '10px', padding: '10px' }}>
              <div>
                <strong>{wp.name}</strong>
                {selectedWorkplace?.id === wp.workplaceID && <span style={{ marginLeft: '10px', fontWeight: 'bold', color: 'green' }}>(Selected)</span>}
              </div>
              <div style={{ fontSize: '0.9em', color: '#555' }}>{wp.description}</div>
              <div style={{ fontSize: '0.8em', color: '#888' }}>ID: {wp.workplaceID}</div>
              {selectedWorkplace?.id !== wp.workplaceID && (
                <button
                  onClick={() => setSelectedWorkplace({ id: wp.workplaceID, name: wp.name })}
                  style={{ marginTop: '5px' }}
                  disabled={isCreating}
                >
                  Select
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No workplaces found. Create one above.</p>
      )}
    </div>
  );
};

export default WorkplaceManager; 