// src/services/api.ts

// Export type definitions
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
  // ... other fields
}

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

// Export Transaction interface
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
  transactions: Transaction[]; // Now uses the exported Transaction type
  createdAt: string;
  createdBy: string;
  lastUpdatedAt: string;
  lastUpdatedBy: string;
}

// --- API Service --- 

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  console.error("VITE_API_BASE_URL is not defined. Please check your .env file and restart the server.");
}

// Helper function for making authenticated requests
async function fetchAuthenticated(endpoint: string, token: string, options: RequestInit = {}): Promise<Response> {
  // Initialize headers with required authenticated headers
  const baseHeaders: HeadersInit = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  // Add Content-Type for JSON body if applicable
  if (options.body && !(options.body instanceof FormData)) {
    baseHeaders['Content-Type'] = 'application/json';
  }

  // Merge with any headers provided in options, potentially overwriting base headers if needed
  const finalHeaders = new Headers(baseHeaders);
  if (options.headers) {
    const customHeaders = new Headers(options.headers);
    customHeaders.forEach((value, key) => {
      finalHeaders.set(key, value);
    });
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: finalHeaders,
  });

  if (!response.ok) {
    // Attempt to parse error details from the response body
    let errorBody = null;
    try {
      errorBody = await response.json();
    } catch (e) {
      // Ignore if response body is not valid JSON
    }
    const errorMessage = errorBody?.message || `API error: ${response.status} ${response.statusText}`;
    console.error(`API Error on ${endpoint}:`, errorBody || response.statusText);
    // Throw an error object that includes status and parsed body if possible
    const error = new Error(errorMessage) as any;
    error.status = response.status;
    error.body = errorBody;
    throw error;
  }

  return response;
}

// --- Exported API Functions --- 

export const apiLogin = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    let errorBody = null;
    try {
      errorBody = await response.json();
    } catch (e) {}
    const errorMessage = errorBody?.message || `Login failed: ${response.statusText}`;
    const error = new Error(errorMessage) as any;
    error.status = response.status;
    error.body = errorBody;
    throw error;
  }

  return response.json();
};

export const apiGetUserDetails = async (userId: string, token: string): Promise<UserDetails> => {
  const response = await fetchAuthenticated(`/users/${userId}`, token);
  return response.json();
};

export const apiGetWorkplaces = async (token: string): Promise<{ workplaces: Workplace[] }> => {
  const response = await fetchAuthenticated(`/workplaces`, token);
  return response.json();
};

export const apiCreateWorkplace = async (payload: CreateWorkplacePayload, token: string): Promise<Workplace> => {
  const response = await fetchAuthenticated(`/workplaces`, token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response.json();
};

export const apiGetJournals = async (workplaceId: string, token: string, limit: number, offset: number): Promise<{ journals: Journal[] }> => {
  const response = await fetchAuthenticated(`/workplaces/${workplaceId}/journals?limit=${limit}&offset=${offset}`, token);
  return response.json();
}; 