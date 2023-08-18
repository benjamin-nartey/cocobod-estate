import { useLocation, Navigate, Outlet } from "react-router-dom";

import { useSnapshot } from "valtio";

import state from "../../store/store";

function RequireAuth({ allowedRoles }) {
  // const [authState, setAuthState] = useLocalStorage("authState", null);

  const snap = useSnapshot(state);

  const auth = snap.currentUser;

  console.log({ auth });
  

  //   const { authState } = useAuth();
  const location = useLocation();

  const areRolesAllowed = () => {
    const result = auth?.currentUser?.roles?.[0].permissions.find(
      (permission) => allowedRoles.includes(permission.name)
    )
      ? true
      : false;

    return result;
  };

  // console.log({ authState });

  console.log("areAllowedRoles", areRolesAllowed());

  console.log(
    auth?.currentUser?.roles?.[0].permissions.find((permission) =>
      allowedRoles.includes(permission.name)
    )
  );

  // if (auth.loadingState)
  //   return <Navigate to="/loadingPage" state={{ from: location }} replace />;

  return areRolesAllowed() ? (
    <Outlet />
  ) : snap.loadingState ? (
    <Navigate to="/loadingPage" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default RequireAuth;
