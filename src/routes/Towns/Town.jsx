import { Button, Input, Popconfirm, Table, Tooltip, message } from 'antd';
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
import { deleteTown, getPaginatedLocation } from '../../http/location';
import AddLocation from '../../components/modals/Location/location';
import UploadCSV from '../../components/modals/uploads/uploadCsv';
import { MdOutlineUpload } from 'react-icons/md';

const Town = () => {
  const [pageNum, setPageNum] = useState(1);
  const [paginatedData, props] = useGetPaginatedData(
    'location',
    '',
    { pageNum },
    getPaginatedLocation
  );
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: 'deleteDistrict',
    mutationFn: (id) => {
      return deleteTown(id);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: 'location' });
      message.success('Location deleted successfully');
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

  const { showLocationModal, showUploadModal } = snap.modalSlice;

  const removeLocation = (id) => {
    mutate(id);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'District',
      dataIndex: ['district', 'name'],
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
                state.modalSlice.toggleshowLocationModal();
              }}
            />

            <Popconfirm
              title="Delete Town"
              description="Are you sure to delete this town?. Operation is irreversible"
              onConfirm={() => {
                removeLocation(value);
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
      <div className="flex justify-end mb-4 gap-3">
        <Tooltip title={'Upload CSV'}>
          <MdOutlineUpload
            size={32}
            className="text-[#6E431D] cursor-pointer"
            onClick={() => state.modalSlice.toggleshowUploadModal()}
          />
        </Tooltip>
        <Button
          type="primary"
          onClick={() => {
            state.modalSlice.crudType = CRUDTYPES.ADD;
            state.modalSlice.toggleshowLocationModal();
          }}
          style={{ backgroundColor: '#6E431D', color: '#fff' }}
        >
          Add Town
        </Button>
      </div>
      <Input.Search
        placeholder="Search records..."
        // onSearch={(value) => setSearchText(value)}
        // onChange={(e) => setSearchText(e.target.value)}
      />
      <Table
        dataSource={_data}
        loading={props.isLoading || props?.isFetching}
        columns={columns}
        pagination={{
          pageSize: paginatedData?.pageSize,
          total: paginatedData?.total,
        }}
        onChange={(pagination) => {
          setPageNum(pagination.current);
        }}
      />

      {showLocationModal && <AddLocation />}
      {showUploadModal && (
        <UploadCSV
          fieldName={'bulk-file'}
          uploadUrl={'/location/bulk-import'}
        />
      )}
    </div>
  );
};

export default Town;
