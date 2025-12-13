import { Navigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext.jsx";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isLoggedIn, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Hoặc một component spinner đẹp hơn
  }

  if (!isLoggedIn) {
    // Người dùng chưa đăng nhập, chuyển hướng đến trang login
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role?.name !== "ADMIN") {
    // Người dùng đã đăng nhập nhưng không phải Admin, chuyển hướng về trang chủ
    return <Navigate to="/" replace />;
  }

  return children;
}
