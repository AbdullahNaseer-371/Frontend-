import { Navigate, Outlet } from "react-router-dom";
import useRole from "../../hooks/useRole";

const RoleRoute = ({ allowedRoles }) => {
    const { role } = useRole();

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default RoleRoute;