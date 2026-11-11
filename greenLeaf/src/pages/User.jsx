
import { useEffect, useMemo } from "react";

import {
    Alert,
    Badge,
    Button,
    Card,
    Container,
    Spinner,
    Table,
} from "react-bootstrap";

import {
    FaEdit,
    FaTrash,
} from "react-icons/fa";

import useAuth from "../hooks/useAuth";
import usePermissions from "../hooks/usePermission";

const Users = () => {
    const {
        users: usersData,
        loading,
        error,
        fetchUsers,
        removeUser,
        clearError,
    } = useAuth();

    const { isAdmin } = usePermissions();

    // Normalize API/Redux response into an array.
    const users = useMemo(() => {
        if (Array.isArray(usersData)) {
            return usersData;
        }

        if (Array.isArray(usersData?.users)) {
            return usersData.users;
        }

        if (Array.isArray(usersData?.data?.users)) {
            return usersData.data.users;
        }

        if (Array.isArray(usersData?.data)) {
            return usersData.data;
        }

        return [];
    }, [usersData]);

    useEffect(() => {
        if (isAdmin) {
            fetchUsers();
        }
    }, [isAdmin]);

    if (!isAdmin) {
        return (
            <Container fluid className="dashboard-page">
                <Alert variant="danger">
                    You are not authorized to access this page.
                </Alert>
            </Container>
        );
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this user?")) return;

        try {
            await removeUser(id);
            await fetchUsers();
        } catch (err) {
            console.error("Failed to delete user:", err);
        }
    };

    return (
        <Container fluid className="dashboard-page">

            <div className="mb-4">
                <h2>Users</h2>

                <p className="text-muted mb-0">
                    Manage GreenLeaf staff accounts.
                </p>
            </div>

            {error && (
                <Alert
                    variant="danger"
                    dismissible
                    onClose={clearError}
                >
                    {error}
                </Alert>
            )}

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">

                    <div className="table-responsive">
                        <Table
                            hover
                            responsive
                            className="mb-0 align-middle"
                        >

                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Username</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5">
                                            <Spinner animation="border" />
                                            <div className="mt-2">
                                                Loading users...
                                            </div>
                                        </td>
                                    </tr>
                                ) : users.length > 0 ? (
                                    users.map((user, index) => (
                                        <tr key={user._id}>

                                            <td>{index + 1}</td>

                                            <td>
                                                <strong>
                                                    {user.userName || "N/A"}
                                                </strong>
                                            </td>

                                            <td>
                                                <Badge
                                                    bg={
                                                        user.role === "Admin"
                                                            ? "danger"
                                                            : user.role === "Manager"
                                                                ? "warning"
                                                                : "secondary"
                                                    }
                                                >
                                                    {user.role || "Employee"}
                                                </Badge>
                                            </td>

                                            <td>
                                                <Button
                                                    size="sm"
                                                    variant="outline-primary"
                                                    className="me-2"
                                                    disabled
                                                    title="Edit user"
                                                >
                                                    <FaEdit />
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    onClick={() => handleDelete(user._id)}
                                                    title="Delete user"
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="text-center py-5 text-muted"
                                        >
                                            No users found.
                                        </td>
                                    </tr>
                                )}

                            </tbody>
                        </Table>
                    </div>

                </Card.Body>
            </Card>

        </Container>
    );
};

export default Users;
