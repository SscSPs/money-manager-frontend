import React from 'react';
import type { Journal, Transaction } from '../types';
import { calculateJournalBalance } from '../utils/journalUtils';

interface JournalDetailsProps {
  journal: Journal; // Expect the full journal object
  onDeselect: () => void; // Callback to clear selection
}

const JournalDetails: React.FC<JournalDetailsProps> = ({ journal, onDeselect }) => {
  // Calculate balance for the detailed journal
  const { totalDebit, totalCredit, isBalanced } = calculateJournalBalance(journal.transactions);

  const detailItemStyle: React.CSSProperties = {
    marginBottom: '5px',
  };

  const transactionListStyle: React.CSSProperties = {
    marginTop: '15px',
    paddingTop: '10px',
    borderTop: '1px solid #3a3a3a',
  };

  const transactionItemStyle: React.CSSProperties = {
     marginBottom: '10px',
     paddingBottom: '10px',
     borderBottom: '1px dotted #555',
  };

  return (
    <div>
      <button onClick={onDeselect} style={{ float: 'right', marginBottom: '10px' }}>Close</button>
      <h3>Journal Details: {journal.journalID}</h3>
      <div style={detailItemStyle}><strong>Description:</strong> {journal.description || 'N/A'}</div>
      <div style={detailItemStyle}><strong>Date:</strong> {new Date(journal.date).toLocaleDateString()}</div>
      <div style={detailItemStyle}><strong>Currency:</strong> {journal.currencyCode}</div>
      <div style={detailItemStyle}>
        <strong>Status:</strong>
        <span style={{ marginLeft: '5px', color: isBalanced ? 'lightgreen' : 'orange', fontWeight: 'bold' }}>
          {isBalanced ? 'Balanced' : 'Unbalanced'}
        </span>
        <span> (D: {totalDebit.toFixed(2)} / C: {totalCredit.toFixed(2)})</span>
      </div>
      <div style={detailItemStyle}><strong>Created:</strong> {new Date(journal.createdAt).toLocaleString()} by {journal.createdBy}</div>
      <div style={detailItemStyle}><strong>Last Updated:</strong> {new Date(journal.lastUpdatedAt).toLocaleString()} by {journal.lastUpdatedBy}</div>

      <div style={transactionListStyle}>
        <h4>Transactions ({journal.transactions.length})</h4>
        {journal.transactions.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {journal.transactions.map((txn: Transaction) => (
              <li key={txn.transactionID} style={transactionItemStyle}>
                <div><strong>Account:</strong> {txn.accountID}</div>
                <div><strong>Type:</strong> <span style={{ color: txn.transactionType === 'DEBIT' ? 'orange' : 'lightgreen' }}>{txn.transactionType}</span></div>
                <div><strong>Amount:</strong> {txn.amount} {txn.currencyCode}</div>
                {txn.notes && <div><strong>Notes:</strong> {txn.notes}</div>}
                <div style={{ fontSize: '0.8em', color: '#aaa' }}>ID: {txn.transactionID}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No transactions found for this journal.</p>
        )}
      </div>
    </div>
  );
};

export default JournalDetails; 