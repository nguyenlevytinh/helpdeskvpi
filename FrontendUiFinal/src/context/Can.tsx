import { useAuth } from "./AuthContext";
import { Permissions } from "./permissions";

interface CanProps {
  perform: keyof typeof Permissions.components;
  children: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({ perform, children }) => {
  const { user } = useAuth(); // Lấy user từ AuthContext

  if (!user) return null; // Nếu chưa đăng nhập, không hiển thị gì

  const allowedRoles = Permissions.components[perform]; // Lấy danh sách role được phép
  if (!allowedRoles) return null;

  return Array.isArray(allowedRoles) && allowedRoles.includes(user.role) ? <>{children}</> : null; // Kiểm tra role từ user.role
};
