import { NavLink } from "react-router-dom";
import useRole from "../../hooks/useRole";

const Sidebar = () => {
    const {
        isAdmin,
        isManager,
        isEmployee,
    } = useRole();

    return (
        <aside className="sidebar">

            <h2>GreenLeaf</h2>

            <nav>

                {/* Everyone */}
                <NavLink to="/dashboard">
                    Dashboard
                </NavLink>

                <NavLink to="/inventory">
                    Inventory
                </NavLink>

                <NavLink to="/sales">
                    Sales
                </NavLink>


                {/* Admin + Manager */}
                {(isAdmin || isManager) && (
                    <NavLink to="/categories">
                        Categories
                    </NavLink>
                )}


                {/* Admin only */}
                {isAdmin && (
                    <NavLink to="/users">
                        Users
                    </NavLink>
                )}

            </nav>

        </aside>
    );
};

export default Sidebar;