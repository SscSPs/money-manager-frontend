import React from 'react';
import type { Journal } from '../types';
import { calculateJournalBalance } from '../utils/journalUtils';

interface JournalListProps {
  journals: Journal[];
  selectedJournalId: string | null;
  onSelectJournal: (journalId: string) => void;
  isLoading: boolean;
}

const JournalList: React.FC<JournalListProps> = ({ journals, selectedJournalId, onSelectJournal, isLoading }) => {

  const listItemStyle = (journalID: string): React.CSSProperties => ({
    border: '1px solid #eee',
    marginBottom: '10px',
    padding: '10px',
    cursor: 'pointer',
    backgroundColor: selectedJournalId === journalID ? '#3a3a3a' : 'transparent',
    transition: 'background-color 0.2s ease',
  });

  const hoverStyle = (e: React.MouseEvent<HTMLLIElement>, isSelected: boolean) => {
    if (!isSelected) {
      e.currentTarget.style.backgroundColor = '#2a2a2a';
    }
  };

  const leaveStyle = (e: React.MouseEvent<HTMLLIElement>, isSelected: boolean) => {
    if (!isSelected) {
      e.currentTarget.style.backgroundColor = 'transparent';
    }
  };

  if (isLoading) {
    return <p>Loading journals...</p>;
  }

  if (journals.length === 0) {
    return <p>No journals found.</p>;
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {journals.map((journal) => {
        const isSelected = selectedJournalId === journal.journalID;
        const { isBalanced, totalDebit } = calculateJournalBalance(journal.transactions);
        return (
          <li
            key={journal.journalID}
            style={listItemStyle(journal.journalID)}
            onClick={() => onSelectJournal(journal.journalID)}
            onMouseEnter={(e) => hoverStyle(e, isSelected)}
            onMouseLeave={(e) => leaveStyle(e, isSelected)}
          >
            <div>
              <strong>ID:</strong> {journal.journalID}
              <span style={{ marginLeft: '10px', color: isBalanced ? 'lightgreen' : 'orange', fontWeight: 'bold' }}>
                {isBalanced ? `[Balanced: ${totalDebit.toFixed(2)}]` : '[Unbalanced]'}
              </span>
            </div>
            <div>{journal.description || 'No description'}</div>
            <div style={{ fontSize: '0.8em', color: '#aaa' }}>
              {new Date(journal.date).toLocaleDateString()} - {journal.transactions.length} txn(s)
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default JournalList; 