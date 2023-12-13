import { Button, Input, Popconfirm, Table, message } from 'antd';
import React, { useState } from 'react';
import { useGetPaginatedDistricts } from '../../Hooks/query/district';
import { useSnapshot } from 'valtio';
import state from '../../store/store';
import { CRUDTYPES, modalSlice } from '../../store/modalSlice';
import AddDistrict from '../../components/modals/district/add';
import { useGetRegions } from '../../Hooks/query/regions';
import { BiEdit } from 'react-icons/bi';
import { DeleteOutlined } from '@ant-design/icons';
import { deleteDistrict, getPaginatedDistricts } from '../../http/district';
import { useGetPaginatedData } from '../../Hooks/query/generics';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const District = () => {
  const [pageNum, setPageNum] = useState(1);
  const [paginatedData, props] = useGetPaginatedData(
    'district',
    '',
    { pageNum },
    getPaginatedDistricts
  );
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: 'deleteDistrict',
    mutationFn: (id) => {
      return deleteDistrict(id);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: 'district' });
      message.success('District deleted successfully');
    },

    onError: (error) => {
      message.error(error.response.data.message);
    },
  });



  const _data = props.data?.data?.records?.map((rec) => ({
    ...rec,
    key: rec?.id,
  }));

  const snap = useSnapshot(state);

  const { showAddDistrictModal } = snap.modalSlice;

  const removeDistrict = (id) => {
    mutate(id);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Region',
      dataIndex: ['region', 'name'],
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      render: (value, record) => {
        return (
          <div className="flex items-center gap-4">
            <BiEdit
              size={22}
              className="cursor-pointer text-gray-600"
              onClick={() => {
                state.modalSlice.selectedRecord = record;
                state.modalSlice.crudType = CRUDTYPES.EDIT;
                state.modalSlice.toggleShowAddDistrictModal();
              }}
            />

            <Popconfirm
              title="Delete District"
              description="Are you sure to delete this district?. Operation is irreversible"
              onConfirm={() => {
                removeDistrict(value);
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
    <div className="w-[90%] mt-5 mx-auto">
      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          onClick={() => {
            state.modalSlice.crudType = CRUDTYPES.ADD;
            state.modalSlice.toggleShowAddDistrictModal();
          }}
          style={{ backgroundColor: '#6E431D', color: '#fff' }}
        >
          Add District
        </Button>
      </div>
      <Input.Search
        placeholder="Search records..."
        // onSearch={(value) => setSearchText(value)}
        // onChange={(e) => setSearchText(e.target.value)}
      />
      <Table
        dataSource={_data}
        loading={props.isLoading}
        columns={columns}
        pagination={{
          pageSize: paginatedData?.pageSize,
          total: paginatedData?.total,
        }}
        onChange={(pagination) => {
          setPageNum(pagination.current);
        }}
      />

      {showAddDistrictModal && <AddDistrict />}
    </div>
  );
};

export default District;
