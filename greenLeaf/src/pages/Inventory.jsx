import { useEffect, useState } from "react";
import {
    Alert,
    Badge,
    Button,
    Card,
    Col,
    Container,
    Form,
    InputGroup,
    Modal,
    Pagination,
    Row,
    Spinner,
    Table,
} from "react-bootstrap";
import {
    FaEdit,
    FaPlus,
    FaSearch,
    FaTrash,
} from "react-icons/fa";

import usePlants from "../hooks/usePlants";
import useCategories from "../hooks/useCategory";
import usePermissions from "../hooks/usePermission";

const Inventory = () => {
    const {
        plants,
        pagination,
        loading,
        error,
        success,
        getPlants,
        addPlant,
        editPlant,
        removePlant,
        clearError,
        clearSuccess,
    } = usePlants();

    const {
        categories,
        getCategories,
    } = useCategories();

    const {
        canCreate,
        canUpdate,
        canDelete,
    } = usePermissions();

    const [filters, setFilters] = useState({
        search: "",
        category: "",
        status: "",
        page: 1,
        limit: 10,
    });

    const [showModal, setShowModal] = useState(false);
    const [editingPlant, setEditingPlant] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        quantity: "",
        status: "active",
    });

    useEffect(() => {
        getPlants(filters);
        getCategories();
    }, [
        filters.search,
        filters.category,
        filters.status,
        filters.page,
        filters.limit,
    ]);

    useEffect(() => {
        if (success) {
            setShowModal(false);
            setEditingPlant(null);

            setFormData({
                name: "",
                category: "",
                price: "",
                quantity: "",
                status: "active",
            });

            const timer = setTimeout(() => {
                clearSuccess();
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        setFilters((prev) => ({
            ...prev,
            [name]: value,
            page: 1,
        }));
    };

    const handleOpenAdd = () => {
        setEditingPlant(null);

        setFormData({
            name: "",
            category: "",
            price: "",
            quantity: "",
            status: "active",
        });

        setShowModal(true);
    };

    const handleOpenEdit = (plant) => {
        setEditingPlant(plant);

        setFormData({
            name: plant.name || "",
            category: plant.category?._id || plant.category || "",
            price: plant.price || "",
            quantity: plant.quantity || "",
            status: plant.status || "active",
        });

        setShowModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editingPlant) {
            await editPlant(editingPlant._id, formData);
        } else {
            await addPlant(formData);
        }

        getPlants(filters);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this plant?"
        );

        if (!confirmed) return;

        await removePlant(id);
        getPlants(filters);
    };

    const totalPages = pagination?.pages || 1;

    return (
        <Container fluid className="dashboard-page">

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

                <div>
                    <h2>Inventory</h2>
                    <p className="text-muted mb-0">
                        Manage GreenLeaf plant inventory.
                    </p>
                </div>

                {canCreate && (
                    <Button
                        variant="success"
                        onClick={handleOpenAdd}
                    >
                        <FaPlus className="me-2" />
                        Add Plant
                    </Button>
                )}

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

            <Card className="border-0 shadow-sm mb-4">

                <Card.Body>

                    <Row className="g-3">

                        <Col xs={12} md={5}>
                            <InputGroup>
                                <InputGroup.Text>
                                    <FaSearch />
                                </InputGroup.Text>

                                <Form.Control
                                    name="search"
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                    placeholder="Search plants..."
                                />
                            </InputGroup>
                        </Col>

                        <Col xs={12} md={3}>
                            <Form.Select
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                            >
                                <option value="">
                                    All Categories
                                </option>

                                {categories?.map((category) => (
                                    <option
                                        key={category._id}
                                        value={category._id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>

                        <Col xs={12} md={2}>
                            <Form.Select
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                            >
                                <option value="">
                                    All Status
                                </option>

                                <option value="active">
                                    Active
                                </option>

                                <option value="inactive">
                                    Inactive
                                </option>
                            </Form.Select>
                        </Col>

                        <Col xs={12} md={2}>
                            <Form.Select
                                value={filters.limit}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        limit: Number(e.target.value),
                                        page: 1,
                                    }))
                                }
                            >
                                <option value="10">
                                    10 / page
                                </option>

                                <option value="20">
                                    20 / page
                                </option>

                                <option value="50">
                                    50 / page
                                </option>
                            </Form.Select>
                        </Col>

                    </Row>

                </Card.Body>
            </Card>

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
                                    <th>Plant</th>
                                    <th>Category</th>
                                    <th>SKU</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Status</th>
                                    {(canUpdate || canDelete) && (
                                        <th>Actions</th>
                                    )}
                                </tr>
                            </thead>

                            <tbody>

                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="text-center py-5"
                                        >
                                            <Spinner />
                                        </td>
                                    </tr>
                                ) : plants?.length ? (
                                    plants.map((plant, index) => (
                                        <tr key={plant._id}>

                                            <td>
                                                {((pagination?.page || 1) - 1) *
                                                    (pagination?.limit || 10) +
                                                    index +
                                                    1}
                                            </td>

                                            <td>
                                                <strong>
                                                    {plant.name}
                                                </strong>
                                            </td>

                                            <td>
                                                {plant.category?.name ||
                                                    plant.category ||
                                                    "-"}
                                            </td>

                                            <td>
                                                {plant.sku || "-"}
                                            </td>

                                            <td>
                                                Rs.{" "}
                                                {Number(
                                                    plant.price || 0
                                                ).toLocaleString()}
                                            </td>

                                            <td>
                                                {plant.quantity ?? 0}
                                            </td>

                                            <td>
                                                <Badge
                                                    bg={
                                                        plant.status ===
                                                            "active"
                                                            ? "success"
                                                            : "secondary"
                                                    }
                                                >
                                                    {plant.status || "Unknown"}
                                                </Badge>
                                            </td>

                                            {(canUpdate || canDelete) && (
                                                <td>
                                                    {canUpdate && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline-primary"
                                                            className="me-2"
                                                            onClick={() =>
                                                                handleOpenEdit(
                                                                    plant
                                                                )
                                                            }
                                                        >
                                                            <FaEdit />
                                                        </Button>
                                                    )}

                                                    {canDelete && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline-danger"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    plant._id
                                                                )
                                                            }
                                                        >
                                                            <FaTrash />
                                                        </Button>
                                                    )}
                                                </td>
                                            )}

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="text-center py-5"
                                        >
                                            No plants found.
                                        </td>
                                    </tr>
                                )}

                            </tbody>
                        </Table>

                    </div>

                </Card.Body>
            </Card>

            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">

                    <Pagination>

                        <Pagination.Prev
                            disabled={filters.page <= 1}
                            onClick={() =>
                                setFilters((prev) => ({
                                    ...prev,
                                    page: prev.page - 1,
                                }))
                            }
                        />

                        {Array.from(
                            { length: totalPages },
                            (_, index) => index + 1
                        ).map((page) => (
                            <Pagination.Item
                                key={page}
                                active={page === filters.page}
                                onClick={() =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        page,
                                    }))
                                }
                            >
                                {page}
                            </Pagination.Item>
                        ))}

                        <Pagination.Next
                            disabled={filters.page >= totalPages}
                            onClick={() =>
                                setFilters((prev) => ({
                                    ...prev,
                                    page: prev.page + 1,
                                }))
                            }
                        />

                    </Pagination>

                </div>
            )}

            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingPlant
                            ? "Edit Plant"
                            : "Add Plant"}
                    </Modal.Title>
                </Modal.Header>

                <Form onSubmit={handleSubmit}>

                    <Modal.Body>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                Plant Name
                            </Form.Label>

                            <Form.Control
                                name="name"
                                value={formData.name}
                                onChange={handleFormChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                Category
                            </Form.Label>

                            <Form.Select
                                name="category"
                                value={formData.category}
                                onChange={handleFormChange}
                            >
                                <option value="">
                                    Select category
                                </option>

                                {categories?.map((category) => (
                                    <option
                                        key={category._id}
                                        value={category._id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Row>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Price
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleFormChange}
                                        min="0"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Quantity
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleFormChange}
                                        min="0"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                        </Row>

                        <Form.Group>
                            <Form.Label>
                                Status
                            </Form.Label>

                            <Form.Select
                                name="status"
                                value={formData.status}
                                onChange={handleFormChange}
                            >
                                <option value="active">
                                    Active
                                </option>

                                <option value="inactive">
                                    Inactive
                                </option>
                            </Form.Select>
                        </Form.Group>

                    </Modal.Body>

                    <Modal.Footer>

                        <Button
                            variant="secondary"
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="success"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : editingPlant
                                    ? "Update Plant"
                                    : "Add Plant"}
                        </Button>

                    </Modal.Footer>

                </Form>
            </Modal>

        </Container>
    );
};

export default Inventory;