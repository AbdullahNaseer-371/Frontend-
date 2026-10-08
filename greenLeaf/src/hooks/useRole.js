import useAuth from "./useAuth";

const useRole = () => {
    const { user } = useAuth();

    const role = user?.role;

    return {
        role,

        isAdmin: role === "Admin",
        isManager: role === "Manager",
        isEmployee: role === "Employee",
    };
};

export default useRole;