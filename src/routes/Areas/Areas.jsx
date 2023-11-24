import AddAreasForm from "../../components/AddAreasForm/AddAreasForm";
import AreasTable from "../../components/AreasTable/AreasTable";
AddAreasForm;
function Areas() {
  return (
    <div className="w-full p-6">
      <div className="w-full flex justify-end mb-4">
        <AddAreasForm />
      </div>
      <AreasTable />
    </div>
  );
}

export default Areas;
