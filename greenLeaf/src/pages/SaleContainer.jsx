import {
    Alert,
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
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import '../styles/sales.css';
/**
 * SalesContainer
 * Presentational React Bootstrap container for the GreenLeaf Sales page.
 * Pass the existing state values and handlers from your Sales page component.
 */
const SalesContainer = ({
    canCreate,
    canUpdate,
    canDelete,
    handleOpenAdd,
    error,
    clearError,
    pagination,
    sales = [],
    reportRevenue = 0,
    filters,
    handleFilterChange,
    setFilters,
    loading,
    getPlantName,
    getSoldByName,
    handleOpenEdit,
    handleDelete,
    totalPages = 1,
    showModal,
    setShowModal,
    editingSale,
    handleSubmit,
    formData,
    handleChange,
    plants = [],
}) => {
    const columnCount = canUpdate || canDelete ? 7 : 6;

    return (
        <Container fluid className="dashboard-page sales-page">
            {/* Page heading */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h2 className="sales-page-title">Sales</h2>
                    <p className="text-muted mb-0">
                        Manage sales and view sales analytics.
                    </p>
                </div>

                {canCreate && (
                    <Button variant="success" onClick={handleOpenAdd}>
                        <FaPlus className="me-2" />
                        Add Sale
                    </Button>
                )}
            </div>

            {/* Error message */}
            {error && (
                <Alert variant="danger" dismissible onClose={clearError}>
                    {error}
                </Alert>
            )}

            {/* Summary cards */}
            <Row className="g-3 mb-4">
                <Col xs={12} md={6} xl={3}>
                    <Card className="sales-summary-card h-100">
                        <Card.Body>
                            <small className="sales-card-label">Total Sales</small>
                            <h3 className="mt-2 mb-0">
                                {pagination?.total ?? sales.length}
                            </h3>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} md={6} xl={3}>
                    <Card className="sales-summary-card h-100">
                        <Card.Body>
                            <small className="sales-card-label">Revenue</small>
                            <h3 className="mt-2 mb-0">
                                Rs. {Number(reportRevenue || 0).toLocaleString()}
                            </h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Search and filters */}
            <Card className="sales-filter-card mb-4">
                <Card.Body>
                    <Row className="g-3">
                        <Col xs={12} md={4}>
                            <InputGroup>
                                <InputGroup.Text>
                                    <FaSearch />
                                </InputGroup.Text>
                                <Form.Control
                                    name="search"
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                    placeholder="Search sales..."
                                    aria-label="Search sales"
                                />
                            </InputGroup>
                        </Col>

                        <Col xs={12} md={3}>
                            <Form.Control
                                type="date"
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleFilterChange}
                                aria-label="Start date"
                            />
                        </Col>

                        <Col xs={12} md={3}>
                            <Form.Control
                                type="date"
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleFilterChange}
                                aria-label="End date"
                            />
                        </Col>

                        <Col xs={12} md={2}>
                            <Form.Select
                                value={filters.limit}
                                onChange={(event) =>
                                    setFilters((previous) => ({
                                        ...previous,
                                        limit: Number(event.target.value),
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

            {/* Sales table */}
            <Card className="sales-table-card">
                <Card.Body className="p-0">
                    <Table hover responsive className="sales-table mb-0">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Plant</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th>Sold By</th>
                                <th>Date</th>
                                {(canUpdate || canDelete) && <th>Actions</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={columnCount} className="text-center py-5">
                                        <Spinner animation="border" role="status">
                                            <span className="visually-hidden">Loading sales...</span>
                                        </Spinner>
                                    </td>
                                </tr>
                            ) : sales.length > 0 ? (
                                sales.map((sale, index) => (
                                    <tr key={sale._id}>
                                        <td>
                                            {((pagination?.page || filters.page || 1) - 1) *
                                                (pagination?.limit || filters.limit || 10) +
                                                index +
                                                1}
                                        </td>
                                        <td>{getPlantName(sale.plantId)}</td>
                                        <td>{sale.quantity}</td>
                                        <td>
                                            Rs. {Number(sale.totalPrice || 0).toLocaleString()}
                                        </td>
                                        <td>{getSoldByName(sale.soldBy)}</td>
                                        <td>
                                            {sale.saleDate
                                                ? new Date(sale.saleDate).toLocaleDateString()
                                                : "-"}
                                        </td>

                                        {(canUpdate || canDelete) && (
                                            <td className="sales-actions-cell">
                                                {canUpdate && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline-primary"
                                                        className="me-2"
                                                        onClick={() => handleOpenEdit(sale)}
                                                        aria-label="Edit sale"
                                                        title="Edit sale"
                                                    >
                                                        <FaEdit />
                                                    </Button>
                                                )}
                                                {canDelete && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline-danger"
                                                        onClick={() => handleDelete(sale._id)}
                                                        aria-label="Delete sale"
                                                        title="Delete sale"
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
                                    <td colSpan={columnCount} className="text-center py-5 sales-empty-state">
                                        No sales found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination className="sales-pagination">
                        <Pagination.Prev
                            disabled={filters.page <= 1}
                            onClick={() =>
                                setFilters((previous) => ({
                                    ...previous,
                                    page: previous.page - 1,
                                }))
                            }
                        />

                        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                            (page) => (
                                <Pagination.Item
                                    key={page}
                                    active={filters.page === page}
                                    onClick={() =>
                                        setFilters((previous) => ({ ...previous, page }))
                                    }
                                >
                                    {page}
                                </Pagination.Item>
                            )
                        )}

                        <Pagination.Next
                            disabled={filters.page >= totalPages}
                            onClick={() =>
                                setFilters((previous) => ({
                                    ...previous,
                                    page: previous.page + 1,
                                }))
                            }
                        />
                    </Pagination>
                </div>
            )}

            {/* Add / edit sale modal */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
                className="sales-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{editingSale ? "Edit Sale" : "Add Sale"}</Modal.Title>
                </Modal.Header>

                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Plant</Form.Label>
                            <Form.Select
                                name="plantId"
                                value={formData.plantId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select plant</option>
                                {plants.map((plant) => (
                                    <option key={plant._id} value={plant._id}>
                                        {plant.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                min="1"
                                step="1"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Total Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="totalPrice"
                                value={formData.totalPrice}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                required
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Sale Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="saleDate"
                                value={formData.saleDate}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button
                            variant="outline-secondary"
                            onClick={() => setShowModal(false)}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="success" disabled={loading}>
                            {loading
                                ? "Saving..."
                                : editingSale
                                    ? "Update Sale"
                                    : "Add Sale"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default SalesContainer;
