
import { Outlet } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

import Sidebar from "./Slider";

import "../../styles/dashboard-layout.css";

const DashboardLayout = () => {
    return (
        <Container fluid className="dashboard-layout p-0">
            <Row className="g-0 min-vh-100">

                {/* Sidebar */}
                <Col xs="auto" className="dashboard-sidebar-column">
                    <Sidebar />
                </Col>

                {/* Main Dashboard Content */}
                <Col className="dashboard-content-column">
                    <main className="dashboard-content">
                        <Outlet />
                    </main>
                </Col>

            </Row>
        </Container>
    );
};

export default DashboardLayout;
