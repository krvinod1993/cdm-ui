import { Navigate } from 'react-router-dom';

function AuthGuard({ children }) {
  const token = localStorage.getItem('access_token');

  if (!token) {
    return <Navigate to="/dealer/login" replace />;
  }

  return children;
}

export default AuthGuard;
