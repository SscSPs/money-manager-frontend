// src/types/index.ts

// Authentication & User Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface UserDetails {
  userID: string;
  name: string;
  createdAt?: string; // Added optional fields based on previous context
  createdBy?: string;
  lastUpdatedAt?: string;
  lastUpdatedBy?: string;
}

// Decoded JWT Payload (If needed globally, otherwise keep in AuthContext)
export interface DecodedToken {
  sub: string; // Subject (user ID)
  exp: number; // Expiration time
  // Add other claims if needed
}

// Workplace Types
export interface Workplace {
  workplaceID: string;
  name: string;
  description: string;
  createdAt: string;
  createdBy: string;
  lastUpdatedAt: string;
  lastUpdatedBy: string;
}

export interface CreateWorkplacePayload {
  name: string;
  description?: string;
}

// Journal & Transaction Types
export interface Transaction {
  transactionID: string;
  journalID: string;
  accountID: string;
  amount: string;
  transactionType: 'DEBIT' | 'CREDIT';
  currencyCode: string;
  notes: string;
  createdAt: string;
  createdBy: string;
}

export interface Journal {
  journalID: string;
  workplaceID: string;
  date: string;
  description: string;
  currencyCode: string;
  transactions: Transaction[];
  createdAt: string;
  createdBy: string;
  lastUpdatedAt: string;
  lastUpdatedBy: string;
} 