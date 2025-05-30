import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // If user is logged in, redirect from public routes (like login) to profile
  if (token) {
    return <Navigate to="/profile" replace />;
  }

  // Otherwise show the public page
  return children;
};

export default PublicRoute;
