import { Button, Input, Popconfirm, Table, Tooltip, message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { useSnapshot } from 'valtio';
import state from '../../store/store';
import { CRUDTYPES, modalSlice } from '../../store/modalSlice';
import AddDistrict from '../../components/modals/district/add';

import { BiEdit } from 'react-icons/bi';
import { DeleteOutlined } from '@ant-design/icons';
import { deleteDistrict, getPaginatedDistricts } from '../../http/district';
import { useGetPaginatedData } from '../../Hooks/query/generics';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MdOutlineUpload } from 'react-icons/md';
import UploadCSV from '../../components/modals/uploads/uploadCsv';
import { searchResource } from '../../http/search';

import _ from 'lodash';

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

  const [_data, setData] = useState(null);
  const [pageInfo, setPageInfo] = useState({ pageSize: 0, total: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      props.data?.data?.records ||
      paginatedData?.pageSize ||
      paginatedData?.total
    ) {
      setData(
        props.data?.data?.records?.map((rec) => ({
          ...rec,
          key: rec?.id,
        }))
      );
      setPageInfo({
        pageSize: paginatedData?.pageSize,
        total: paginatedData?.total,
      });
    }
  }, [
    props.data?.data?.records,
    paginatedData?.pageSize,
    paginatedData?.total,
  ]);

  const handleSearch = useCallback(
    _.debounce(async (text) => {
      const result = await searchResource('/district', text);
      setData(
        result?.data?.records?.map((rec) => ({
          ...rec,
          key: rec?.id,
        }))
      );
      setPageInfo({
        pageSize: result?.data?.meta?.recordsPerPage,
        total: result?.data?.meta?.totalRecords,
      });
      setLoading(false);
    }, 1000),
    []
  );

  const handleChange = (e) => {
    const { value } = e.target;

    setLoading(true);
    handleSearch(value);
  };

  const snap = useSnapshot(state);

  const { showAddDistrictModal, showUploadModal } = snap.modalSlice;

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
        onChange={handleChange}
      />
      <Table
        dataSource={_data}
        loading={props.isLoading || props?.isFetching || loading}
        columns={columns}
        pagination={{
          pageSize: pageInfo?.pageSize,
          total: pageInfo?.total,
        }}
        onChange={(pagination) => {
          setPageNum(pagination.current);
        }}
      />

      {showAddDistrictModal && <AddDistrict />}
      {showUploadModal && (
        <UploadCSV
          fieldName={'bulk-file'}
          uploadUrl={'/district/bulk-import'}
          queryKey={'district'}
        />
      )}
    </div>
  );
};

export default District;
