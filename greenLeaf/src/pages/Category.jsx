import { useEffect, useState } from "react";
import useCategories from "../hooks/useCategory";
import CategoriesContainer from "./CatgeoryConatiner";
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

    const { canCreate, canUpdate, canDelete } = usePermissions();

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
    }, [getCategories]);

    // Release temporary browser image URLs when they are replaced or removed.
    useEffect(() => {
        return () => {
            if (imagePreview?.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    useEffect(() => {
        if (!success) return;

        setShowModal(false);
        setEditingCategory(null);
        setImage(null);
        setImagePreview(null);

        setFormData({
            name: "",
            description: "",
        });

        getCategories();
        clearSuccess();
    }, [success, getCategories, clearSuccess]);

    const resetForm = () => {
        setEditingCategory(null);
        setImage(null);
        setImagePreview(null);

        setFormData({
            name: "",
            description: "",
        });
    };

    const openAdd = () => {
        resetForm();
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

    const closeModal = () => {
        setShowModal(false);
        resetForm();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Please select a JPG, PNG, or WEBP image.");
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert("Category name is required.");
            return;
        }

        const data = new FormData();

        data.append("name", formData.name.trim());
        data.append("description", formData.description.trim());

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
        const confirmed = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmed) return;

        await removeCategory(id);
        await getCategories();
    };

    return (
        <CategoriesContainer
            categories={categories}
            loading={loading}
            error={error}
            showModal={showModal}
            editingCategory={editingCategory}
            formData={formData}
            imagePreview={imagePreview}
            canCreate={canCreate}
            canUpdate={canUpdate}
            canDelete={canDelete}
            onAdd={openAdd}
            onEdit={openEdit}
            onDelete={handleDelete}
            onClose={closeModal}
            onChange={handleChange}
            onImageChange={handleImageChange}
            onSubmit={handleSubmit}
            onClearError={clearError}
        />
    );
};

export default Categories;