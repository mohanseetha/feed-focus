import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  const location = useLocation();
  const isAuthRoute = location.pathname.startsWith("/auth");

  if (!user && !isAuthRoute) {
    return <Navigate to="/tryit" replace />;
  }

  return children;
};

export default ProtectedRoute;
