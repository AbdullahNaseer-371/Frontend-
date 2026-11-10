
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Container,
    Row,
    Col,
    Card,
    Alert,
    Spinner,
} from "react-bootstrap";

import { fetchPlants } from "../redux/thunks/plantThunks";
import { fetchCategories } from "../redux/thunks/categoryThunks";

import {
    fetchSales,
    fetchSalesReport,
} from "../redux/thunks/saleThunks";

import "../styles/dashboard.css";

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
    }).format(Number(amount) || 0);

const Dashboard = () => {
    const dispatch = useDispatch();

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

    // REPORT DATA
    const salesReport = report?.report ?? report ?? {};

    // TOTAL COUNTS
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
        },
        {
            title: "Total Categories",
            value: totalCategories,
            icon: "🪴",
            detail: "Available categories",
        },
        {
            title: "Total Sales",
            value: totalSales,
            icon: "🛒",
            detail: "Recorded transactions",
        },
        {
            title: "Total Revenue",
            value: formatCurrency(totalRevenue),
            icon: "💰",
            detail: "All-time sales revenue",
        },
    ];

    return (
        <Container fluid className="dashboard-page">

            {/* HEADER */}
            <div className="dashboard-header">
                <div>
                    <span className="dashboard-eyebrow">
                        GREENLEAF NURSERY
                    </span>

                    <h2>Dashboard Overview</h2>

                    <p>
                        Monitor your inventory, categories and sales.
                    </p>
                </div>

                <div className="dashboard-status">
                    <span className="status-dot"></span>
                    Management Panel
                </div>
            </div>

            {/* ERRORS */}
            {errors.length > 0 && (
                <Alert variant="danger" className="dashboard-alert">
                    {errors.map((error, index) => (
                        <div key={index}>
                            {typeof error === "string"
                                ? error
                                : error?.message ||
                                "Unable to load data."}
                        </div>
                    ))}
                </Alert>
            )}

            {/* LOADING */}
            {loading && (
                <div className="dashboard-loading">
                    <Spinner animation="border" size="sm" />
                    <span>Loading dashboard data...</span>
                </div>
            )}

            {/* STAT CARDS */}
            <Row className="g-4">
                {cards.map((card) => (
                    <Col
                        xs={12}
                        sm={6}
                        xl={3}
                        key={card.title}
                    >
                        <Card className="dashboard-stat-card">
                            <Card.Body>
                                <div className="stat-card-top">
                                    <div className="stat-icon">
                                        {card.icon}
                                    </div>

                                    <span className="stat-label">
                                        {card.title}
                                    </span>
                                </div>

                                <h3 className="stat-value">
                                    {card.value}
                                </h3>

                                <p className="stat-description">
                                    {card.detail}
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* OVERVIEW PANELS */}
            <Row className="mt-4 g-4">

                {/* SALES */}
                <Col lg={7}>
                    <Card className="dashboard-panel h-100">
                        <Card.Body>
                            <h5 className="panel-title">
                                Sales Overview
                            </h5>

                            <div className="overview-row">
                                <span>Total Sales</span>
                                <strong>{totalSales}</strong>
                            </div>

                            <div className="overview-row">
                                <span>Total Plants Sold</span>
                                <strong>{totalQuantity}</strong>
                            </div>

                            <div className="overview-row">
                                <span>Total Revenue</span>
                                <strong>
                                    {formatCurrency(totalRevenue)}
                                </strong>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* INVENTORY */}
                <Col lg={5}>
                    <Card className="dashboard-panel h-100">
                        <Card.Body>
                            <h5 className="panel-title">
                                Inventory Summary
                            </h5>

                            <div className="overview-row">
                                <span>Total Plants</span>
                                <strong>{totalPlants}</strong>
                            </div>

                            <div className="overview-row">
                                <span>Total Categories</span>
                                <strong>{totalCategories}</strong>
                            </div>

                            <div className="overview-row">
                                <span>Plant Records Loaded</span>
                                <strong>{plants.length}</strong>
                            </div>

                            <div className="overview-row">
                                <span>Category Records Loaded</span>
                                <strong>{categories.length}</strong>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

            </Row>

        </Container>
    );
};

export default Dashboard;
