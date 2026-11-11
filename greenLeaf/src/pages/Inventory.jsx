
import { useEffect, useState } from "react";

import usePlants from "../hooks/usePlants";
import useCategories from "../hooks/useCategory";
import usePermissions from "../hooks/usePermission";

import InventoryContainer from "./InvenotryConatiner";

const initialFormData = {
    name: "",
    category: "",
    price: "",
    stock: "",
    status: "active",
};

const Inventory = () => {

    // =====================================
    // STATES
    // =====================================

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [editingPlant, setEditingPlant] = useState(null);

    const [formData, setFormData] = useState(initialFormData);

    const [filters, setFilters] = useState({
        search: "",
        category: "",
        status: "",
        page: 1,
        limit: 10,
    });

    // =====================================
    // PLANT HOOK
    // =====================================

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

    // =====================================
    // CATEGORY HOOK
    // =====================================

    const {
        categories,
        getCategories,
    } = useCategories();

    const categoryList = Array.isArray(categories)
        ? categories
        : [];

    // =====================================
    // PERMISSIONS
    // =====================================

    const {
        canCreate,
        canUpdate,
        canDelete,
    } = usePermissions();

    // =====================================
    // LOAD DATA
    // =====================================

    useEffect(() => {
        getCategories();
    }, []);

    useEffect(() => {
        getPlants(filters);
    }, [
        filters.search,
        filters.category,
        filters.status,
        filters.page,
        filters.limit,
    ]);

    // =====================================
    // SUCCESS HANDLING
    // =====================================

    useEffect(() => {
        if (!success) return;

        setShowModal(false);
        setEditingPlant(null);
        setFormData(initialFormData);

        setImage(null);
        setImagePreview(null);

        getPlants(filters);

        const timer = setTimeout(() => {
            clearSuccess();
        }, 2500);

        return () => clearTimeout(timer);
    }, [success]);

    // =====================================
    // IMAGE PREVIEW CLEANUP
    // =====================================

    useEffect(() => {
        return () => {
            if (imagePreview?.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    // =====================================
    // FILTER HANDLER
    // =====================================

    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        setFilters((prev) => ({
            ...prev,
            [name]: value,
            page: 1,
        }));
    };

    // =====================================
    // FORM RESET
    // =====================================

    const resetForm = () => {
        setFormData(initialFormData);
        setImage(null);
        setImagePreview(null);
    };

    // =====================================
    // OPEN ADD MODAL
    // =====================================

    const handleOpenAdd = () => {
        setEditingPlant(null);
        resetForm();
        clearError();
        setShowModal(true);
    };

    // =====================================
    // OPEN EDIT MODAL
    // =====================================

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

    // =====================================
    // IMAGE HANDLER
    // =====================================

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

    // =====================================
    // FORM HANDLER
    // =====================================

    const handleFormChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =====================================
    // SUBMIT HANDLER
    // =====================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert("Plant name is required.");
            return;
        }

        if (!formData.category) {
            alert("Please select a category.");
            return;
        }

        if (
            formData.price === "" ||
            Number(formData.price) < 0 ||
            !Number.isFinite(Number(formData.price))
        ) {
            alert("Please enter a valid price.");
            return;
        }

        if (
            formData.stock === "" ||
            Number(formData.stock) < 0 ||
            !Number.isInteger(Number(formData.stock))
        ) {
            alert("Please enter a valid stock quantity.");
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

    // =====================================
    // DELETE HANDLER
    // =====================================

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

    // =====================================
    // CLOSE MODAL
    // =====================================

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingPlant(null);
        resetForm();
        clearError();
    };

    // =====================================
    // PAGINATION
    // =====================================

    const totalPages = pagination?.pages || 1;

    // =====================================
    // RENDER CONTAINER
    // =====================================

    return (
        <InventoryContainer
            canCreate={canCreate}
            canUpdate={canUpdate}
            canDelete={canDelete}

            plants={plants}
            categories={categoryList}
            pagination={pagination}

            loading={loading}
            error={error}
            success={success}

            clearError={clearError}

            filters={filters}
            setFilters={setFilters}
            handleFilterChange={handleFilterChange}

            totalPages={totalPages}

            handleOpenAdd={handleOpenAdd}
            handleOpenEdit={handleOpenEdit}
            handleDelete={handleDelete}

            showModal={showModal}
            setShowModal={setShowModal}
            handleCloseModal={handleCloseModal}

            editingPlant={editingPlant}

            formData={formData}
            handleFormChange={handleFormChange}
            handleSubmit={handleSubmit}

            handleImageChange={handleImageChange}
            imagePreview={imagePreview}
        />
    );
};

export default Inventory;
