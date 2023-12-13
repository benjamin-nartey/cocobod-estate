import { useLocation, Navigate, Outlet } from "react-router-dom";

import { useSnapshot } from "valtio";

import state from "../../store/store";

function RequireAuth({ allowedRoles }) {
  const snap = useSnapshot(state);

  const auth = snap.currentUser;

  const location = useLocation();

  const areRolesAllowed = () => {
    const result = auth?.currentUser?.roles?.find((role) =>
      allowedRoles.includes(role.name)
    )
      ? true
      : false;

    return result;
  };

  return areRolesAllowed() ? (
    <Outlet />
  ) : auth?.currentUser?.staff?.name ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default RequireAuth;
