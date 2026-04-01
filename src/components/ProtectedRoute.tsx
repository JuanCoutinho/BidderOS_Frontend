import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!user.gemini_api_key && location.pathname !== '/onboarding' && sessionStorage.getItem('skip_onboarding') !== 'true') {
        return <Navigate to="/onboarding" replace />;
    }

    return <>{children}</>;
}
