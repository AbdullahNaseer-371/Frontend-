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

import useSales from "../hooks/useSale";
import usePlants from "../hooks/usePlants";
import usePermissions from "../hooks/usePermission";

const Sales = () => {
    const {
        sales,
        pagination,
        loading,
        error,
        success,
        getSales,
        addSale,
        editSale,
        removeSale,
        getSalesReport,
        report,
        reportLoading,
        clearError,
        clearSuccess,
    } = useSales();

    const {
        plants,
        getPlants,
    } = usePlants();

    const {
        canCreate,
        canUpdate,
        canDelete,
    } = usePermissions();

    const [filters, setFilters] = useState({
        search: "",
        startDate: "",
        endDate: "",
        page: 1,
        limit: 10,
    });

    const [showModal, setShowModal] = useState(false);
    const [editingSale, setEditingSale] = useState(null);

    const [formData, setFormData] = useState({
        plantId: "",
        quantity: "",
        totalPrice: "",
        saleDate: "",
    });

    useEffect(() => {
        getSales(filters);
        getSalesReport({
            startDate: filters.startDate,
            endDate: filters.endDate,
        });
        getPlants();
    }, [
        filters.search,
        filters.startDate,
        filters.endDate,
        filters.page,
        filters.limit,
    ]);

    useEffect(() => {
        if (success) {
            setShowModal(false);
            setEditingSale(null);

            setFormData({
                plantId: "",
                quantity: "",
                totalPrice: "",
                saleDate: "",
            });

            clearSuccess();
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
        setEditingSale(null);

        setFormData({
            plantId: "",
            quantity: "",
            totalPrice: "",
            saleDate: "",
        });

        setShowModal(true);
    };

    const handleOpenEdit = (sale) => {
        setEditingSale(sale);

        setFormData({
            plantId: sale.plantId?._id || sale.plantId || "",
            quantity: sale.quantity || "",
            totalPrice: sale.totalPrice || "",
            saleDate: sale.saleDate
                ? sale.saleDate.substring(0, 10)
                : "",
        });

        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editingSale) {
            await editSale(editingSale._id, formData);
        } else {
            await addSale(formData);
        }

        getSales(filters);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this sale?")) return;

        await removeSale(id);
        getSales(filters);
    };

    const totalPages = pagination?.pages || 1;

    const reportRevenue =
        report?.totalRevenue ||
        report?.revenue ||
        0;

    return (
        <Container fluid className="dashboard-page">

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

                <div>
                    <h2>Sales</h2>
                    <p className="text-muted mb-0">
                        Manage sales and view sales analytics.
                    </p>
                </div>

                {canCreate && (
                    <Button
                        variant="success"
                        onClick={handleOpenAdd}
                    >
                        <FaPlus className="me-2" />
                        Add Sale
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

            <Row className="g-3 mb-4">

                <Col xs={12} md={6} xl={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <small className="text-muted">
                                Total Sales
                            </small>

                            <h3 className="mt-2 mb-0">
                                {pagination?.total || sales?.length || 0}
                            </h3>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} md={6} xl={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <small className="text-muted">
                                Revenue
                            </small>

                            <h3 className="mt-2 mb-0">
                                Rs.{" "}
                                {Number(
                                    reportRevenue
                                ).toLocaleString()}
                            </h3>
                        </Card.Body>
                    </Card>
                </Col>

            </Row>

            <Card className="border-0 shadow-sm mb-4">

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
                                />
                            </InputGroup>
                        </Col>

                        <Col xs={12} md={3}>
                            <Form.Control
                                type="date"
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleFilterChange}
                            />
                        </Col>

                        <Col xs={12} md={3}>
                            <Form.Control
                                type="date"
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleFilterChange}
                            />
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
                                    <th>Quantity</th>
                                    <th>Total Price</th>
                                    <th>Sold By</th>
                                    <th>Date</th>

                                    {(canUpdate || canDelete) && (
                                        <th>Actions</th>
                                    )}
                                </tr>
                            </thead>

                            <tbody>

                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="text-center py-5"
                                        >
                                            <Spinner />
                                        </td>
                                    </tr>
                                ) : sales?.length ? (
                                    sales.map((sale, index) => (
                                        <tr key={sale._id}>

                                            <td>
                                                {((pagination?.page || 1) - 1) *
                                                    (pagination?.limit || 10) +
                                                    index +
                                                    1}
                                            </td>

                                            <td>
                                                {sale.plantId?.name ||
                                                    sale.plantId ||
                                                    "-"}
                                            </td>

                                            <td>
                                                {sale.quantity}
                                            </td>

                                            <td>
                                                Rs.{" "}
                                                {Number(
                                                    sale.totalPrice || 0
                                                ).toLocaleString()}
                                            </td>

                                            <td>
                                                {sale.soldBy?.userName ||
                                                    sale.soldBy ||
                                                    "-"}
                                            </td>

                                            <td>
                                                {sale.saleDate
                                                    ? new Date(
                                                        sale.saleDate
                                                    ).toLocaleDateString()
                                                    : "-"}
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
                                                                    sale
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
                                                                    sale._id
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
                                            colSpan="7"
                                            className="text-center py-5"
                                        >
                                            No sales found.
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
                                active={filters.page === page}
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
                        {editingSale
                            ? "Edit Sale"
                            : "Add Sale"}
                    </Modal.Title>
                </Modal.Header>

                <Form onSubmit={handleSubmit}>

                    <Modal.Body>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                Plant
                            </Form.Label>

                            <Form.Select
                                name="plantId"
                                value={formData.plantId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Select plant
                                </option>

                                {plants?.map((plant) => (
                                    <option
                                        key={plant._id}
                                        value={plant._id}
                                    >
                                        {plant.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                Quantity
                            </Form.Label>

                            <Form.Control
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                Total Price
                            </Form.Label>

                            <Form.Control
                                type="number"
                                name="totalPrice"
                                value={formData.totalPrice}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>
                                Sale Date
                            </Form.Label>

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

export default Sales;