import { useEffect } from "react";
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
        users,
        loading,
        error,
        fetchUsers,
        removeUser,
        clearError,
    } = useAuth();

    const {
        isAdmin,
    } = usePermissions();

    useEffect(() => {
        fetchUsers();
    }, []);

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

        await removeUser(id);
        fetchUsers();
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
                                        <td
                                            colSpan="4"
                                            className="text-center py-5"
                                        >
                                            <Spinner />
                                        </td>
                                    </tr>
                                ) : users?.length ? (
                                    users.map(
                                        (user, index) => (
                                            <tr key={user._id}>

                                                <td>
                                                    {index + 1}
                                                </td>

                                                <td>
                                                    <strong>
                                                        {user.userName}
                                                    </strong>
                                                </td>

                                                <td>

                                                    <Badge
                                                        bg={
                                                            user.role ===
                                                                "Admin"
                                                                ? "danger"
                                                                : user.role ===
                                                                    "Manager"
                                                                    ? "warning"
                                                                    : "secondary"
                                                        }
                                                    >
                                                        {user.role}
                                                    </Badge>

                                                </td>

                                                <td>

                                                    <Button
                                                        size="sm"
                                                        variant="outline-primary"
                                                        className="me-2"
                                                        disabled
                                                    >
                                                        <FaEdit />
                                                    </Button>

                                                    <Button
                                                        size="sm"
                                                        variant="outline-danger"
                                                        onClick={() =>
                                                            handleDelete(
                                                                user._id
                                                            )
                                                        }
                                                    >
                                                        <FaTrash />
                                                    </Button>

                                                </td>

                                            </tr>
                                        )
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="text-center py-5"
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