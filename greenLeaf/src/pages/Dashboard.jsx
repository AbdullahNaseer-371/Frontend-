
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchPlants } from "../redux/thunks/plantThunks";
import { fetchCategories } from "../redux/thunks/categoryThunks";

import {
    fetchSales,
    fetchSalesReport,
} from "../redux/thunks/saleThunks";

import { logoutUser } from "../redux/thunks/auth.thunks";

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

    // PLANTS
    const {
        plants = [],
        pagination: plantPagination = {},
        loading: plantsLoading,
        error: plantsError,
    } = useSelector((state) => state.plants);

    // CATEGORIES
    const {
        categories = [],
        pagination: categoryPagination = {},
        loading: categoriesLoading,
        error: categoriesError,
    } = useSelector((state) => state.categories);

    // SALES
    const {
        sales = [],
        pagination: salesPagination = {},
        report,
        loading: salesLoading,
        reportLoading,
        error: salesError,
        reportError,
    } = useSelector((state) => state.sales);

    // FETCH DASHBOARD DATA
    useEffect(() => {
        dispatch(fetchPlants({ page: 1, limit: 10 }));
        dispatch(fetchCategories({}));
        dispatch(fetchSales({}));
        dispatch(fetchSalesReport({}));
    }, [dispatch]);

    // LOGOUT
    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();

        } catch (error) {
            console.error("Backend logout error:", error);

        } finally {
            navigate("/login", { replace: true });
        }
    };

    // SALES REPORT
    const salesReport = report?.report ?? report ?? {};

    // TOTAL PLANTS
    const totalPlants = Number(
        plantPagination.total ?? plants.length
    );

    // TOTAL CATEGORIES
    const totalCategories = Number(
        categoryPagination.total ?? categories.length
    );

    // TOTAL SALES
    const totalSales = Number(
        salesReport.totalSales ??
        salesPagination.total ??
        sales.length
    );

    // TOTAL QUANTITY SOLD
    const totalQuantity = Number(
        salesReport.totalQuantity ??
        salesReport.totalPlantsSold ??
        0
    );

    // TOTAL REVENUE
    const totalRevenue = Number(
        salesReport.totalRevenue ??
        salesReport.revenue ??
        0
    );

    // LOADING
    const loading =
        plantsLoading ||
        categoriesLoading ||
        salesLoading ||
        reportLoading;

    // ERRORS
    const errors = [
        plantsError,
        categoriesError,
        salesError,
        reportError,
    ].filter(Boolean);

    // DASHBOARD CARDS
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

    // CARD NAVIGATION
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
            onLogout={handleLogout}
        />
    );
};

export default Dashboard;
