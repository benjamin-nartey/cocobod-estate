import DepartmentsTable from "../../components/DepartmentsTable/DepartmentsTable";
import AddDepartmentsForm from "../../components/AddDepartmentsForm/AddDepartmentsForm";

function Departments() {
  return (
    <div className="w-full p-6">
      <div className="w-full flex justify-end mb-4">
        <AddDepartmentsForm />
      </div>
      <DepartmentsTable />
    </div>
  );
}

export default Departments;
