import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleRoute({ children, role }) {
    const { user, isLoggedIn } = useAuth();
    const location = useLocation();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (user?.role !== role) {
        return <Navigate to="/jobs" replace />;
    }

    return children;
}

export default RoleRoute;