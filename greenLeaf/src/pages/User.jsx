
// import { useState } from "react";

// import {
//     Alert,
//     Badge,
//     Button,
//     Card,
//     Col,
//     Container,
//     Form,
//     Modal,
//     Row,
//     Spinner,
//     Table,
// } from "react-bootstrap";

// import {
//     FaEdit,
//     FaPlus,
//     FaTrash,
//     FaUsers,
//     FaUser,
// } from "react-icons/fa";

// import useUser from "../hooks/useUser";

// const initialForm = {
//     userName: "",
//     email: "",
//     password: "",
//     role: "Employee",
// };

// const Users = () => {
//     const {
//         currentUser,
//         users,

//         isAdmin,
//         isManager,
//         isEmployee,

//         loading,
//         actionLoading,

//         error,
//         success,

//         createUser,
//         updateUser,
//         deleteUser,

//         clearMessages,
//     } = useUser();

//     const [showModal, setShowModal] = useState(false);
//     const [editingUser, setEditingUser] = useState(null);
//     const [formData, setFormData] = useState(initialForm);

//     const getRoleVariant = (role) => {
//         switch (role) {
//             case "Admin":
//                 return "danger";
//             case "Manager":
//                 return "warning";
//             case "Employee":
//                 return "success";
//             default:
//                 return "secondary";
//         }
//     };

//     const openAddModal = () => {
//         clearMessages();
//         setEditingUser(null);
//         setFormData(initialForm);
//         setShowModal(true);
//     };

//     const openEditModal = (item) => {
//         clearMessages();

//         setEditingUser(item);

//         setFormData({
//             userName: item.userName || "",
//             email: item.email || "",
//             password: "",
//             role: item.role || "Employee",
//         });

//         setShowModal(true);
//     };

//     const closeModal = () => {
//         setShowModal(false);
//         setEditingUser(null);
//         setFormData(initialForm);
//     };

//     const handleChange = (event) => {
//         const { name, value } = event.target;

//         setFormData((previous) => ({
//             ...previous,
//             [name]: value,
//         }));
//     };

//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         if (!isAdmin) return;

//         const payload = {
//             userName: formData.userName.trim(),
//         };

//         try {
//             if (editingUser) {
//                 payload.role = formData.role;

//                 if (formData.password.trim()) {
//                     payload.password = formData.password;
//                 }

//                 await updateUser(editingUser._id, payload);
//             } else {
//                 await createUser({
//                     ...payload,
//                     email: formData.email.trim(),
//                     password: formData.password,
//                     role: formData.role,
//                 });
//             }

//             closeModal();
//         } catch (err) {
//             // Error is stored and displayed by useUser.
//             console.error("User operation failed:", err);
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!isAdmin) return;

//         const confirmed = window.confirm(
//             "Are you sure you want to delete this user?"
//         );

//         if (!confirmed) return;

//         try {
//             await deleteUser(id);
//         } catch (err) {
//             console.error("Delete user failed:", err);
//         }
//     };

//     if (loading) {
//         return (
//             <Container className="py-5 text-center">
//                 <Spinner animation="border" />
//                 <p className="mt-2">Loading user information...</p>
//             </Container>
//         );
//     }

//     if (!currentUser) {
//         return (
//             <Container className="py-4">
//                 <Alert variant="danger">
//                     {error || "Unable to load your user profile."}
//                 </Alert>
//             </Container>
//         );
//     }

//     // Manager and Employee: own profile only.
//     if (isManager || isEmployee) {
//         return (
//             <Container fluid className="py-4">
//                 <Card className="border-0 shadow-sm">
//                     <Card.Header className="bg-white py-3">
//                         <h5 className="mb-0">
//                             <FaUser className="me-2" />
//                             My Profile
//                         </h5>
//                     </Card.Header>

//                     <Card.Body>
//                         {error && (
//                             <Alert variant="danger">
//                                 {error}
//                             </Alert>
//                         )}

//                         <Row className="g-3">
//                             <Col md={6}>
//                                 <Card className="h-100 border">
//                                     <Card.Body>
//                                         <small className="text-muted">
//                                             Username
//                                         </small>
//                                         <h6 className="mt-2 mb-0">
//                                             {currentUser.userName || "N/A"}
//                                         </h6>
//                                     </Card.Body>
//                                 </Card>
//                             </Col>

//                             <Col md={6}>
//                                 <Card className="h-100 border">
//                                     <Card.Body>
//                                         <small className="text-muted">
//                                             Email
//                                         </small>
//                                         <h6 className="mt-2 mb-0">
//                                             {currentUser.email || "N/A"}
//                                         </h6>
//                                     </Card.Body>
//                                 </Card>
//                             </Col>

//                             <Col md={6}>
//                                 <Card className="h-100 border">
//                                     <Card.Body>
//                                         <small className="text-muted">
//                                             Account Role
//                                         </small>

//                                         <div className="mt-2">
//                                             <Badge bg={getRoleVariant(currentUser.role)}>
//                                                 {currentUser.role}
//                                             </Badge>
//                                         </div>
//                                     </Card.Body>
//                                 </Card>
//                             </Col>

//                             <Col md={6}>
//                                 <Card className="h-100 border">
//                                     <Card.Body>
//                                         <small className="text-muted">
//                                             Account Created
//                                         </small>
//                                         <h6 className="mt-2 mb-0">
//                                             {currentUser.createdAt
//                                                 ? new Date(
//                                                     currentUser.createdAt
//                                                 ).toLocaleDateString()
//                                                 : "N/A"}
//                                         </h6>
//                                     </Card.Body>
//                                 </Card>
//                             </Col>
//                         </Row>

//                         <Alert variant="info" className="mt-4 mb-0">
//                             You can view your account details. Only an
//                             administrator can update your account information
//                             or change your role.
//                         </Alert>
//                     </Card.Body>
//                 </Card>
//             </Container>
//         );
//     }

//     // Admin: complete user management.
//     if (!isAdmin) {
//         return (
//             <Container className="py-4">
//                 <Alert variant="danger">
//                     You are not authorized to access this page.
//                 </Alert>
//             </Container>
//         );
//     }

//     return (
//         <Container fluid className="py-4">
//             <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
//                 <div>
//                     <h3 className="mb-1">
//                         <FaUsers className="me-2" />
//                         User Management
//                     </h3>

//                     <p className="text-muted mb-0">
//                         Create, update, and manage user accounts.
//                     </p>
//                 </div>

//                 <Button onClick={openAddModal}>
//                     <FaPlus className="me-2" />
//                     Add User
//                 </Button>
//             </div>

//             {success && (
//                 <Alert
//                     variant="success"
//                     dismissible
//                     onClose={clearMessages}
//                 >
//                     {success}
//                 </Alert>
//             )}

//             {error && (
//                 <Alert
//                     variant="danger"
//                     dismissible
//                     onClose={clearMessages}
//                 >
//                     {error}
//                 </Alert>
//             )}

//             <Card className="border-0 shadow-sm">
//                 <Card.Body>
//                     <div className="d-flex justify-content-between align-items-center mb-3">
//                         <h5 className="mb-0">All Users</h5>

//                         <Badge bg="primary">
//                             {users.length} Users
//                         </Badge>
//                     </div>

//                     {users.length === 0 ? (
//                         <Alert variant="info" className="mb-0">
//                             No users found.
//                         </Alert>
//                     ) : (
//                         <div className="table-responsive">
//                             <Table bordered hover responsive="md" className="align-middle mb-0">
//                                 <thead className="table-light">
//                                     <tr>
//                                         <th>#</th>
//                                         <th>Username</th>
//                                         <th>Email</th>
//                                         <th>Role</th>
//                                         <th>Created At</th>
//                                         <th className="text-center">
//                                             Actions
//                                         </th>
//                                     </tr>
//                                 </thead>

//                                 <tbody>
//                                     {users.map((item, index) => {
//                                         const isCurrentAdmin =
//                                             String(item._id) ===
//                                             String(currentUser._id);

//                                         return (
//                                             <tr key={item._id}>
//                                                 <td>{index + 1}</td>

//                                                 <td>
//                                                     {item.userName || "N/A"}
//                                                     {isCurrentAdmin && (
//                                                         <Badge
//                                                             bg="secondary"
//                                                             className="ms-2"
//                                                         >
//                                                             You
//                                                         </Badge>
//                                                     )}
//                                                 </td>

//                                                 <td>
//                                                     {item.email || "N/A"}
//                                                 </td>

//                                                 <td>
//                                                     <Badge bg={getRoleVariant(item.role)}>
//                                                         {item.role}
//                                                     </Badge>
//                                                 </td>

//                                                 <td>
//                                                     {item.createdAt
//                                                         ? new Date(
//                                                             item.createdAt
//                                                         ).toLocaleDateString()
//                                                         : "N/A"}
//                                                 </td>

//                                                 <td className="text-center">
//                                                     <Button
//                                                         size="sm"
//                                                         variant="outline-primary"
//                                                         className="me-2"
//                                                         title="Edit user"
//                                                         disabled={actionLoading}
//                                                         onClick={() => openEditModal(item)}
//                                                     >
//                                                         <FaEdit />
//                                                     </Button>

//                                                     <Button
//                                                         size="sm"
//                                                         variant="outline-danger"
//                                                         title="Delete user"
//                                                         disabled={
//                                                             actionLoading ||
//                                                             isCurrentAdmin
//                                                         }
//                                                         onClick={() => handleDelete(item._id)}
//                                                     >
//                                                         <FaTrash />
//                                                     </Button>
//                                                 </td>
//                                             </tr>
//                                         );
//                                     })}
//                                 </tbody>
//                             </Table>
//                         </div>
//                     )}
//                 </Card.Body>
//             </Card>

//             {/* Add / Edit User Modal */}
//             <Modal
//                 show={showModal}
//                 onHide={closeModal}
//                 centered
//                 backdrop="static"
//             >
//                 <Form onSubmit={handleSubmit}>
//                     <Modal.Header closeButton>
//                         <Modal.Title>
//                             {editingUser ? "Edit User" : "Add New User"}
//                         </Modal.Title>
//                     </Modal.Header>

//                     <Modal.Body>
//                         <Form.Group className="mb-3">
//                             <Form.Label>Username</Form.Label>

//                             <Form.Control
//                                 type="text"
//                                 name="userName"
//                                 value={formData.userName}
//                                 onChange={handleChange}
//                                 placeholder="Enter username"
//                                 required
//                                 minLength={3}
//                             />
//                         </Form.Group>

//                         {!editingUser && (
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Email</Form.Label>

//                                 <Form.Control
//                                     type="email"
//                                     name="email"
//                                     value={formData.email}
//                                     onChange={handleChange}
//                                     placeholder="Enter email address"
//                                     required
//                                 />
//                             </Form.Group>
//                         )}

//                         <Form.Group className="mb-3">
//                             <Form.Label>
//                                 {editingUser
//                                     ? "New Password (Optional)"
//                                     : "Password"}
//                             </Form.Label>

//                             <Form.Control
//                                 type="password"
//                                 name="password"
//                                 value={formData.password}
//                                 onChange={handleChange}
//                                 placeholder={
//                                     editingUser
//                                         ? "Leave blank to keep existing password"
//                                         : "Enter password"
//                                 }
//                                 minLength={6}
//                                 required={!editingUser}
//                             />
//                         </Form.Group>

//                         <Form.Group className="mb-3">
//                             <Form.Label>Role</Form.Label>

//                             <Form.Select
//                                 name="role"
//                                 value={formData.role}
//                                 onChange={handleChange}
//                                 required
//                             >
//                                 <option value="Employee">Employee</option>
//                                 <option value="Manager">Manager</option>
//                                 <option value="Admin">Admin</option>
//                             </Form.Select>
//                         </Form.Group>

//                         <Alert variant="warning" className="mb-0">
//                             Only Admin can assign or change account roles.
//                         </Alert>
//                     </Modal.Body>

//                     <Modal.Footer>
//                         <Button
//                             variant="secondary"
//                             onClick={closeModal}
//                             disabled={actionLoading}
//                         >
//                             Cancel
//                         </Button>

//                         <Button
//                             type="submit"
//                             disabled={actionLoading}
//                         >
//                             {actionLoading ? (
//                                 <>
//                                     <Spinner
//                                         size="sm"
//                                         className="me-2"
//                                     />
//                                     Saving...
//                                 </>
//                             ) : editingUser ? (
//                                 "Update User"
//                             ) : (
//                                 "Create User"
//                             )}
//                         </Button>
//                     </Modal.Footer>
//                 </Form>
//             </Modal>
//         </Container>
//     );
// };

// export default Users;
