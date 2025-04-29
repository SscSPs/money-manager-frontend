import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
// Import types from types, API functions from services
import { apiGetJournals } from '../services/api';
import type { Journal, Transaction } from '../types';

// Remove import of types from services if they existed
// import { Journal, Transaction, apiGetJournals } from '../services/api';

const JournalManager: React.FC = () => {
  const { token, selectedWorkplaceId } = useAuth();
  // Use imported Journal type
  const [journals, setJournals] = useState<Journal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [expandedJournalId, setExpandedJournalId] = useState<string | null>(null);

  const fetchJournals = async (currentOffset: number) => {
    if (!token || !selectedWorkplaceId) {
      setJournals([]);
      setError('No workplace selected.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Use apiGetJournals service function
      const data = await apiGetJournals(selectedWorkplaceId, token, limit, currentOffset);
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
    setExpandedJournalId(null);
    fetchJournals(0);
  }, [token, selectedWorkplaceId]);

  // Handlers for pagination
  const handleNext = () => {
    const nextOffset = offset + limit;
    setOffset(nextOffset);
    setExpandedJournalId(null); // Collapse all on page change
    fetchJournals(nextOffset);
  };

  const handlePrevious = () => {
    const previousOffset = Math.max(0, offset - limit);
    setOffset(previousOffset);
    setExpandedJournalId(null); // Collapse all on page change
    fetchJournals(previousOffset);
  };

  // Toggle expanded state for a journal
  const toggleExpand = (journalID: string) => {
    setExpandedJournalId(prevId => (prevId === journalID ? null : journalID));
  };

  // Render logic
  if (!selectedWorkplaceId) {
    return (
      <div>
        <h2>Journals</h2>
        <p>Please <Link to="/workplaces">select a workplace</Link> first.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Journals for Workplace: {selectedWorkplaceId}</h2>

      {/* TODO: Add Journal Creation Form here later */}

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <h3>Existing Journals</h3>
      {isLoading ? (
        <p>Loading journals...</p>
      ) : journals.length > 0 ? (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {journals.map((journal) => {
              const isExpanded = expandedJournalId === journal.journalID;
              return (
                <li key={journal.journalID} style={{ border: '1px solid #eee', marginBottom: '10px', padding: '10px' }}>
                  <div onClick={() => toggleExpand(journal.journalID)} style={{ cursor: 'pointer' }}>
                    <div><strong>ID:</strong> {journal.journalID} {isExpanded ? '[-]' : '[+]'}</div>
                    <div><strong>Description:</strong> {journal.description}</div>
                    <div><strong>Date:</strong> {new Date(journal.date).toLocaleDateString()}</div>
                    <div><strong>Currency:</strong> {journal.currencyCode}</div>
                    <div><strong>Transactions:</strong> {journal.transactions.length}</div>
                  </div>
                  {/* Collapsible Transaction List */}
                  {isExpanded && (
                    <div style={{ marginTop: '10px', marginLeft: '20px', borderLeft: '2px solid #ccc', paddingLeft: '10px' }}>
                      <h4>Transactions:</h4>
                      {journal.transactions.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                          {/* Use imported Transaction type if needed for type checking 'txn' */}
                          {journal.transactions.map((txn: Transaction) => (
                            <li key={txn.transactionID} style={{ marginBottom: '5px', borderBottom: '1px dotted #eee', paddingBottom: '5px' }}>
                              <div><strong>Account:</strong> {txn.accountID}</div>
                              <div><strong>Type:</strong> {txn.transactionType}</div>
                              <div><strong>Amount:</strong> {txn.amount} {txn.currencyCode}</div>
                              {txn.notes && <div><strong>Notes:</strong> {txn.notes}</div>}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No transactions found for this journal.</p>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          {/* Basic Pagination */}
          <div style={{ marginTop: '20px' }}>
            <button onClick={handlePrevious} disabled={offset === 0 || isLoading}>
              Previous
            </button>
            <span style={{ margin: '0 10px' }}>Page {offset / limit + 1}</span>
            <button onClick={handleNext} disabled={journals.length < limit || isLoading}>
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No journals found for this workplace.</p>
      )}
    </div>
  );
};

export default JournalManager; 