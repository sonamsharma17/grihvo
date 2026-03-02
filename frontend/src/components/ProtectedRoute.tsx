import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'consumer' | 'admin' | 'superadmin';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    // Check if user is authenticated
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has required role
    if (requiredRole && userRole !== requiredRole && userRole !== 'superadmin') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
