import { Navigate } from 'react-router-dom';
import { useAppContext } from '../components/AppContext';

type Props = {
  children: React.ReactNode;
};

const PrivateRoute = ({ children }: Props) => {
  const { state } = useAppContext();
  const isAuthenticated = !!state.token;

  // Nếu chưa đăng nhập → chuyển hướng sang login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
