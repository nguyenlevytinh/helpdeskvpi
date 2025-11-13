import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Permissions } from "../context/permissions";

interface ProtectedRouteProps {
  page: keyof typeof Permissions.pages; // Restrict page to valid keys of Permissions.pages
  children: React.ReactNode;
}

export const ProtectedRoute = ({ page, children }: ProtectedRouteProps) => {
  const { user } = useAuth(); // Lấy user từ AuthContext

  if (!user) return <Navigate to="/login" />; // Nếu chưa đăng nhập, chuyển hướng đến trang login

  const allowed = Permissions.pages[page]?.includes(user.role); // Kiểm tra quyền truy cập
  if (!allowed) return <Navigate to="/403" />; // Nếu không có quyền, chuyển hướng đến trang 403

  return <>{children}</>; // Nếu có quyền, hiển thị nội dung
};
