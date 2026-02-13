import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStores";
import { useThemeStore } from "./lib/useTheme";
import Layout from "./components/Layout";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";

// USER
import UserDashboard from "./pages/user/UserDashboard";
import CategoriesPage from "./pages/user/CategoriesPage";
import HelpersPage from "./pages/user/HelpersPage";
import BookingHistoryPage from "./pages/user/BookingHistoryPage";
import BookingDetailsPage from "./pages/user/BookingDetailsPage";
import UserSupport from "./pages/user/UserSupport";

// HELPER
import HelperDashboard from "./pages/helper/HelperDashboard";
import HelperBookingHistory from "./pages/helper/HelperBookingHistory";
import HelperBookingDetails from "./pages/helper/HelperBookingDetails";
import HelperSupport from "./pages/helper/HelperSupport";

// ADMIN
import AdminDashboard from "./pages/admin/AdminDashboard";
import ThemePage from "./pages/ThemePage";
import AdminHelpersPage from "./pages/admin/AdminHelpersPage";
import AdminBookingsPage from "./pages/admin/AdminBookingsPage";
import AdminSupportPage from "./pages/admin/AdminSupportPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";


// ================= ROLE BASED HOME REDIRECT =================
const HomeRedirect = () => {
  const { user, loading } = useAuthStore();

  if (loading) return null;

  if (!user) return <LandingPage />;

  if (user.role === "user") return <Navigate to="/user" replace />;
  if (user.role === "helper") return <Navigate to="/helper" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;

  return <LandingPage />;
};


function App() {
  const { checkAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div data-theme={theme} className="min-h-screen">

      <Layout>
        <Routes>

          {/* ROOT */}
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='/theme' element={<ThemePage/>}/>

          {/* ================= USER ROUTES ================= */}
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/user/categories" element={<CategoriesPage />} />
          <Route path="/user/helpers/:category" element={<HelpersPage />} />
          <Route path="/user/booking-history" element={<BookingHistoryPage />} />
          <Route path="/user/booking/:id" element={<BookingDetailsPage />} />
          <Route path="/user/support" element={<UserSupport />} />

          {/* ================= HELPER ROUTES ================= */}
          <Route path="/helper" element={<HelperDashboard />} />
          <Route path="/helper/history" element={<HelperBookingHistory />} />
          <Route path="/helper/booking/:id" element={<HelperBookingDetails />} />
          <Route path="/helper/support" element={<HelperSupport />} />

          {/* ================= ADMIN ROUTES ================= */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/helpers" element={<AdminHelpersPage />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          <Route path="/admin/support" element={<AdminSupportPage />} />


        </Routes>
      </Layout>

    </div>
  );
}

export default App;
