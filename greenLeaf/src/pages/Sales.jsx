
import { useEffect, useState } from "react";

import useSales from "../hooks/useSale";
import usePlants from "../hooks/usePlants";
import usePermissions from "../hooks/usePermission";
import SalesContainer from "./SaleContainer";

const EMPTY_FORM = {
    plantId: "",
    quantity: "",
    totalPrice: "",
    saleDate: "",
};

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
        clearError,
        clearSuccess,
    } = useSales();

    const { plants, getPlants } = usePlants();

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
    const [formData, setFormData] = useState(EMPTY_FORM);

    // Fetch sales whenever filters change.
    useEffect(() => {
        getSales(filters);
    }, [
        filters.search,
        filters.startDate,
        filters.endDate,
        filters.page,
        filters.limit,
    ]);

    // Fetch sales report.
    useEffect(() => {
        getSalesReport({
            startDate: filters.startDate,
            endDate: filters.endDate,
        });
    }, [filters.startDate, filters.endDate]);

    // Fetch plants.
    useEffect(() => {
        getPlants();
    }, []);

    // Close modal after successful create/update.
    useEffect(() => {
        if (!success) return;

        setShowModal(false);
        setEditingSale(null);
        setFormData(EMPTY_FORM);

        clearSuccess();
    }, [success]);

    // Find selected plant using its ID.
    const selectedPlant = Array.isArray(plants)
        ? plants.find(
            (plant) =>
                String(plant._id) === String(formData.plantId)
        )
        : null;

    // Get unit price from the Plant model.
    const unitPrice = Number(selectedPlant?.price || 0);

    // Automatically calculate total price.
    const computedTotalPrice =
        Number(formData.quantity) > 0
            ? unitPrice * Number(formData.quantity)
            : 0;

    // Keep totalPrice synchronized with selected plant and quantity.
    useEffect(() => {
        setFormData((previous) => ({
            ...previous,
            totalPrice: computedTotalPrice,
        }));
    }, [computedTotalPrice]);

    const getPlantName = (plant) => {
        if (!plant) return "-";

        if (typeof plant === "string") return plant;

        return (
            plant.name ||
            plant.plantName ||
            plant.sku ||
            plant._id ||
            "-"
        );
    };

    const getSoldByName = (soldBy) => {
        if (!soldBy) return "-";

        if (typeof soldBy === "string") return soldBy;

        return (
            soldBy.userName ||
            soldBy.name ||
            soldBy.email ||
            soldBy._id ||
            "-"
        );
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;

        setFilters((previous) => ({
            ...previous,
            [name]: value,
            page: 1,
        }));
    };

    // Open add modal.
    const handleOpenAdd = () => {
        setEditingSale(null);
        setFormData(EMPTY_FORM);
        setShowModal(true);
    };

    // Open edit modal.
    const handleOpenEdit = (sale) => {
        setEditingSale(sale);

        setFormData({
            plantId:
                typeof sale.plantId === "object"
                    ? sale.plantId?._id || ""
                    : sale.plantId || "",
            quantity: sale.quantity ?? "",
            totalPrice: sale.totalPrice ?? "",
            saleDate: sale.saleDate
                ? new Date(sale.saleDate)
                    .toISOString()
                    .slice(0, 10)
                : "",
        });

        setShowModal(true);
    };

    // Handle form changes.
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // Submit sale.
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !formData.plantId ||
            !selectedPlant ||
            Number(formData.quantity) <= 0
        ) {
            return;
        }

        const payload = {
            plantId: formData.plantId,
            quantity: Number(formData.quantity),
            totalPrice: computedTotalPrice,
            saleDate: formData.saleDate,
        };

        if (editingSale) {
            await editSale(editingSale._id, payload);
        } else {
            await addSale(payload);
        }

        await getSales(filters);

        await getSalesReport({
            startDate: filters.startDate,
            endDate: filters.endDate,
        });
    };

    // Delete sale.
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this sale?"
        );

        if (!confirmed) return;

        await removeSale(id);

        await getSales(filters);

        await getSalesReport({
            startDate: filters.startDate,
            endDate: filters.endDate,
        });
    };

    const reportRevenue =
        report?.totalRevenue ??
        report?.revenue ??
        0;

    const totalPages = pagination?.pages ?? 1;

    return (
        <SalesContainer
            canCreate={canCreate}
            canUpdate={canUpdate}
            canDelete={canDelete}
            handleOpenAdd={handleOpenAdd}
            error={error}
            clearError={clearError}
            pagination={pagination}
            sales={sales}
            reportRevenue={reportRevenue}
            filters={filters}
            handleFilterChange={handleFilterChange}
            setFilters={setFilters}
            loading={loading}
            getPlantName={getPlantName}
            getSoldByName={getSoldByName}
            handleOpenEdit={handleOpenEdit}
            handleDelete={handleDelete}
            totalPages={totalPages}
            showModal={showModal}
            setShowModal={setShowModal}
            editingSale={editingSale}
            handleSubmit={handleSubmit}
            formData={formData}
            handleChange={handleChange}
            plants={plants}
            unitPrice={unitPrice}
            computedTotalPrice={computedTotalPrice}
        />
    );
};

export default Sales;
