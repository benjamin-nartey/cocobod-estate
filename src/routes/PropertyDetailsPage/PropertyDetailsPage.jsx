import { Outlet } from "react-router-dom/dist";

function PropertyDetailsPage() {
  return (
    <div className="w-full p-5">
      <Outlet />
    </div>
  );
}

export default PropertyDetailsPage;
