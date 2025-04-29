import type { Journal, Transaction } from '../types';

/**
 * Calculates the total debits and credits for a journal's transactions.
 * Handles amount parsing from string to number.
 * 
 * @param transactions - An array of Transaction objects.
 * @returns An object containing totalDebit, totalCredit, and isBalanced boolean.
 */
export const calculateJournalBalance = (
  transactions: Transaction[]
): { totalDebit: number; totalCredit: number; isBalanced: boolean } => {
  let totalDebit = 0;
  let totalCredit = 0;

  for (const txn of transactions) {
    // Attempt to parse the amount string to a number
    const amount = parseFloat(txn.amount);

    // If parsing fails or results in NaN, treat amount as 0 for this transaction
    if (isNaN(amount)) {
      console.warn(`Invalid amount found for transaction ${txn.transactionID}: ${txn.amount}`);
      continue; // Skip this transaction in balance calculation
    }

    if (txn.transactionType === 'DEBIT') {
      totalDebit += amount;
    } else if (txn.transactionType === 'CREDIT') {
      totalCredit += amount;
    }
  }

  // Use a tolerance for floating-point comparisons if necessary, 
  // but for simple addition/subtraction it might be okay.
  // Example tolerance: const tolerance = 0.00001;
  // const isBalanced = Math.abs(totalDebit - totalCredit) < tolerance;
  const isBalanced = totalDebit === totalCredit;

  return {
    totalDebit,
    totalCredit,
    isBalanced,
  };
}; 