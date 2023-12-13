import { Button, Input, Popconfirm, Table, message } from 'antd';
import React, { useState } from 'react';
import { useSnapshot } from 'valtio';
import state from '../../store/store';
import AddDeploymentModal from '../../components/modals/deployment/add';
import { DeleteOutlined } from '@ant-design/icons';
import { BiEdit } from 'react-icons/bi';
import { useGetAllocation } from '../../Hooks/query/deployment';
import { useParams } from 'react-router-dom';
import { useGetEnumeartors } from '../../Hooks/query/users';
import { deleteAllocation, getAllocation } from '../../http/deployment';
import { useGetPaginatedData } from '../../Hooks/query/generics';
import { CRUDTYPES } from '../../store/modalSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const DeploymentDetail = () => {
  const snap = useSnapshot(state);

  const { id } = useParams();

  const [pageNum, setPageNum] = useState(1);

  const [paginatedData, props] = useGetPaginatedData(
    'allocations',
    id,
    { pageNum },
    getAllocation
  );

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: 'deleteDistrict',
    mutationFn: (id) => {
      return deleteAllocation(id);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: 'allocations' });
      message.success('Allocation deleted successfully');
    },

    onError: (error) => {
      console.log(error.response.data.message);
      message.error(error.response.data.message);
    },
  });

  const handleDelete = (id) => {
    mutate(id);
  };

  const _data = props?.data?.data?.records.map((rec) => ({
    ...rec,
    key: rec?.id,
  }));

  const { showAddDeploymentModal } = snap.modalSlice;

  const columns = [
    {
      title: 'Region',
      dataIndex: ['region', 'name'],
      key: 'region',
      width: '25%',
    },
    {
      title: 'Staff',
      dataIndex: 'staff',
      key: 'staff',
      // width: '45%',
      render: (value) => {
        return value?.map((staff, idx) => {
          return (
            <span key={idx}>
              {idx !== value.length - 1
                ? `${staff.user?.name}, `
                : staff?.user?.name}
            </span>
          );
        });
      },
    },

    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      width: '30%',
      render: (value, record) => {
        return (
          <div className="flex items-center  gap-4">
            <button>
              <BiEdit
                size={22}
                className="cursor-pointer text-gray-600"
                onClick={() => {
                  state.modalSlice.toggleAddDeploymentModal();
                  state.modalSlice.selectedRecord = {
                    deploymentId: id,
                    ...record,
                  };
                  state.modalSlice.crudType = CRUDTYPES.EDIT;
                }}
              />
            </button>
            <Popconfirm
              title="Delete Allocation"
              description="Are you sure to delete this allocation? This action is irreversible"
              onConfirm={() => {
                handleDelete(value);
              }}
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

  return (
    <div className="w-[90%] mx-auto mt-10">
      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          onClick={() => {
            state.modalSlice.toggleAddDeploymentModal();
            state.modalSlice.crudType = CRUDTYPES.ADD;
          }}
          style={{ backgroundColor: '#6E431D', color: '#fff' }}
        >
          Make Allocation
        </Button>
      </div>
      <Input.Search
        placeholder="Search records..."
        // onSearch={(value) => setSearchText(value)}
        // onChange={(e) => setSearchText(e.target.value)}
      />
      <Table
        dataSource={_data}
        columns={columns}
        pagination={{
          pageSize: paginatedData.pageSize,
          total: paginatedData.total,
        }}
        loading={props.isLoading}
        onChange={(pagination) => {
          setPageNum(pagination.current);
        }}
      />

      {showAddDeploymentModal && <AddDeploymentModal />}
    </div>
  );
};

export default DeploymentDetail;
