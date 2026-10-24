import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Categories from "./pages/Category";
import Users from "./pages/User";

// Auth components
import ProtectedRoute from "./components/auth/ProtectedRoutes";
import RoleRoute from "./components/auth/RoleRoute";

// Layout
import DashboardLayout from "./components/layouts/DashboardLayout";


const App = () => {
  return (
    <BrowserRouter>

      <Routes>

        {/* =====================================================
                    PUBLIC ROUTES
                ===================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* =====================================================
                    PROTECTED ROUTES
                ===================================================== */}

        <Route element={<ProtectedRoute />}>

          <Route element={<DashboardLayout />}>

            {/* ===============================
                            ALL AUTHENTICATED USERS
                        =============================== */}

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/inventory"
              element={<Inventory />}
            />

            <Route
              path="/sales"
              element={<Sales />}
            />


            {/* ===============================
                            ADMIN + MANAGER
                        =============================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    "Admin",
                    "Manager",
                  ]}
                />
              }
            >

              <Route
                path="/categories"
                element={<Categories />}
              />

            </Route>


            {/* ===============================
                            ADMIN ONLY
                        =============================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    "Admin",
                  ]}
                />
              }
            >

              <Route
                path="/users"
                element={<Users />}
              />

            </Route>

          </Route>

        </Route>


        {/* =====================================================
                    DEFAULT ROUTE
                ===================================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />


        {/* =====================================================
                    UNKNOWN ROUTE
                ===================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
};


export default App;