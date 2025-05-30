// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // Not logged in, redirect to home/login page
    return <Navigate to="/" replace />;
  }

  // Otherwise show protected page
  return children;
};

export default ProtectedRoute;
