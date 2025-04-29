import './App.css'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import WorkplaceManager from './components/WorkplaceManager'
// import JournalManager from './components/JournalManager' // Remove old import
import JournalPageLayout from './components/JournalPageLayout' // Import new layout
import Navbar from './components/Navbar'
import { useAuth } from './context/AuthContext'

// Re-introduce ProtectedRoute
const ProtectedRoute = () => {
  const { token, isLoading } = useAuth(); // Use isLoading from context if needed

  // Optional: Add loading state check if context is still initializing
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

// Keep PublicRoute for /login to redirect if already logged in
const PublicRoute = () => {
  const { token, isLoading } = useAuth();
  // If checking auth status, redirect immediately if token exists
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return !token ? <Outlet /> : <Navigate to="/" replace />;
};

function App() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '0 20px' }}>
        <Routes>
          {/* Public Route: /login - Redirects to / if logged in */}
          <Route path="/login" element={<PublicRoute />}>
            <Route index element={<Login />} />
          </Route>

          {/* Protected Routes - Require Login */}
          <Route element={<ProtectedRoute />}>
            {/* Main Route: / - Renders Home */}
            <Route path="/" element={<Home />} />
            {/* Workplace Management Route */}
            <Route path="/workplaces" element={<WorkplaceManager />} />
            {/* Update journal route to use JournalPageLayout */}
            <Route path="/journals" element={<JournalPageLayout />} />
            {/* Add other protected routes here */}
          </Route>

          {/* Optional: Add a 404 Not Found route */}
          {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
        </Routes>
      </div>
    </div>
  )
}

export default App
