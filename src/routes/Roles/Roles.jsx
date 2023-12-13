import AddRolesForm from "../../components/AddRolesForm/AddRolesForm";
import RolesTable from "../../components/RolesTable/RolesTable";

function Roles() {
  return (
    <div className="w-full p-6">
      <div className="w-full flex justify-end mb-4">
        <AddRolesForm />
      </div>
      <RolesTable />
    </div>
  );
}

export default Roles;
