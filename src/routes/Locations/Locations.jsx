import AddLocationsForm from "../../components/AddLocationsForm/AddLocationsForm";
import LocationsTable from "../../components/LocationsTable/LocationsTable";
function Locations() {
  return (
    <div className="w-full p-6">
      <div className="w-full flex justify-end mb-4">
        <AddLocationsForm />
      </div>
      <LocationsTable />
    </div>
  );
}

export default Locations;
