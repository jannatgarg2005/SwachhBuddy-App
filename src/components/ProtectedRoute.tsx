import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

interface ProtectedRouteProps {
    children: ReactNode;
    requireAuth?: boolean;
}

export const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
    const { user, userData, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground text-sm">Loading Swachh Buddy...</p>
                </div>
            </div>
        );
    }

    if (requireAuth && !user) {
        return <Navigate to="/login" replace />;
    }

    if (!requireAuth && user) {
        // Route based on role — employee → corporate, citizen/default → enduser
        if (userData?.role === 'municipal-employee') {
    return <Navigate to="/dashboard/enduser" replace />;
}
    return <Navigate to="/dashboard/corporate" replace />;
    }

    return <>{children}</>;
};
