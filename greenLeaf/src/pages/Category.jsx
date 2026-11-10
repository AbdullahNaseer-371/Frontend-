import { useEffect, useState } from "react";
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

import useCategories from "../hooks/useCategory";
import usePermissions from "../hooks/usePermission";

const Categories = () => {
    const {
        categories,
        loading,
        error,
        success,
        getCategories,
        addCategory,
        editCategory,
        removeCategory,
        clearError,
        clearSuccess,
    } = useCategories();

    const {
        canCreate,
        canUpdate,
        canDelete,
    } = usePermissions();

    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    useEffect(() => {
        getCategories();
    }, []);

    useEffect(() => {
        if (success) {
            setShowModal(false);
            setEditingCategory(null);

            setFormData({
                name: "",
                description: "",
            });

            getCategories();
            clearSuccess();
        }
    }, [success]);

    const openAdd = () => {
        setEditingCategory(null);

        setFormData({
            name: "",
            description: "",
        });

        setImage(null);
        setImagePreview(null);

        setShowModal(true);
    };

    const openEdit = (category) => {
        setEditingCategory(category);

        setFormData({
            name: category.name || "",
            description: category.description || "",
        });

        setImage(null);
        setImagePreview(category.image?.url || null);

        setShowModal(true);
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5MB.");
            return;
        }

        setImage(file);
        setImagePreview(URL.createObjectURL(file));
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

        const data = new FormData();

        data.append("name", formData.name);
        data.append("description", formData.description);

        if (image) {
            data.append("image", image);
        }

        if (editingCategory) {
            await editCategory(editingCategory._id, data);
        } else {
            await addCategory(data);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this category?")) return;

        await removeCategory(id);
        getCategories();
    };

    return (
        <Container fluid className="dashboard-page">

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

                <div>
                    <h2>Categories</h2>

                    <p className="text-muted mb-0">
                        Manage plant categories.
                    </p>
                </div>

                {canCreate && (
                    <Button
                        variant="success"
                        onClick={openAdd}
                    >
                        <FaPlus className="me-2" />
                        Add Category
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

            <Card className="border-0 shadow-sm">

                <Card.Body className="p-0">

                    <div className="table-responsive">

                        <Table
                            hover
                            responsive
                            className="mb-0"
                        >

                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Image</th>
                                    {(canUpdate || canDelete) && (
                                        <th>Actions</th>
                                    )}
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
                                ) : categories?.length ? (
                                    categories.map(
                                        (category, index) => (
                                            <tr key={category._id}>

                                                <td>
                                                    {index + 1}
                                                </td>

                                                <td>
                                                    <strong>
                                                        {category.name}
                                                    </strong>
                                                </td>

                                                <td>
                                                    {category.description ||
                                                        "-"}
                                                </td>
                                                <td>
                                                    {category.image?.url ? (
                                                        <img
                                                            src={category.image.url}
                                                            alt={category.name}
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

                                                {(canUpdate || canDelete) && (
                                                    <td>

                                                        {canUpdate && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline-primary"
                                                                className="me-2"
                                                                onClick={() =>
                                                                    openEdit(
                                                                        category
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
                                                                        category._id
                                                                    )
                                                                }
                                                            >
                                                                <FaTrash />
                                                            </Button>
                                                        )}

                                                    </td>
                                                )}

                                            </tr>
                                        )
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="text-center py-5"
                                        >
                                            No categories found.
                                        </td>
                                    </tr>
                                )}

                            </tbody>

                        </Table>

                    </div>

                </Card.Body>
            </Card>

            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingCategory
                            ? "Edit Category"
                            : "Add Category"}
                    </Modal.Title>
                </Modal.Header>

                <Form onSubmit={handleSubmit}>

                    <Modal.Body>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                Category Name
                            </Form.Label>

                            <Form.Control
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>
                                Description
                            </Form.Label>

                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Category Image</Form.Label>

                            <Form.Control
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                            />

                            {imagePreview && (
                                <div className="mt-3">
                                    <img
                                        src={imagePreview}
                                        alt="Category Preview"
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
                                : editingCategory
                                    ? "Update Category"
                                    : "Add Category"}
                        </Button>

                    </Modal.Footer>

                </Form>
            </Modal>

        </Container>
    );
};

export default Categories;