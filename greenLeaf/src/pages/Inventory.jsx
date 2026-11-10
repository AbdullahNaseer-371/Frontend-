
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

    // Image states
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [editingPlant, setEditingPlant] = useState(null);

    // Plant hooks
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

    // Category hooks
    const {
        categories,
        getCategories,
    } = useCategories();

    // Extra safety: always use an array
    const categoryList = Array.isArray(categories)
        ? categories
        : [];

    // Permissions
    const {
        canCreate,
        canUpdate,
        canDelete,
    } = usePermissions();

    // Filters
    const [filters, setFilters] = useState({
        search: "",
        category: "",
        status: "",
        page: 1,
        limit: 10,
    });

    // Form data
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        stock: "",
        status: "active",
    });

    // Load categories
    useEffect(() => {
        getCategories();
    }, []);

    // Load plants when filters change
    useEffect(() => {
        getPlants(filters);
    }, [
        filters.search,
        filters.category,
        filters.status,
        filters.page,
        filters.limit,
    ]);

    // Success handling
    useEffect(() => {
        if (success) {
            setShowModal(false);
            setEditingPlant(null);

            setFormData({
                name: "",
                category: "",
                price: "",
                stock: "",
                status: "active",
            });

            setImage(null);
            setImagePreview(null);

            getPlants(filters);

            const timer = setTimeout(() => {
                clearSuccess();
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [success]);

    // Image preview cleanup
    useEffect(() => {
        return () => {
            if (imagePreview?.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    // Filter handler
    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        setFilters((prev) => ({
            ...prev,
            [name]: value,
            page: 1,
        }));
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: "",
            category: "",
            price: "",
            stock: "",
            status: "active",
        });

        setImage(null);
        setImagePreview(null);
    };

    // Open Add Modal
    const handleOpenAdd = () => {
        setEditingPlant(null);
        resetForm();
        clearError();
        setShowModal(true);
    };

    // Open Edit Modal
    const handleOpenEdit = (plant) => {
        setEditingPlant(plant);

        setFormData({
            name: plant.name || "",
            category:
                plant.category?._id ||
                plant.category ||
                "",
            price: plant.price ?? "",
            stock: plant.stock ?? "",
            status: plant.status || "active",
        });

        setImage(null);
        setImagePreview(plant.image?.url || null);

        clearError();
        setShowModal(true);
    };

    // Image handler
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Only JPG, PNG and WEBP images are allowed.");
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5MB.");
            e.target.value = "";
            return;
        }

        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    // Form handler
    const handleFormChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.category) {
            alert("Please select a category.");
            return;
        }

        if (!formData.name.trim()) {
            alert("Plant name is required.");
            return;
        }

        if (
            Number(formData.price) < 0 ||
            Number(formData.stock) < 0
        ) {
            alert("Price and stock cannot be negative.");
            return;
        }

        const data = new FormData();

        data.append("name", formData.name.trim());
        data.append("category", formData.category);
        data.append("price", formData.price);
        data.append("stock", formData.stock);
        data.append("status", formData.status);

        if (image) {
            data.append("image", image);
        }

        try {
            if (editingPlant) {
                await editPlant(editingPlant._id, data);
            } else {
                await addPlant(data);
            }
        } catch (err) {
            console.error("Plant save error:", err);
        }
    };

    // Delete handler
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this plant?"
        );

        if (!confirmed) return;

        try {
            await removePlant(id);
            await getPlants(filters);
        } catch (err) {
            console.error("Plant delete error:", err);
        }
    };

    // Close modal
    const handleCloseModal = () => {
        setShowModal(false);
        setEditingPlant(null);
        resetForm();
        clearError();
    };

    // Pagination
    const totalPages = pagination?.pages || 1;

    const columnCount =
        8 + (canUpdate || canDelete ? 1 : 0);

    return (
        <Container fluid className="dashboard-page">

            {/* Page Header */}
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

            {/* Error Message */}
            {error && (
                <Alert
                    variant="danger"
                    dismissible
                    onClose={clearError}
                >
                    {error}
                </Alert>
            )}

            {/* Success Message */}
            {success && (
                <Alert variant="success">
                    {typeof success === "string"
                        ? success
                        : "Operation completed successfully."}
                </Alert>
            )}

            {/* Filters */}
            <Card className="border-0 shadow-sm mb-4">

                <Card.Body>

                    <Row className="g-3">

                        {/* Search */}
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

                        {/* Category */}
                        <Col xs={12} md={3}>
                            <Form.Select
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                            >
                                <option value="">
                                    All Categories
                                </option>

                                {categoryList.map((category) => (
                                    <option
                                        key={category._id}
                                        value={category._id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>

                        {/* Status */}
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

                        {/* Limit */}
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
                                <option value={10}>
                                    10 / page
                                </option>

                                <option value={20}>
                                    20 / page
                                </option>

                                <option value={50}>
                                    50 / page
                                </option>
                            </Form.Select>
                        </Col>

                    </Row>

                </Card.Body>
            </Card>

            {/* Inventory Table */}
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
                                    <th>Image</th>
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
                                            colSpan={columnCount}
                                            className="text-center py-5"
                                        >
                                            <Spinner animation="border" />
                                        </td>
                                    </tr>

                                ) : Array.isArray(plants) &&
                                    plants.length > 0 ? (

                                    plants.map((plant, index) => (

                                        <tr key={plant._id}>

                                            <td>
                                                {((pagination?.page || 1) - 1) *
                                                    (pagination?.limit || 10) +
                                                    index + 1}
                                            </td>

                                            <td>
                                                <strong>
                                                    {plant.name}
                                                </strong>
                                            </td>

                                            <td>
                                                {typeof plant.category === "object"
                                                    ? plant.category?.name || "-"
                                                    : plant.category || "-"}
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
                                                {plant.stock ?? 0}
                                            </td>

                                            <td>
                                                {plant.image?.url ? (
                                                    <img
                                                        src={plant.image.url}
                                                        alt={plant.name}
                                                        style={{
                                                            width: "55px",
                                                            height: "55px",
                                                            objectFit: "cover",
                                                            borderRadius: "6px",
                                                        }}
                                                    />
                                                ) : (
                                                    "No Image"
                                                )}
                                            </td>

                                            <td>
                                                <Badge
                                                    bg={
                                                        plant.status === "Available"
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
                                                                handleOpenEdit(plant)
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
                                                                handleDelete(plant._id)
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
                                            colSpan={columnCount}
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

            {/* Pagination */}
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

            {/* Add / Edit Modal */}
            <Modal
                show={showModal}
                onHide={handleCloseModal}
                centered
            >

                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingPlant ? "Edit Plant" : "Add Plant"}
                    </Modal.Title>
                </Modal.Header>

                <Form onSubmit={handleSubmit}>

                    <Modal.Body>

                        {/* Plant Name */}
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Plant Name
                            </Form.Label>

                            <Form.Control
                                name="name"
                                value={formData.name}
                                onChange={handleFormChange}
                                placeholder="Enter plant name"
                                required
                            />
                        </Form.Group>

                        {/* Category */}
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Category
                            </Form.Label>

                            <Form.Select
                                name="category"
                                value={formData.category}
                                onChange={handleFormChange}
                                required
                            >
                                <option value="">
                                    Select category
                                </option>

                                {categoryList.map((category) => (
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

                            {/* Price */}
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
                                        step="0.01"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            {/* Quantity */}
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Quantity
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleFormChange}
                                        min="0"
                                        step="1"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                        </Row>

                        {/* Image */}
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Plant Image
                            </Form.Label>

                            <Form.Control
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                            />

                            <Form.Text className="text-muted">
                                Maximum image size: 5MB.
                            </Form.Text>

                            {imagePreview && (
                                <div className="mt-3">
                                    <img
                                        src={imagePreview}
                                        alt="Plant Preview"
                                        style={{
                                            width: "150px",
                                            height: "120px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                        }}
                                    />
                                </div>
                            )}
                        </Form.Group>

                        {/* Status */}
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
                                    Available
                                </option>

                                <option value="inactive">
                                    Out of stock
                                </option>
                                <option value="inactive">
                                    Reservedx
                                </option>
                            </Form.Select>
                        </Form.Group>

                    </Modal.Body>

                    <Modal.Footer>

                        <Button
                            variant="secondary"
                            onClick={handleCloseModal}
                            disabled={loading}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="success"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner
                                        size="sm"
                                        className="me-2"
                                    />
                                    Saving...
                                </>
                            ) : (
                                editingPlant
                                    ? "Update Plant"
                                    : "Add Plant"
                            )}
                        </Button>

                    </Modal.Footer>

                </Form>

            </Modal>

        </Container>
    );
};

export default Inventory;
