import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode
import { apiGetUserDetails } from '../services/api'; // Import apiGetUserDetails

// Define the expected structure of the decoded JWT payload
interface DecodedToken {
  sub: string; // Subject (user ID)
  exp: number; // Expiration time
  // Add other claims if needed (e.g., username, roles)
}

// Define the structure for user details from the API
interface UserDetails {
  userID: string;
  name: string;
  createdAt?: string; // Optional fields
  createdBy?: string;
  lastUpdatedAt?: string;
  lastUpdatedBy?: string;
}

interface AuthContextType {
  token: string | null;
  userId: string | null; // Add userId state
  userName: string | null; // Add userName state
  isLoading: boolean; // Add loading state for user details fetch
  selectedWorkplaceId: string | null; // Add selectedWorkplaceId state
  login: (token: string) => void;
  logout: () => void;
  setSelectedWorkplace: (workplaceId: string) => void; // Add function to set workplace
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Key for localStorage
const AUTH_TOKEN_KEY = 'authToken';
const SELECTED_WORKPLACE_KEY = 'selectedWorkplaceId';

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to decode token and get userId
const getUserIdFromToken = (token: string | null): string | null => {
  if (!token) return null;
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    // Optional: Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      console.warn('Token expired');
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(SELECTED_WORKPLACE_KEY); // Clear selected workplace on token expiry
      return null;
    }
    return decoded.sub; // Return user ID from subject claim
  } catch (error) {
    console.error('Failed to decode token:', error);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(SELECTED_WORKPLACE_KEY); // Clear selected workplace on token error
    return null;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem(AUTH_TOKEN_KEY));
  // Initialize userId based on token from localStorage
  const [userId, setUserId] = useState<string | null>(() => getUserIdFromToken(token));
  const [userName, setUserName] = useState<string | null>(null); // State for user name
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  // Load selected workplace from localStorage on initial load
  const [selectedWorkplaceId, setSelectedWorkplaceIdState] = useState<string | null>(
    localStorage.getItem(SELECTED_WORKPLACE_KEY)
  );

  // Effect to fetch user details when userId is available and valid
  useEffect(() => {
    const fetchAndSetUserDetails = async () => {
      const currentToken = localStorage.getItem(AUTH_TOKEN_KEY); // Get current token
      const currentUserId = getUserIdFromToken(currentToken);
      setUserId(currentUserId);

      if (currentUserId && currentToken) {
        setIsLoading(true);
        setUserName(null);
        try {
          // Use the apiGetUserDetails service function
          const data = await apiGetUserDetails(currentUserId, currentToken);
          setUserName(data.name);
          console.log('User details fetched successfully:', data.name);
        } catch (error: any) {
          console.error('Error fetching user details:', error);
          setUserName(null);
          // If the error is an auth error (e.g., 401/403), consider logging out
          if (error.status === 401 || error.status === 403) {
             console.warn('Auth error fetching user details, logging out.');
             // We need to call logout, but logout is defined below.
             // This suggests a potential refactor might be needed,
             // but for now, we clear storage and state manually.
             localStorage.removeItem(AUTH_TOKEN_KEY);
             localStorage.removeItem(SELECTED_WORKPLACE_KEY);
             setToken(null); // This will trigger re-render
             setSelectedWorkplaceIdState(null);
             setUserId(null);
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        setUserName(null);
        setIsLoading(false); // Not logged in, stop loading
      }
    };

    fetchAndSetUserDetails();

  }, [token]); // Rerun effect when token changes

  const login = (newToken: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, newToken);
    setToken(newToken); // This triggers the useEffect to run
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(SELECTED_WORKPLACE_KEY);
    setToken(null);
    setSelectedWorkplaceIdState(null);
    setUserId(null); // Explicitly clear userId here too
    setUserName(null);
    // No need to set isLoading here, useEffect handles it when token becomes null
  };

  // Function to set and persist selected workplace
  const setSelectedWorkplace = (workplaceId: string) => {
    localStorage.setItem(SELECTED_WORKPLACE_KEY, workplaceId);
    setSelectedWorkplaceIdState(workplaceId);
  };

  return (
    // Provide userId, userName, and isLoading in the context value
    <AuthContext.Provider
      value={{
        token,
        userId,
        userName,
        isLoading,
        selectedWorkplaceId,
        login,
        logout,
        setSelectedWorkplace,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 