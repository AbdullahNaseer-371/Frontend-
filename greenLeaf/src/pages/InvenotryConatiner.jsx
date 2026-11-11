
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
    FaSeedling,
} from "react-icons/fa";
import '../styles/inventory.css';
const InventoryContainer = ({
    canCreate,
    canUpdate,
    canDelete,

    plants = [],
    categories = [],
    pagination,

    loading,
    error,
    success,
    clearError,

    filters,
    setFilters,
    handleFilterChange,

    totalPages,

    handleOpenAdd,
    handleOpenEdit,
    handleDelete,

    showModal,
    handleCloseModal,
    editingPlant,

    formData,
    handleFormChange,
    handleSubmit,

    handleImageChange,
    imagePreview,
}) => {

    const columnCount = 8 + (canUpdate || canDelete ? 1 : 0);

    const currentPage = pagination?.page || filters.page || 1;
    const currentLimit = pagination?.limit || filters.limit || 10;
    const statusOptions = [
        "Available",
        "Out of stock",
        "Reserved",
        "Inactive",
        "Discontinued",
        "Coming Soon"
    ];
    return (
        <Container fluid className="dashboard-page inventory-page">

            {/* =================================
                PAGE HEADER
            ================================= */}

            <div className="inventory-header">

                <div>
                    <span className="inventory-eyebrow">
                        GREENLEAF MANAGEMENT
                    </span>

                    <h2 className="inventory-page-title">
                        Inventory
                    </h2>

                    <p>
                        Manage your plants, stock, categories and availability.
                    </p>
                </div>

                {canCreate && (
                    <Button
                        variant="success"
                        className="inventory-add-btn"
                        onClick={handleOpenAdd}
                    >
                        <FaPlus className="me-2" />
                        Add Plant
                    </Button>
                )}

            </div>

            {/* =================================
                ERROR MESSAGE
            ================================= */}

            {error && (
                <Alert
                    variant="danger"
                    dismissible
                    onClose={clearError}
                    className="inventory-alert"
                >
                    {error}
                </Alert>
            )}

            {/* =================================
                SUCCESS MESSAGE
            ================================= */}

            {success && (
                <Alert
                    variant="success"
                    className="inventory-alert"
                >
                    {typeof success === "string"
                        ? success
                        : "Operation completed successfully."}
                </Alert>
            )}

            {/* =================================
                SUMMARY / OVERVIEW
            ================================= */}

            <Row className="g-3 mb-4">

                <Col xs={12} sm={6} xl={4}>
                    <Card className="inventory-stat-card">
                        <Card.Body>
                            <div className="inventory-stat-top">
                                <div className="inventory-stat-icon">
                                    <FaSeedling />
                                </div>

                                <span className="inventory-stat-label">
                                    Total Plants
                                </span>
                            </div>

                            <h3>
                                {pagination?.total ?? plants.length}
                            </h3>

                            <p>Plants in inventory</p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} sm={6} xl={4}>
                    <Card className="inventory-stat-card">
                        <Card.Body>
                            <div className="inventory-stat-top">
                                <div className="inventory-stat-icon">
                                    <FaSeedling />
                                </div>

                                <span className="inventory-stat-label">
                                    Categories
                                </span>
                            </div>

                            <h3>{categories.length}</h3>

                            <p>Available plant categories</p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} sm={6} xl={4}>
                    <Card className="inventory-stat-card">
                        <Card.Body>
                            <div className="inventory-stat-top">
                                <div className="inventory-stat-icon">
                                    <FaSeedling />
                                </div>

                                <span className="inventory-stat-label">
                                    Current Page
                                </span>
                            </div>

                            <h3>{currentPage} / {totalPages || 1}</h3>

                            <p>Inventory pagination</p>
                        </Card.Body>
                    </Card>
                </Col>

            </Row>

            {/* =================================
                FILTER SECTION
            ================================= */}

            <Card className="inventory-filter-card mb-4">

                <Card.Body>

                    <div className="inventory-section-heading">
                        <div>
                            <h5>Inventory Filters</h5>
                            <p>Search and filter your plants.</p>
                        </div>
                    </div>

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
                                    aria-label="Search plants"
                                />
                            </InputGroup>
                        </Col>

                        {/* Category */}

                        <Col xs={12} md={3}>
                            <Form.Select
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                                aria-label="Filter by category"
                            >
                                <option value="">
                                    All Categories
                                </option>

                                {categories.map((category) => (
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
                                aria-label="Filter by status"
                            >
                                <option value="">All Status</option>

                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
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
                                aria-label="Rows per page"
                            >
                                <option value={10}>10 / page</option>
                                <option value={20}>20 / page</option>
                                <option value={50}>50 / page</option>
                            </Form.Select>
                        </Col>

                    </Row>

                </Card.Body>
            </Card>

            {/* =================================
                INVENTORY TABLE
            ================================= */}

            <Card className="inventory-table-card">

                <Card.Body className="p-0">

                    <div className="inventory-table-heading">
                        <div>
                            <h5>Plant Inventory</h5>
                            <p>View and manage your inventory records.</p>
                        </div>

                        <Badge className="inventory-count-badge">
                            {pagination?.total ?? plants.length} Records
                        </Badge>
                    </div>

                    <Table
                        responsive
                        hover
                        className="inventory-table mb-0"
                    >

                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Plant</th>
                                <th>Category</th>
                                <th>SKU</th>
                                <th>Price</th>
                                <th>Stock</th>
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
                                        <Spinner
                                            animation="border"
                                            className="inventory-spinner"
                                        />

                                        <p className="mt-2 mb-0">
                                            Loading inventory...
                                        </p>
                                    </td>
                                </tr>

                            ) : plants.length > 0 ? (

                                plants.map((plant, index) => {

                                    const status = (
                                        plant.status || ""
                                    ).toLowerCase();

                                    const categoryName =
                                        typeof plant.category === "object"
                                            ? plant.category?.name || "-"
                                            : plant.category || "-";

                                    return (
                                        <tr key={plant._id}>

                                            <td>
                                                {((currentPage - 1) *
                                                    currentLimit) + index + 1}
                                            </td>

                                            <td>
                                                <strong className="inventory-plant-name">
                                                    {plant.name}
                                                </strong>
                                            </td>
                                            <td>
                                                {typeof plant.category === "object"
                                                    ? plant.category?.name || "-"
                                                    : categories.find(
                                                        (category) => category._id === plant.category
                                                    )?.name || "-"}
                                            </td>

                                            <td>
                                                {plant.sku || "-"}
                                            </td>

                                            <td className="inventory-price">
                                                Rs.{" "}
                                                {Number(
                                                    plant.price || 0
                                                ).toLocaleString()}
                                            </td>

                                            <td>
                                                <span className="inventory-stock">
                                                    {plant.stock ?? 0}
                                                </span>
                                            </td>

                                            <td>
                                                {plant.image?.url ? (
                                                    <img
                                                        src={plant.image.url}
                                                        alt={plant.name}
                                                        className="inventory-plant-image"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <span className="inventory-no-image">
                                                        No Image
                                                    </span>
                                                )}
                                            </td>

                                            <td>
                                                <Badge
                                                    className={
                                                        status === "active"
                                                            ? "inventory-status-active"
                                                            : "inventory-status-inactive"
                                                    }
                                                >
                                                    {status === "active"
                                                        ? "Available"
                                                        : status === "inactive"
                                                            ? "Inactive"
                                                            : plant.status || "Unknown"}
                                                </Badge>
                                            </td>

                                            {(canUpdate || canDelete) && (
                                                <td className="inventory-actions">

                                                    {canUpdate && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline-primary"
                                                            className="me-2"
                                                            onClick={() =>
                                                                handleOpenEdit(plant)
                                                            }
                                                            title="Edit plant"
                                                            aria-label="Edit plant"
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
                                                            title="Delete plant"
                                                            aria-label="Delete plant"
                                                        >
                                                            <FaTrash />
                                                        </Button>
                                                    )}

                                                </td>
                                            )}

                                        </tr>
                                    );
                                })

                            ) : (

                                <tr>
                                    <td
                                        colSpan={columnCount}
                                        className="inventory-empty-state"
                                    >
                                        <FaSeedling />

                                        <h6>No Plants Found</h6>

                                        <p>
                                            Try changing your search or filters.
                                        </p>
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </Table>

                </Card.Body>
            </Card>

            {/* =================================
                PAGINATION
            ================================= */}

            {totalPages > 1 && (
                <div className="inventory-pagination-wrapper">

                    <Pagination className="inventory-pagination">

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

            {/* =================================
                ADD / EDIT MODAL
            ================================= */}

            <Modal
                show={showModal}
                onHide={handleCloseModal}
                centered
                className="inventory-modal"
            >

                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingPlant ? "Edit Plant" : "Add New Plant"}
                    </Modal.Title>
                </Modal.Header>

                <Form onSubmit={handleSubmit}>

                    <Modal.Body>

                        {/* Plant Name */}

                        <Form.Group className="mb-3">
                            <Form.Label>Plant Name</Form.Label>

                            <Form.Control
                                name="name"
                                value={formData.name}
                                onChange={handleFormChange}
                                placeholder="Enter plant name"
                                required
                                maxLength={100}
                            />
                        </Form.Group>

                        {/* Category */}

                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>

                            <Form.Select
                                name="category"
                                value={formData.category}
                                onChange={handleFormChange}
                                required
                            >
                                <option value="">Select category</option>

                                {categories.map((category) => (
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

                            <Col xs={12} sm={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Price (Rs.)</Form.Label>

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

                            {/* Stock */}

                            <Col xs={12} sm={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Stock Quantity</Form.Label>

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
                            <Form.Label>Plant Image</Form.Label>

                            <Form.Control
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                            />

                            <Form.Text className="text-muted">
                                JPG, PNG or WEBP. Maximum size: 5MB.
                            </Form.Text>

                            {imagePreview && (
                                <div className="inventory-image-preview-wrapper">
                                    <img
                                        src={imagePreview}
                                        alt="Plant preview"
                                        className="inventory-image-preview"
                                    />
                                </div>
                            )}
                        </Form.Group>

                        {/* Status */}

                        <Form.Group>
                            <Form.Label>Status</Form.Label>

                            <Form.Select
                                name="status"
                                value={formData.status}
                                onChange={handleFormChange}
                            >
                                <option value="Available">Available</option>
                                <option value="inactive">Inactive</option>
                                <option value="Reserved">Reserved</option>
                                <option value="Out of stock">Out of stock</option>
                            </Form.Select>
                        </Form.Group>

                    </Modal.Body>

                    <Modal.Footer>

                        <Button
                            variant="outline-secondary"
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

export default InventoryContainer;
