import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../context/AuthContext';
import { apiGetWorkplaces, apiCreateWorkplace } from '../services/api';
import type { Workplace } from '../types';

interface WorkplaceSelectorModalProps {
  onClose: () => void; // Function to close the modal
}

const WorkplaceSelectorModal: React.FC<WorkplaceSelectorModalProps> = ({ onClose }) => {
  const { token, selectedWorkplace, setSelectedWorkplace } = useAuth();
  const navigate = useNavigate(); // Hook for navigation
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const [newWorkplaceName, setNewWorkplaceName] = useState('');
  const [newWorkplaceDescription, setNewWorkplaceDescription] = useState('');
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false); // State to toggle form visibility

  const fetchWorkplaces = async () => {
    if (!token) return;
    setIsLoadingList(true);
    setError(null);
    try {
      const data = await apiGetWorkplaces(token);
      setWorkplaces(data.workplaces || []);
      // No auto-selection logic needed here anymore?
    } catch (err: any) {
      console.error('Fetch workplaces error:', err);
      setError(err.message || 'Failed to fetch workplaces');
      setWorkplaces([]);
    } finally {
      setIsLoadingList(false);
    }
  };

  // Handle selecting an existing workplace
  const handleSelectWorkplace = (wp: Workplace) => {
    setSelectedWorkplace({ id: wp.workplaceID, name: wp.name });
    onClose(); // Close modal
    navigate('/journals'); // Navigate to journals page
  };

  // Handle creating a new workplace
  const handleCreateWorkplace = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || !newWorkplaceName) return;
    setIsCreating(true);
    setError(null);
    try {
      const createdWorkplace = await apiCreateWorkplace(
        { name: newWorkplaceName, description: newWorkplaceDescription },
        token
      );
      setNewWorkplaceName('');
      setNewWorkplaceDescription('');
      setSelectedWorkplace({ // Select the newly created one
        id: createdWorkplace.workplaceID,
        name: createdWorkplace.name,
      });
      setShowCreateForm(false); // Hide form on success
      onClose(); // Close modal
      navigate('/journals'); // Navigate to journals page
      // No need to fetchWorkplaces here as the modal is closing
    } catch (err: any) {
      console.error('Create workplace error:', err);
      setError(err.message || 'Failed to create workplace');
    } finally {
      setIsCreating(false);
    }
  };

  // Fetch workplaces when the modal is opened (token is available)
  useEffect(() => {
    if (token) {
      fetchWorkplaces();
    }
  }, [token]); // Only depends on token

  // --- Render Logic --- 
  return (
    <div>
      {/* Conditionally render Create Form */}
      {showCreateForm ? (
        <form onSubmit={handleCreateWorkplace} style={{ marginBottom: '20px', borderBottom: '1px solid #444', paddingBottom: '15px' }}>
          <h4>Create New Workplace</h4>
          <div>
            <label htmlFor="modal-wp-name">Name: </label>
            <input
              id="modal-wp-name"
              type="text"
              value={newWorkplaceName}
              onChange={(e) => setNewWorkplaceName(e.target.value)}
              required
              disabled={isCreating}
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <label htmlFor="modal-wp-desc">Description: </label>
            <input
              id="modal-wp-desc"
              type="text"
              value={newWorkplaceDescription}
              onChange={(e) => setNewWorkplaceDescription(e.target.value)}
              disabled={isCreating}
            />
          </div>
          <div style={{ marginTop: '15px' }}> {/* Button container */}
            <button type="submit" disabled={isCreating || !newWorkplaceName} style={{ marginRight: '10px' }}>
              {isCreating ? 'Creating...' : 'Create & Select'}
            </button>
            <button type="button" onClick={() => setShowCreateForm(false)} disabled={isCreating}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        // Button to show the create form
        <div style={{ marginBottom: '20px', borderBottom: '1px solid #444', paddingBottom: '15px' }}>
          <button onClick={() => setShowCreateForm(true)}>
            Create New Workplace
          </button>
        </div>
      )}

      {error && !showCreateForm && <p style={{ color: 'red' }}>Error: {error}</p>} {/* Show list error only when form is hidden */}

      {/* List Existing Workplaces */}
      <h4>Select Existing Workplace</h4>
      {isLoadingList ? (
        <p>Loading...</p>
      ) : workplaces.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0, maxHeight: '30vh', overflowY: 'auto' }}>
          {workplaces.map((wp) => (
            <li key={wp.workplaceID} style={{ borderBottom: '1px solid #444', padding: '8px 0' }}>
              <div>
                <strong>{wp.name}</strong> {selectedWorkplace?.id === wp.workplaceID && ' (Current)'}
              </div>
              <div style={{ fontSize: '0.9em', color: '#ccc' }}>{wp.description}</div>
              {selectedWorkplace?.id !== wp.workplaceID && (
                <button
                  onClick={() => handleSelectWorkplace(wp)}
                  style={{ marginTop: '5px', padding: '3px 8px', fontSize: '0.9em' }}
                  disabled={isCreating || isLoadingList} // Also disable while loading list
                >
                  Select
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No existing workplaces found.</p>
      )}
    </div>
  );
};

export default WorkplaceSelectorModal; 