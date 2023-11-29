import { Button, Input, Popconfirm, Table } from 'antd';
import React from 'react';
import { useSnapshot } from 'valtio';
import state from '../../store/store';
import AddDeploymentModal from '../../modals/deployment/add';
import { DeleteOutlined } from '@ant-design/icons';
import { BiEdit } from 'react-icons/bi';

const columns = [
  {
    title: 'Staff',
    dataIndex: 'staff',
    key: 'staff',
  },
  {
    title: 'Region',
    dataIndex: 'region',
    key: 'region',
  },
  {
    title: 'Action',
    key: 'id',
    render: () => {
      return (
        <div className="flex items-center justify-center gap-4">
          <button>
            <BiEdit size={22} className="cursor-pointer text-gray-600" />
          </button>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={() => {}}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <span className="grid place-items-center">
              <DeleteOutlined
                style={{
                  fontSize: '18px',
                  color: ' #FF6A74',
                  cursor: 'pointer',
                }}
              />
            </span>
          </Popconfirm>
        </div>
      );
    },
  },
];

const data = [
  {
    id: 1,
    region: 'Ashanti',
    staff: 'Kwasi Ntim',
    key: 1,
  },
  {
    id: 2,
    region: 'Greater Accra',
    staff: 'Kwasi Ntim',
    key: 2,
  },
  {
    id: 3,
    region: 'Brong Ahafo',
    staff: 'Kwasi Ntim',
    key: 3,
  },
  {
    id: 4,
    region: 'Northern',
    staff: 'Kwasi Ntim',
    key: 4,
  },
];
const Deployment = () => {
  const snap = useSnapshot(state);

  const { showAddDeploymentModal } = snap.modalSlice;

  return (
    <div className="w-[90%] mx-auto mt-10">
      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          onClick={() => {
            state.modalSlice.toggleAddDeploymentModal();
          }}
          style={{ backgroundColor: '#6E431D', color: '#fff' }}
        >
          Deploy Staff
        </Button>
      </div>
      <Input.Search
        placeholder="Search records..."
        // onSearch={(value) => setSearchText(value)}
        // onChange={(e) => setSearchText(e.target.value)}
      />
      <Table dataSource={data} columns={columns} />

      {showAddDeploymentModal && <AddDeploymentModal />}
    </div>
  );
};

export default Deployment;
