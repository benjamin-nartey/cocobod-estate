import { DeleteOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm, Table, Tooltip, message } from 'antd';
import React, { useState } from 'react';
import { BiEdit } from 'react-icons/bi';
import state from '../../store/store';
import { useSnapshot } from 'valtio';
import AddPoliticalRegion from '../../components/modals/politicalRegion/add';
import { useGetPaginatedData } from '../../Hooks/query/generics';
import {
  deletePoliticalRegion,
  getPaginatedPoliticalRegions,
} from '../../http/politicalRegions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePoliticalDistrict } from '../../http/politicalDistrict';
import { CRUDTYPES } from '../../store/modalSlice';
import UploadCSV from '../../components/modals/uploads/uploadCsv';
import { MdOutlineUpload } from 'react-icons/md';

const PoliticalRegion = () => {
  const snap = useSnapshot(state);
  const [pageNum, setPageNum] = useState(1);

  const { showPoliticalRegionModal, showUploadModal } = snap.modalSlice;

  const [paginatedData, props] = useGetPaginatedData(
    'politicalRegions',
    '',
    { pageNum },
    getPaginatedPoliticalRegions
  );

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: 'deletePoliticalRegion',
    mutationFn: (id) => {
      return deletePoliticalRegion(id);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: 'politicalRegions' });
      message.success('Political Region deleted successfully');
    },

    onError: (error) => {
      message.error(error.response.data.message);
    },
  });

  const removePoliticalRegion = (id) => {
    mutate(id);
  };

  const _data = props.data?.data?.records?.map((rec) => ({
    ...rec,
    key: rec?.id,
  }));

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
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
                state.modalSlice.toggleshowPoliticalRegionModal();
              }}
            />

            <Popconfirm
              title="Delete Political Region"
              description="Are you sure to delete this political Region?. Operation is irreversible"
              onConfirm={() => {
                removePoliticalRegion(value);
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
    <div className="w-[80%] mx-auto mt-10">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-slate-500">POLITICAL REGIONS</h3>

        <div className="flex justify-end gap-3 mb-4">
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
              state.modalSlice.toggleshowPoliticalRegionModal();
            }}
            style={{ backgroundColor: '#6E431D', color: '#fff' }}
          >
            Add Political Region
          </Button>
        </div>
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
          pageSize: paginatedData?.pageSize,
          total: paginatedData?.total,
        }}
        onChange={(pagination) => setPageNum(pagination.current)}
        loading={props?.isLoading || props?.isFetching}
      />
      {showPoliticalRegionModal && <AddPoliticalRegion />}
      {showUploadModal && (
        <UploadCSV
          fieldName={'bulk-file'}
          uploadUrl={'/political-region/bulk-import'}
        />
      )}
    </div>
  );
};

export default PoliticalRegion;
