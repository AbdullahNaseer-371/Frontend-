import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
    Alert,
    Button,
    Card,
    Col,
    Container,
    Form,
    InputGroup,
    Row,
    Spinner,
} from "react-bootstrap";
import { FaLock, FaLeaf, FaUser } from "react-icons/fa";

import useAuth from "../hooks/useAuth";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        login,
        isAuthenticated,
        loading,
        error,
        clearError,
    } = useAuth();

    const [formData, setFormData] = useState({
        userName: "",
        password: "",
    });

    useEffect(() => {
        if (error) {
            clearError();
        }
    }, [formData.userName, formData.password]);

    if (isAuthenticated) {
        const from = location.state?.from?.pathname || "/dashboard";

        return <Navigate to={from} replace />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await login(formData);

        if (!result?.error) {
            navigate("/dashboard", { replace: true });
        }
    };

    return (
        <div className="login-page">
            <Container>
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col xs={12} sm={10} md={7} lg={5} xl={4}>

                        <Card className="login-card shadow border-0">

                            <Card.Body className="p-4 p-md-5">

                                <div className="text-center mb-4">

                                    <div className="login-logo">
                                        <FaLeaf />
                                    </div>

                                    <h2 className="fw-bold mt-3">
                                        GreenLeaf
                                    </h2>

                                    <p className="text-muted mb-0">
                                        Inventory Management System
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

                                <Form onSubmit={handleSubmit}>

                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            Username
                                        </Form.Label>

                                        <InputGroup>
                                            <InputGroup.Text>
                                                <FaUser />
                                            </InputGroup.Text>

                                            <Form.Control
                                                type="text"
                                                name="userName"
                                                value={formData.userName}
                                                onChange={handleChange}
                                                placeholder="Enter username"
                                                required
                                            />
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label>
                                            Password
                                        </Form.Label>

                                        <InputGroup>
                                            <InputGroup.Text>
                                                <FaLock />
                                            </InputGroup.Text>

                                            <Form.Control
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Enter password"
                                                required
                                            />
                                        </InputGroup>
                                    </Form.Group>

                                    <Button
                                        type="submit"
                                        className="w-100 login-btn"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner
                                                    size="sm"
                                                    className="me-2"
                                                />
                                                Logging in...
                                            </>
                                        ) : (
                                            "Login"
                                        )}
                                    </Button>

                                </Form>

                            </Card.Body>

                        </Card>

                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;