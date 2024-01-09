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
import {
  deletePoliticalDistrict,
  getPaginatedPoliticalDistricts,
} from '../../http/politicalDistrict';
import AddPoliticalDistrict from '../../components/modals/politicalDistrict/add';
import { MdOutlineUpload } from 'react-icons/md';
import UploadCSV from '../../components/modals/uploads/uploadCsv';

const PoliticalDistrict = () => {
  const [pageNum, setPageNum] = useState(1);
  const [paginatedData, props] = useGetPaginatedData(
    'politicalDistricts',
    '',
    { pageNum },
    getPaginatedPoliticalDistricts
  );
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: 'deleteDistrict',
    mutationFn: (id) => {
      return deletePoliticalDistrict(id);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: 'politicalDistricts' });
      message.success('Political District deleted successfully');
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

  const { showPoliticalDistrictModal, showUploadModal } = snap.modalSlice;

  const removePoliticalDistrict = (id) => {
    mutate(id);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Political Region',
      dataIndex: ['politicalRegion', 'name'],
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
                state.modalSlice.toggleshowPoliticalDistrictModal();
              }}
            />

            <Popconfirm
              title="Delete Political District"
              description="Are you sure to delete this political  district?. Operation is irreversible"
              onConfirm={() => {
                removePoliticalDistrict(value);
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
            state.modalSlice.toggleshowPoliticalDistrictModal();
          }}
          style={{ backgroundColor: '#6E431D', color: '#fff' }}
        >
          Add Political District
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
      {showPoliticalDistrictModal && <AddPoliticalDistrict />};
      {showUploadModal && (
        <UploadCSV
          fieldName={'bulk-file'}
          uploadUrl={'/political-district/bulk-import'}
        />
      )}
    </div>
  );
};

export default PoliticalDistrict;
