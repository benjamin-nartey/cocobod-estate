import { useSnapshot } from 'valtio';
import AddAreasForm from '../../components/AddAreasForm/AddAreasForm';
import AreasTable from '../../components/AreasTable/AreasTable';
import state from '../../store/store';
import UploadCSV from '../../components/modals/uploads/uploadCsv';
AddAreasForm;
function Areas() {
  const snap = useSnapshot(state);
  const { showUploadModal } = snap.modalSlice;

  return (
    <div className="w-full p-6">
      <div className="w-full flex justify-end mb-4">
        <AddAreasForm />
      </div>
      <AreasTable />
      {showUploadModal && (
        <UploadCSV fieldName={'bulk-file'} uploadUrl={'/region/bulk-import'} />
      )}
    </div>
  );
}

export default Areas;
