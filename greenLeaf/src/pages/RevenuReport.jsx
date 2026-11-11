
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Alert,
    Button,
    Card,
    Col,
    Container,
    Form,
    Row,
    Spinner,
} from "react-bootstrap";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

import { fetchSalesReport } from "../redux/thunks/saleThunks";
import "../styles/revenue-report.css";

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
    }).format(Number(amount) || 0);

const RevenueReport = () => {
    const dispatch = useDispatch();

    const {
        report,
        reportLoading,
        reportError,
    } = useSelector((state) => state.sales);

    // Empty dates mean ALL TIME.
    const [dates, setDates] = useState({
        startDate: "",
        endDate: "",
    });

    const [appliedDates, setAppliedDates] = useState({
        startDate: "",
        endDate: "",
    });

    // Load all-time report on page opening.
    useEffect(() => {
        dispatch(fetchSalesReport({}));
    }, [dispatch]);

    const salesReport = report?.report ?? report ?? {};

    const dailyRevenue = salesReport.dailyRevenue || [];
    const monthlyRevenue = salesReport.monthlyRevenue || [];

    const totalRevenue = Number(salesReport.totalRevenue || 0);
    const totalSales = Number(salesReport.totalSales || 0);
    const totalQuantity = Number(salesReport.totalQuantity || 0);

    const handleDateChange = (e) => {
        const { name, value } = e.target;

        setDates((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFilter = (e) => {
        e.preventDefault();

        if (
            dates.startDate &&
            dates.endDate &&
            dates.startDate > dates.endDate
        ) {
            alert("Start date cannot be after end date.");
            return;
        }

        setAppliedDates({ ...dates });

        dispatch(
            fetchSalesReport({
                ...(dates.startDate && {
                    startDate: dates.startDate,
                }),
                ...(dates.endDate && {
                    endDate: dates.endDate,
                }),
            })
        );
    };

    const handleReset = () => {
        const allTime = {
            startDate: "",
            endDate: "",
        };

        setDates(allTime);
        setAppliedDates(allTime);

        dispatch(fetchSalesReport({}));
    };

    const reportPeriod =
        appliedDates.startDate || appliedDates.endDate
            ? `${appliedDates.startDate || "Beginning"} to ${appliedDates.endDate || "Today"
            }`
            : "All Time";

    const chartTooltipStyle = {
        borderRadius: "10px",
        border: "1px solid #e5e7eb",
    };

    return (
        <Container fluid className="dashboard-page revenue-report-page">

            {/* HEADER */}
            <div className="revenue-header mb-4">
                <div>
                    <span className="dashboard-eyebrow">
                        GREENLEAF NURSERY
                    </span>

                    <h2>Revenue & Sales Reports</h2>

                    <p>
                        Analyze your nursery revenue, sales and plant
                        performance.
                    </p>
                </div>
            </div>

            {/* DATE FILTER */}
            <Card className="revenue-filter-card mb-4">
                <Card.Body>

                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                        <h5 className="mb-0">Report Filters</h5>

                        <span className="revenue-period">
                            {reportPeriod}
                        </span>
                    </div>

                    <Form onSubmit={handleFilter}>
                        <Row className="align-items-end g-3">

                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>
                                        Start Date
                                    </Form.Label>

                                    <Form.Control
                                        type="date"
                                        name="startDate"
                                        value={dates.startDate}
                                        max={dates.endDate || undefined}
                                        onChange={handleDateChange}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>
                                        End Date
                                    </Form.Label>

                                    <Form.Control
                                        type="date"
                                        name="endDate"
                                        value={dates.endDate}
                                        min={dates.startDate || undefined}
                                        onChange={handleDateChange}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <div className="d-flex gap-2">

                                    <Button
                                        type="submit"
                                        variant="success"
                                        disabled={reportLoading}
                                    >
                                        Apply Filter
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline-secondary"
                                        onClick={handleReset}
                                        disabled={reportLoading}
                                    >
                                        All Time
                                    </Button>

                                </div>
                            </Col>

                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* ERROR */}
            {reportError && (
                <Alert variant="danger">
                    {typeof reportError === "string"
                        ? reportError
                        : reportError.message ||
                        "Unable to load revenue report."}
                </Alert>
            )}

            {/* SUMMARY CARDS */}
            <Row className="g-4 mb-4">

                <Col xs={12} md={4}>
                    <Card className="revenue-summary-card h-100">
                        <Card.Body>
                            <span>Total Revenue</span>
                            <h3>{formatCurrency(totalRevenue)}</h3>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} md={4}>
                    <Card className="revenue-summary-card h-100">
                        <Card.Body>
                            <span>Total Transactions</span>
                            <h3>{totalSales}</h3>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} md={4}>
                    <Card className="revenue-summary-card h-100">
                        <Card.Body>
                            <span>Total Plants Sold</span>
                            <h3>{totalQuantity}</h3>
                        </Card.Body>
                    </Card>
                </Col>

            </Row>

            {reportLoading ? (
                <div className="revenue-loading">
                    <Spinner animation="border" />
                    <span>Loading reports...</span>
                </div>
            ) : (
                <>
                    {/* CHART 1: DAILY REVENUE */}
                    <Card className="revenue-chart-card mb-4">
                        <Card.Body>
                            <h5>Daily Revenue Trend</h5>

                            <p className="text-muted">
                                Revenue generated on each day.
                            </p>

                            {dailyRevenue.length > 0 ? (
                                <div className="revenue-chart">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={dailyRevenue}>
                                            <CartesianGrid strokeDasharray="3 3" />

                                            <XAxis dataKey="date" />

                                            <YAxis
                                                tickFormatter={(value) =>
                                                    `Rs. ${Number(value).toLocaleString("en-PK")}`
                                                }
                                            />

                                            <Tooltip
                                                contentStyle={chartTooltipStyle}
                                                formatter={(value) => [
                                                    formatCurrency(value),
                                                    "Revenue",
                                                ]}
                                            />

                                            <Legend />

                                            <Line
                                                type="monotone"
                                                dataKey="revenue"
                                                name="Revenue"
                                                stroke="#198754"
                                                strokeWidth={3}
                                                dot={{ r: 4 }}
                                                activeDot={{ r: 7 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="revenue-empty">
                                    No daily revenue data found.
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                    {/* CHART 2: DAILY TRANSACTIONS */}
                    <Card className="revenue-chart-card mb-4">
                        <Card.Body>
                            <h5>Daily Sales Transactions</h5>

                            <p className="text-muted">
                                Number of sales transactions per day.
                            </p>

                            {dailyRevenue.length > 0 ? (
                                <div className="revenue-chart">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={dailyRevenue}>
                                            <CartesianGrid strokeDasharray="3 3" />

                                            <XAxis dataKey="date" />

                                            <YAxis />

                                            <Tooltip />

                                            <Legend />

                                            <Bar
                                                dataKey="transactions"
                                                name="Transactions"
                                                fill="#3b82f6"
                                                radius={[5, 5, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="revenue-empty">
                                    No transaction data found.
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                    {/* CHART 3: PLANTS SOLD */}
                    <Card className="revenue-chart-card mb-4">
                        <Card.Body>
                            <h5>Plants Sold Over Time</h5>

                            <p className="text-muted">
                                Total plant quantities sold each day.
                            </p>

                            {dailyRevenue.length > 0 ? (
                                <div className="revenue-chart">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={dailyRevenue}>
                                            <CartesianGrid strokeDasharray="3 3" />

                                            <XAxis dataKey="date" />

                                            <YAxis />

                                            <Tooltip />

                                            <Legend />

                                            <Area
                                                type="monotone"
                                                dataKey="quantity"
                                                name="Plants Sold"
                                                stroke="#d69e2e"
                                                fill="#d69e2e"
                                                fillOpacity={0.25}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="revenue-empty">
                                    No quantity data found.
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                    {/* CHART 4: MONTHLY REVENUE */}
                    <Card className="revenue-chart-card mb-4">
                        <Card.Body>
                            <h5>Monthly Revenue</h5>

                            <p className="text-muted">
                                Revenue comparison by month.
                            </p>

                            {monthlyRevenue.length > 0 ? (
                                <div className="revenue-chart">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={monthlyRevenue}>
                                            <CartesianGrid strokeDasharray="3 3" />

                                            <XAxis dataKey="month" />

                                            <YAxis
                                                tickFormatter={(value) =>
                                                    `Rs. ${Number(value).toLocaleString("en-PK")}`
                                                }
                                            />

                                            <Tooltip
                                                formatter={(value) =>
                                                    formatCurrency(value)
                                                }
                                            />

                                            <Legend />

                                            <Bar
                                                dataKey="revenue"
                                                name="Monthly Revenue"
                                                fill="#198754"
                                                radius={[5, 5, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="revenue-empty">
                                    No monthly revenue data found.
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                    {/* DAILY REPORT TABLE */}
                    <Card className="revenue-chart-card">
                        <Card.Body>
                            <h5 className="mb-3">
                                Daily Revenue Details
                            </h5>

                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Transactions</th>
                                            <th>Quantity Sold</th>
                                            <th>Revenue</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {dailyRevenue.length > 0 ? (
                                            dailyRevenue.map((item) => (
                                                <tr key={item.date}>
                                                    <td>{item.date}</td>

                                                    <td>
                                                        {item.transactions ?? 0}
                                                    </td>

                                                    <td>
                                                        {item.quantity ?? 0}
                                                    </td>

                                                    <td>
                                                        <strong>
                                                            {formatCurrency(
                                                                item.revenue
                                                            )}
                                                        </strong>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="4"
                                                    className="text-center py-4"
                                                >
                                                    No records found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>
                </>
            )}

        </Container>
    );
};

export default RevenueReport;
