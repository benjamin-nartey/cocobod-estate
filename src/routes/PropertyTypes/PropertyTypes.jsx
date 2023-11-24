import AddPropertyTypesForm from "../../components/AddPropertyTypesForm/AddPropertyTypesForm";
import PropertyTypesTable from "../../components/PropertyTypesTable/PropertyTypesTable";
function PropertyTypes() {
  return (
    <div className="w-full p-6">
      <div className="w-full flex justify-end mb-4">
        <AddPropertyTypesForm />
      </div>
      <PropertyTypesTable />
    </div>
  );
}

export default PropertyTypes;
