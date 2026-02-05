import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./MainLayout";

import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Home from "../pages/Home";

import ServiceList from "../pages/user/ServiceList";
import BookingPage from "../pages/user/BookingPage";
import MyAppointments from "../pages/user/MyAppointments";

import ProviderDashboard from "../pages/provider/ProviderDashboard";
import ManageServices from "../pages/provider/ManageServices";
import ProviderBookings from "../pages/provider/ProviderBookings";
import ManageAvailability from "../pages/provider/ManageAvailability";

function MainRoutes() {
  return (
    <Routes>
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

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default MainRoutes;
