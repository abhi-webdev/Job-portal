import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    console.log('❌ NO USER → LOGIN');
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    console.log('❌ NOT ADMIN → HOME');
    return <Navigate to="/" replace />;
  }
  console.log('✅ ADMIN AUTHENTICATED');
  return <Outlet />;
};

export default AdminRoute;
