import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children, requireProvider = false }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireProvider && user?.role !== "PROVIDER") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
