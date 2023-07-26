import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocalStorage } from "../../Hooks/useLocalStorage";
import useAuth from "../../Hooks/useAuth";

function RequireAuth({ allowedRoles }) {
  const [authState, setAuthState] = useLocalStorage("authState", null);

  //   const { authState } = useAuth();
  const location = useLocation();

  const areRolesAllowed = () => {
    const result = authState?.currentUser?.roles?.[0].permissions.find(
      (permission) => allowedRoles.includes(permission.name)
    )
      ? true
      : false;

    return result;
  };

  console.log({ authState });

  console.log("areAllowedRoles", areRolesAllowed());

  console.log(
    authState?.currentUser?.roles?.[0].permissions.find((permission) =>
      allowedRoles.includes(permission.name)
    )
  );

  return areRolesAllowed() ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default RequireAuth;
