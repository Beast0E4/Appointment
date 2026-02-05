import { Routes, Route, Navigate } from "react-router-dom";

// Layout
import MainLayout from "./MainLayout";

// Route Guards
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Common Pages
import Home from "../pages/Home";

// User Pages
import ServiceList from "../pages/user/ServiceList";
import BookingPage from "../pages/user/BookingPage";
import MyAppointments from "../pages/user/MyAppointments";

// Provider Pages
import ProviderDashboard from "../pages/provider/ProviderDashboard";
import ManageServices from "../pages/provider/ManageServices";
import ProviderBookings from "../pages/provider/ProviderBookings";
import ManageAvailability from "../pages/Provider/ManageAvailability";

function MainRoutes() {
  return (
    <Routes>
      {/* ---------- Public Auth Routes (NO NAVBAR) ---------- */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* ---------- Routes WITH NAVBAR ---------- */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        {/* User Routes */}
        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <ServiceList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book/:serviceId"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-appointments"
          element={
            <ProtectedRoute>
              <MyAppointments />
            </ProtectedRoute>
          }
        />

        {/* Provider Routes */}
        <Route
          path="/provider/dashboard"
          element={
            <ProtectedRoute requireProvider>
              <ProviderDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/provider/services"
          element={
            <ProtectedRoute requireProvider>
              <ManageServices />
            </ProtectedRoute>
          }
        />

        <Route
          path="/provider/availability/:serviceId"
          element={
            <ProtectedRoute requireProvider>
              <ManageAvailability />
            </ProtectedRoute>
          }
        />

        <Route
          path="/provider/bookings"
          element={
            <ProtectedRoute requireProvider>
              <ProviderBookings />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ---------- Fallback ---------- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default MainRoutes;
