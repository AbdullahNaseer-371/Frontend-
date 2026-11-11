import {
    Alert,
    Button,
    Card,
    Col,
    Container,
    Form,
    Modal,
    Row,
    Spinner,
    Table,
} from "react-bootstrap";

import {
    FaEdit,
    FaPlus,
    FaTrash,
} from "react-icons/fa";

import "../styles/categories.css";

const CategoriesContainer = ({
    categories,
    loading,
    error,
    showModal,
    editingCategory,
    formData,
    imagePreview,
    canCreate,
    canUpdate,
    canDelete,
    onAdd,
    onEdit,
    onDelete,
    onClose,
    onChange,
    onImageChange,
    onSubmit,
    onClearError,
}) => {
    const showActions = canUpdate || canDelete;

    const columnCount = showActions ? 5 : 4;

    return (
        <Container fluid className="dashboard-page categories-page">

            {/* Page Header */}
            <Row className="align-items-center mb-4 g-3">
                <Col>
                    <div className="categories-heading">
                        <h2>Categories</h2>
                        <p>Manage your plant categories.</p>
                    </div>
                </Col>

                {canCreate && (
                    <Col xs="auto">
                        <Button
                            className="category-add-btn"
                            onClick={onAdd}
                        >
                            <FaPlus className="me-2" />
                            Add Category
                        </Button>
                    </Col>
                )}
            </Row>

            {/* Error Alert */}
            {error && (
                <Alert
                    variant="danger"
                    dismissible
                    onClose={onClearError}
                >
                    {error}
                </Alert>
            )}

            {/* Category Table */}
            <Card className="category-table-card">
                <Card.Body className="p-0">

                    <div className="table-responsive">
                        <Table
                            hover
                            className="categories-table mb-0"
                        >
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Category Name</th>
                                    <th>Description</th>
                                    <th>Image</th>

                                    {showActions && (
                                        <th className="text-center">
                                            Actions
                                        </th>
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
                                            <p className="mb-0 mt-2 text-muted">
                                                Loading categories...
                                            </p>
                                        </td>
                                    </tr>
                                ) : categories?.length > 0 ? (
                                    categories.map((category, index) => (
                                        <tr key={category._id}>
                                            <td>{index + 1}</td>

                                            <td>
                                                <strong>
                                                    {category.name}
                                                </strong>
                                            </td>

                                            <td>
                                                <span className="category-description">
                                                    {category.description || "-"}
                                                </span>
                                            </td>

                                            <td>
                                                {category.image?.url ? (
                                                    <img
                                                        src={category.image.url}
                                                        alt={category.name}
                                                        className="category-table-image"
                                                    />
                                                ) : (
                                                    <span className="text-muted">
                                                        No Image
                                                    </span>
                                                )}
                                            </td>

                                            {showActions && (
                                                <td className="text-center">
                                                    <div className="category-actions">

                                                        {canUpdate && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline-primary"
                                                                title="Edit category"
                                                                onClick={() =>
                                                                    onEdit(category)
                                                                }
                                                            >
                                                                <FaEdit />
                                                            </Button>
                                                        )}

                                                        {canDelete && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline-danger"
                                                                title="Delete category"
                                                                onClick={() =>
                                                                    onDelete(category._id)
                                                                }
                                                            >
                                                                <FaTrash />
                                                            </Button>
                                                        )}

                                                    </div>
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
                                            <div className="category-empty">
                                                <h5>No Categories Found</h5>
                                                <p>
                                                    Add a category to organize
                                                    your nursery plants.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            {/* Add / Edit Modal */}
            <Modal
                show={showModal}
                onHide={onClose}
                centered
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingCategory
                            ? "Edit Category"
                            : "Add Category"}
                    </Modal.Title>
                </Modal.Header>

                <Form onSubmit={onSubmit}>
                    <Modal.Body>

                        <Form.Group className="mb-3">
                            <Form.Label>Category Name</Form.Label>

                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Enter category name"
                                value={formData.name}
                                onChange={onChange}
                                required
                                maxLength={100}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>

                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="description"
                                placeholder="Enter category description"
                                value={formData.description}
                                onChange={onChange}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Category Image</Form.Label>

                            <Form.Control
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={onImageChange}
                            />

                            <Form.Text className="text-muted">
                                JPG, PNG or WEBP. Maximum size: 5MB.
                            </Form.Text>

                            {imagePreview && (
                                <div className="category-image-preview">
                                    <img
                                        src={imagePreview}
                                        alt="Category preview"
                                    />
                                </div>
                            )}
                        </Form.Group>

                    </Modal.Body>

                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            className="category-submit-btn"
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
                            ) : editingCategory ? (
                                "Update Category"
                            ) : (
                                "Add Category"
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

        </Container>
    );
};

export default CategoriesContainer;