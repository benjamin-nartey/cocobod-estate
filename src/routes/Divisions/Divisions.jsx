import DivisionsTable from "../../components/DivisionsTable/DivisionsTable";
import AddDivisionsForm from "../../components/AddDivisionsForm/AddDivisionsForm";

function Divisions() {
  return (
    <div className="w-full p-6">
      <div className="w-full flex justify-end mb-4">
        <AddDivisionsForm />
      </div>
      <DivisionsTable />
    </div>
  );
}

export default Divisions;
