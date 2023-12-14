import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useOnlineStatus } from "../../Hooks/useIsOnlineStatus";
import { useIndexedDB } from "react-indexed-db-hook";

import { useSnapshot } from "valtio";

import state from "../../store/store";
import { useEffect, useState } from "react";

function RequireAuth({ allowedRoles }) {
  const isOnLine = useOnlineStatus();
  // const { getAll: getAllUser } = useIndexedDB("offlineUser");
  const [authUser, sethAuthUser] = useState(null);

  // useEffect(() => {
  //   getAllUser().then((user) => sethAuthUser(user));
  // }, [authUser]);

  if (isOnLine) {
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
  } else {
    const location = useLocation();

    const areRolesAllowed = () => {
      const result = authUser[0]?.roles?.find((role) =>
        allowedRoles.includes(role.name)
      )
        ? true
        : false;

      return result;
    };

    return areRolesAllowed() ? (
      <Outlet />
    ) : authUser[0]?.staff?.name ? (
      <Navigate to="/unauthorized" state={{ from: location }} replace />
    ) : (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  }
}

export default RequireAuth;
