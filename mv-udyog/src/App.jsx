import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";

// AUTH
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import OtpVerification from "./pages/auth/OtpVerification";

// CUSTOMER
import Home from "./pages/home/Home";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import Profile from "./pages/profile/Profile";

import Orders from "./pages/order/Orders";
import OrderSuccess from "./pages/order/OrderSuccess";
import OrderTracking from "./pages/order/OrderTracking";

import Payments from "./pages/profile/Payments";
import Subscriptions from "./pages/profile/Subscriptions";

// ADMIN
import AdminDashboard from "./pages/admin/AdminDashboard";

import SplashScreen from "./pages/splash/SplashScreen";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH ROUTES */}
        <Route
  path="/splash"
  element={<SplashScreen />}
/>
        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/verify-otp"
          element={<OtpVerification />}
        />

        {/* SMART ROOT REDIRECT */}
        <Route
  path="/"
  element={
    <Navigate
      to="/splash"
      replace
    />
  }
/>

        {/* CUSTOMER ROUTES */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-success"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/track/:id"
          element={
            <ProtectedRoute>
              <OrderTracking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subscriptions"
          element={
            <ProtectedRoute>
              <Subscriptions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}

        <Route
  path="/admin-login"
  element={<AdminLogin />}
/>
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;