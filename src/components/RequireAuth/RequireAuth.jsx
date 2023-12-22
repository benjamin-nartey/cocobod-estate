import { useLocation, Navigate, Outlet } from 'react-router-dom';

import { useSnapshot } from 'valtio';

import state from '../../store/store';

function RequireAuth({ allowedRoles }) {
  const snap = useSnapshot(state);

  const currentUser = snap.auth.currentUser;
  const loadingState = snap.auth.loadingState;

  const location = useLocation();

  const areRolesAllowed = () => {
    const result = currentUser?.roles?.find((role) =>
      allowedRoles.includes(role.name)
    )
      ? true
      : false;

    return result;
  };

  if (areRolesAllowed() && loadingState === false) {
    return <Outlet />;
  } else if (currentUser?.staff?.name) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  } else if (!areRolesAllowed() && loadingState === false) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // return areRolesAllowed() ? (
  //   <Outlet />
  // ) : currentUser?.staff?.name ? (
  //   <Navigate to="/unauthorized" state={{ from: location }} replace />
  // ) : (
  //   <Navigate to="/login" state={{ from: location }} replace />
  // );
}

export default RequireAuth;
