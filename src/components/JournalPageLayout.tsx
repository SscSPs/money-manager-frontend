import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { apiGetJournals } from '../services/api';
import type { Journal } from '../types';
import JournalList from './JournalList'; // We'll create this next
import JournalDetails from './JournalDetails'; // We'll create this next

const JournalPageLayout: React.FC = () => {
  const { token, selectedWorkplace } = useAuth();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const limit = 20; // Keep pagination

  const fetchJournals = async (currentOffset: number) => {
    if (!token || !selectedWorkplace?.id) {
      setJournals([]);
      setError('No workplace selected.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiGetJournals(selectedWorkplace.id, token, limit, currentOffset);
      const journalsWithGuaranteedTransactions = (data.journals || []).map(j => ({ ...j, transactions: j.transactions || [] }));
      setJournals(journalsWithGuaranteedTransactions);
    } catch (err: any) {
      console.error('Fetch journals error:', err);
      setError(err.message || 'Failed to fetch journals');
      setJournals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setOffset(0);
    setSelectedJournalId(null); // Clear selection when workplace changes
    if (selectedWorkplace?.id) {
      fetchJournals(0);
    } else {
      setJournals([]);
      setError('No workplace selected.');
    }
  }, [token, selectedWorkplace?.id]);

  const handleSelectJournal = (journalId: string) => {
    setSelectedJournalId(journalId);
  };

  const handleDeselectJournal = () => {
    setSelectedJournalId(null);
  };

  // Pagination Handlers
  const handleNext = () => {
    const nextOffset = offset + limit;
    setOffset(nextOffset);
    setSelectedJournalId(null); // Clear selection on page change
    fetchJournals(nextOffset);
  };

  const handlePrevious = () => {
    const previousOffset = Math.max(0, offset - limit);
    setOffset(previousOffset);
    setSelectedJournalId(null); // Clear selection on page change
    fetchJournals(previousOffset);
  };

  // Find the full selected journal object
  const selectedJournal = journals.find(j => j.journalID === selectedJournalId);

  // --- Render Logic --- 
  if (!selectedWorkplace) {
    return (
      <div>
        <h2>Journals</h2>
        <p>Please <Link to="/workplaces">select a workplace</Link> first.</p>
      </div>
    );
  }

  const layoutStyle: React.CSSProperties = {
    display: 'flex',
    height: 'calc(100vh - 100px)', // Adjust height based on Navbar height + padding
  };

  const listPaneStyle: React.CSSProperties = {
    flex: '0 0 300px', // Fixed width for the list pane
    borderRight: '1px solid #3a3a3a',
    padding: '10px',
    overflowY: 'auto',
  };

  const detailPaneStyle: React.CSSProperties = {
    flex: '1 1 auto', // Takes remaining space
    padding: '10px',
    overflowY: 'auto',
  };

  return (
    <div>
      {/* Title could be dynamic based on selection */}
      <h2>
        Journals for {selectedWorkplace.name}
        {selectedJournalId && ' > ' + selectedJournalId}
      </h2>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div style={layoutStyle}>
        {/* Left Pane */}
        <div style={listPaneStyle}>
          {selectedJournal ? (
            // Show list when a journal is selected
            <JournalList
              journals={journals}
              selectedJournalId={selectedJournalId}
              onSelectJournal={handleSelectJournal}
              isLoading={isLoading} // Pass loading state
            />
          ) : (
            // Show workplace info when no journal is selected
            <div>
              <h3>Workplace</h3>
              <p><strong>{selectedWorkplace.name}</strong></p>
              <p>({selectedWorkplace.id})</p>
              {/* Add more workplace details if needed */}
            </div>
          )}
        </div>

        {/* Right Pane */}
        <div style={detailPaneStyle}>
          {selectedJournal ? (
            // Show details when a journal is selected
            <JournalDetails journal={selectedJournal} onDeselect={handleDeselectJournal} />
          ) : (
            // Show list when no journal is selected
            <>
              <h3>Journals List</h3>
              <JournalList
                journals={journals}
                selectedJournalId={selectedJournalId} // Will be null here
                onSelectJournal={handleSelectJournal}
                isLoading={isLoading}
              />
              {/* Pagination Controls (only shown when list is in right pane) */}
              {!isLoading && journals.length > 0 && (
                 <div style={{ marginTop: '20px' }}>
                   <button onClick={handlePrevious} disabled={offset === 0 || isLoading}>
                     Previous
                   </button>
                   <span style={{ margin: '0 10px' }}>Page {offset / limit + 1}</span>
                   <button onClick={handleNext} disabled={journals.length < limit || isLoading}>
                     Next
                   </button>
                 </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalPageLayout; 