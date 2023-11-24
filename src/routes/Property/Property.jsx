import AddPropertyForm from "../../components/AddProperty/AddProperty";
import PropertyTable from "../../components/PropertyTable/PropertyTable";

function Property() {
  return (
    <div className="w-full p-6">
      <div className="w-full flex justify-end mb-4">
        <AddPropertyForm />
      </div>
      <PropertyTable />
    </div>
  );
}

export default Property;
