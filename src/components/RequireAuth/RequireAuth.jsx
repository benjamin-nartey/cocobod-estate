import { useLocation, Navigate, Outlet } from 'react-router-dom';

import { useSnapshot } from 'valtio';

import state from '../../store/store';
import { hasAllowedPermission } from '../../utils/common';

function RequireAuth({ allowedPermissions }) {
  const snap = useSnapshot(state);

  const currentUser = snap.auth.currentUser;
  const loadingState = snap.auth.loadingState;

  const location = useLocation();

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
