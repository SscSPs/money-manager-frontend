import './App.css'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import { useAuth } from './context/AuthContext'

// Remove ProtectedRoute - Home will handle auth check internally
// const ProtectedRoute = () => {
//   const { token } = useAuth();
//   return token ? <Outlet /> : <Navigate to="/login" replace />;
// };

// Keep PublicRoute for /login to redirect if already logged in
const PublicRoute = () => {
  const { token } = useAuth();
  return !token ? <Outlet /> : <Navigate to="/" replace />;
};

function App() {
  return (
    <div className="App">
      <h1>Money Manager</h1> {/* Add a general title */}
      <Routes>
        {/* Public Route: /login - Redirects to / if logged in */}
        <Route path="/login" element={<PublicRoute />}>
          <Route index element={<Login />} />
        </Route>

        {/* Main Route: / - Renders Home which handles auth state */}
        <Route path="/" element={<Home />} />

        {/* Optional: Add a 404 Not Found route */}
        {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
      </Routes>
    </div>
  )
}

export default App
