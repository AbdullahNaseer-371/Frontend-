
import { NavLink } from "react-router-dom";
import useRole from "../../hooks/useRole";
import {
    FaLeaf,
    FaThLarge,
    FaSeedling,
    FaShoppingCart,
    FaLayerGroup,
    FaUsers
} from "react-icons/fa";
import "../../styles/Sidebar.css";
const Sidebar = () => {
    const {
        isAdmin,
        isManager,
        isEmployee,
    } = useRole();

    const getLinkClass = ({ isActive }) =>
        `sidebar-link ${isActive ? "active" : ""}`;

    return (
        <aside className="sidebar">

            {/* Brand */}
            <div className="sidebar-brand">
                <div className="sidebar-brand-icon">
                    <FaLeaf />
                </div>

                <div className="sidebar-brand-text">
                    <h2>GreenLeaf</h2>
                    <span>Nursery Management</span>
                </div>
            </div>

            <div className="sidebar-divider" />

            {/* Navigation */}
            <nav className="sidebar-nav">

                <p className="sidebar-section-title">
                    MAIN MENU
                </p>

                <NavLink
                    to="/dashboard"
                    className={getLinkClass}
                >
                    <FaThLarge className="sidebar-icon" />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/inventory"
                    className={getLinkClass}
                >
                    <FaSeedling className="sidebar-icon" />
                    <span>Inventory</span>
                </NavLink>

                <NavLink
                    to="/sales"
                    className={getLinkClass}
                >
                    <FaShoppingCart className="sidebar-icon" />
                    <span>Sales</span>
                </NavLink>

                {/* Admin + Manager */}
                {(isAdmin || isManager) && (
                    <>
                        <p className="sidebar-section-title">
                            MANAGEMENT
                        </p>

                        <NavLink
                            to="/categories"
                            className={getLinkClass}
                        >
                            <FaLayerGroup className="sidebar-icon" />
                            <span>Categories</span>
                        </NavLink>
                    </>
                )}

                {/* Admin only */}
                {isAdmin && (
                    <NavLink
                        to="/users"
                        className={getLinkClass}
                    >
                        <FaUsers className="sidebar-icon" />
                        <span>Users</span>
                    </NavLink>
                )}

            </nav>

            {/* Sidebar Footer */}
            <div className="sidebar-footer">
                <div className="sidebar-footer-icon">
                    <FaLeaf />
                </div>

                <div>
                    <strong>GreenLeaf Nursery</strong>
                    <span>Inventory Management</span>
                </div>
            </div>

        </aside>
    );
};

export default Sidebar;
