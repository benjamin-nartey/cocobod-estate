import UsersTable from "../../components/UsersTable/UsersTable";
import AddUsersForm from "../../components/AddUsersForm/AddUsersForm";

function Users() {
  return (
    <div className="w-full p-6">
      <div className="w-full flex justify-end mb-4">
        <AddUsersForm />
      </div>
      <UsersTable />
    </div>
  );
}

export default Users;
