import { useLocation, Navigate, Outlet } from 'react-router-dom';

import { useSnapshot } from 'valtio';

import state from '../../store/store';

function RequireAuth({ allowedPermissions }) {
  const snap = useSnapshot(state);

  const currentUser = snap.auth.currentUser;
  const loadingState = snap.auth.loadingState;

  const location = useLocation();

  function hasAllowedPermission(user, allowedPermissions) {
    const userPermissions = user?.roles.flatMap((role) => role.permissions);

    return userPermissions?.some((permission) =>
      allowedPermissions?.includes(permission.name)
    );
  }

  if (
    hasAllowedPermission(currentUser, allowedPermissions) &&
    loadingState === false
  ) {
    return <Outlet />;
  } else if (
    !hasAllowedPermission(currentUser, allowedPermissions) &&
    loadingState === false
  ) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
}

export default RequireAuth;
