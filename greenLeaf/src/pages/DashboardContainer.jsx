import {
    Container,
    Row,
    Col,
    Card,
    Alert,
    Spinner,
} from "react-bootstrap";

import "../styles/dashboard.css";

const DashboardContainer = ({
    cards,
    totalPlants,
    totalCategories,
    totalSales,
    totalQuantity,
    totalRevenue,
    plantsLoaded,
    categoriesLoaded,
    loading,
    errors,
    formatCurrency,
    onCardClick,
}) => {
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
                                : error?.message || "Unable to load data."}
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
                        <Card
                            className="dashboard-stat-card dashboard-clickable-card h-100"
                            role="button"
                            tabIndex={0}
                            onClick={() => onCardClick(card.path)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    onCardClick(card.path);
                                }
                            }}
                        >
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
                                <strong>{plantsLoaded}</strong>
                            </div>

                            <div className="overview-row">
                                <span>Category Records Loaded</span>
                                <strong>{categoriesLoaded}</strong>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

            </Row>
        </Container>
    );
};

export default DashboardContainer;