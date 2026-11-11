import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchPlants } from "../redux/thunks/plantThunks";
import { fetchCategories } from "../redux/thunks/categoryThunks";
import {
    fetchSales,
    fetchSalesReport,
} from "../redux/thunks/saleThunks";

import DashboardContainer from "./DashboardContainer";

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
    }).format(Number(amount) || 0);

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        plants = [],
        pagination: plantPagination = {},
        loading: plantsLoading,
        error: plantsError,
    } = useSelector((state) => state.plants);

    const {
        categories = [],
        pagination: categoryPagination = {},
        loading: categoriesLoading,
        error: categoriesError,
    } = useSelector((state) => state.categories);

    const {
        sales = [],
        pagination: salesPagination = {},
        report,
        loading: salesLoading,
        reportLoading,
        error: salesError,
        reportError,
    } = useSelector((state) => state.sales);

    useEffect(() => {
        dispatch(fetchPlants({ page: 1, limit: 10 }));
        dispatch(fetchCategories({}));
        dispatch(fetchSales({}));
        dispatch(fetchSalesReport({}));
    }, [dispatch]);

    const salesReport = report?.report ?? report ?? {};

    const totalPlants = Number(
        plantPagination.total ?? plants.length
    );

    const totalCategories = Number(
        categoryPagination.total ?? categories.length
    );

    const totalSales = Number(
        salesReport.totalSales ??
        salesPagination.total ??
        sales.length
    );

    const totalQuantity = Number(
        salesReport.totalQuantity ??
        salesReport.totalPlantsSold ??
        0
    );

    const totalRevenue = Number(
        salesReport.totalRevenue ??
        salesReport.revenue ??
        0
    );

    const loading =
        plantsLoading ||
        categoriesLoading ||
        salesLoading ||
        reportLoading;

    const errors = [
        plantsError,
        categoriesError,
        salesError,
        reportError,
    ].filter(Boolean);

    const cards = [
        {
            title: "Total Plants",
            value: totalPlants,
            icon: "🌱",
            detail: "Plants in inventory",
            path: "/plants",
        },
        {
            title: "Total Categories",
            value: totalCategories,
            icon: "🪴",
            detail: "Available categories",
            path: "/categories",
        },
        {
            title: "Total Sales",
            value: totalSales,
            icon: "🛒",
            detail: "Recorded transactions",
            path: "/sales",
        },
        {
            title: "Total Revenue",
            value: formatCurrency(totalRevenue),
            icon: "💰",
            detail: "View revenue report",
            path: "/reports/revenue",
        },
    ];

    const handleCardClick = (path) => {
        navigate(path);
    };

    return (
        <DashboardContainer
            cards={cards}
            totalPlants={totalPlants}
            totalCategories={totalCategories}
            totalSales={totalSales}
            totalQuantity={totalQuantity}
            totalRevenue={totalRevenue}
            plantsLoaded={plants.length}
            categoriesLoaded={categories.length}
            loading={loading}
            errors={errors}
            formatCurrency={formatCurrency}
            onCardClick={handleCardClick}
        />
    );
};

export default Dashboard;