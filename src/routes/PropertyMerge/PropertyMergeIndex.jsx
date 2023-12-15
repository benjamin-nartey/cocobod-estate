import React, { useState } from 'react';
import { useGetPaginatedData } from '../../Hooks/query/generics';
import { Button, Input, Popconfirm, Spin, Table, message } from 'antd';
import {
  deleteMerge,
  getPaginatedPropertyReferenceCategory,
} from '../../http/propertiesMerge';
import { useNavigate } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { BiEdit } from 'react-icons/bi';
import state from '../../store/store';
import { CRUDTYPES } from '../../store/modalSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const PropertyMergeIndex = () => {
  const [pageNum, setPageNum] = useState(1);

  const [paginatedData, props] = useGetPaginatedData(
    'propertyReferenceCategory',
    '',
    { pageNum },
    getPaginatedPropertyReferenceCategory
  );
  const navigate = useNavigate();
  const _data = props.data?.data?.records?.map((rec) => ({
    ...rec,
    key: rec?.id,
  }));

  const queryClient = useQueryClient();

  const { mutate, isLoading: deleteLoading } = useMutation({
    mutationKey: 'deleteMerge',
    mutationFn: (id) => {
      return deleteMerge(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['propertyReferenceCategory'],
      });
      message.success('Property merge deleted successfully');
    },
    onError: (err) => {
      message.error(err.response.data.message);
    },
  });

  const columns = [
    {
      title: 'Property',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: 'Region',
      key: 'region',
      dataIndex: ['district', 'region', 'name'],
    },
    {
      title: 'Category',
      key: 'category',
      dataIndex: ['propertyType', 'name'],
    },
    {
      title: 'District',
      key: 'district',
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
                navigate('/merge/create');
                state.modalSlice.crudType = CRUDTYPES.EDIT;
                state.modalSlice.selectedRecord = record;
                //Show only property units page for merge
              }}
            />

            <Popconfirm
              title="Delete"
              description="Are you sure to delete this?. Operation is irreversible"
              onConfirm={() => {
                mutate(value);
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

  if (deleteLoading) {
    return (
      <div className="absolute translate-x-[55%] translate-y-[50%] top-[50%] right-[50%]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="w-[90%] mx-auto mt-4">
      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          onClick={() => {
            state.modalSlice.crudType = CRUDTYPES.ADD;

            navigate('/merge/create');
          }}
          style={{ backgroundColor: '#6E431D', color: '#fff' }}
        >
          Add Property Parent
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
          pageSize: paginatedData?.pageSize,
          total: paginatedData?.total,
        }}
        onChange={(pagination) => setPageNum(pagination.current)}
        loading={props?.isLoading}
      />
    </div>
  );
};

export default PropertyMergeIndex;
