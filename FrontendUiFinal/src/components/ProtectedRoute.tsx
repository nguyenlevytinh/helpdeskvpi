import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Permissions } from "../context/permissions";

interface ProtectedRouteProps {
  page: keyof typeof Permissions.pages; // Restrict page to valid keys of Permissions.pages
  children: React.ReactNode;
}

export const ProtectedRoute = ({ page, children }: ProtectedRouteProps) => {
  const { user, loadingUser } = useAuth();

  if (loadingUser) {
    return <div>Loading...</div>; // hoặc spinner
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const allowed = Permissions.pages[page]?.includes(user.role);
  if (!allowed) {
    return <Navigate to="/403" />;
  }

  return <>{children}</>;
};
