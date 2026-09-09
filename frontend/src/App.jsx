import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import MapExplore from "./pages/MapExplore.jsx";
import SoldierDetail from "./pages/SoldierDetail.jsx";
import Login from "./pages/Login.jsx";
import RegisterFamily from "./pages/RegisterFamily.jsx";
import RegisterSoldierForm from "./pages/RegisterSoldierForm.jsx";
import FamilyDashboard from "./pages/FamilyDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminReview from "./pages/AdminReview.jsx";
import NotFound from "./pages/NotFound.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-strip">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <div className="chevron-strip" />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/map" element={<MapExplore />} />
        <Route path="/soldiers/:id" element={<SoldierDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterFamily />} />

        <Route
          path="/family/dashboard"
          element={
            <ProtectedRoute role="FAMILY">
              <FamilyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/family/soldiers/new"
          element={
            <ProtectedRoute role="FAMILY">
              <RegisterSoldierForm audience="family" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/soldiers/new"
          element={
            <ProtectedRoute role="ADMIN">
              <RegisterSoldierForm audience="admin" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/soldiers/:id/review"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminReview />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}
