import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  adminOnly = false,
}) {
  const token = localStorage.getItem("token");

  let user = null;

  try {
    const userData =
      localStorage.getItem("user");

    if (userData) {
      user = JSON.parse(userData);
    }
  } catch (error) {
    console.error(
      "Failed to parse user:",
      error
    );

    localStorage.removeItem("user");
  }

  // NOT LOGGED IN
  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ADMIN ROUTE PROTECTION
  if (
    adminOnly &&
    user?.role !== "ADMIN"
  ) {
    return (
      <Navigate
        to="/home"
        replace
      />
    );
  }

  // CUSTOMER ROUTE PROTECTION
  if (
    !adminOnly &&
    user?.role === "ADMIN"
  ) {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }

  return children;
}