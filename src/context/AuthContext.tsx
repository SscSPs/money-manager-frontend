import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Attempt to load token from localStorage on initial load
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken); // Persist token
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('authToken'); // Remove token from storage
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
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