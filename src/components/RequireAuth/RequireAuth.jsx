import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";

function RequireAuth() {
  const { authState } = useAuth();
  const location = useLocation();

  console.log({ authState });

  return authState?.email ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default RequireAuth;
