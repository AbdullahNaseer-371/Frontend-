import useAuth from "./useAuth";

const usePermissions = () => {
    const { user } = useAuth();

    const role = user?.role;

    const isAdmin = role === "Admin";
    const isManager = role === "Manager";
    const isEmployee = role === "Employee";

    // Permissions according to backend RBAC
    const canCreate = isAdmin || isManager;
    const canRead = isAdmin || isManager || isEmployee;
    const canUpdate = isAdmin || isManager;
    const canDelete = isAdmin;

    return {
        role,

        isAdmin,
        isManager,
        isEmployee,

        canCreate,
        canRead,
        canUpdate,
        canDelete,
    };
};

export default usePermissions;