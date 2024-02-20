import React, { useCallback, useEffect, useState } from 'react';
import { useGetPaginatedData } from '../../Hooks/query/generics';
import { Button, Input, Popconfirm, Spin, Table, message } from 'antd';
import {
  deleteMerge,
  getPaginatedPropertyReferenceCategory,
} from '../../http/propertiesMerge';
import { useNavigate } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { BiBullseye, BiEdit, BiSleepy } from 'react-icons/bi';
import state from '../../store/store';
import { CRUDTYPES } from '../../store/modalSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AiOutlineEye } from 'react-icons/ai';
import _ from 'lodash';
import { searchResource } from '../../http/search';

const PropertyMergeIndex = () => {
  const [pageNum, setPageNum] = useState(1);

  const [_data, setData] = useState(null);
  const [pageInfo, setPageInfo] = useState({ pageSize: 0, total: 0 });
  const [loading, setLoading] = useState(false);

  const [paginatedData, props] = useGetPaginatedData(
    'propertyReferenceCategory',
    '',
    { pageNum },
    getPaginatedPropertyReferenceCategory
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (
      props.data?.data?.records ||
      paginatedData?.pageSize ||
      paginatedData?.total
    ) {
      console.log('I have been called');
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

  console.log(pageInfo);

  const handleSearch = useCallback(
    _.debounce(async (text) => {
      console.log(text);
      const result = await searchResource(
        '/property-reference-categories',
        text
      );
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
      dataIndex: ['location', 'district', 'region', 'name'],
    },
    {
      title: 'Category',
      key: 'category',
      dataIndex: ['propertyType', 'name'],
    },
    {
      title: 'District',
      key: 'district',
      dataIndex: ['location', 'district', 'name'],
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      render: (value, record) => {
        return (
          <div className="flex items-center gap-4">
            <AiOutlineEye
              size={22}
              className="text-sky-400 cursor-pointer"
              onClick={() => navigate(`/merge/${value}`)}
            />

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
        onChange={handleChange}
      />
      <Table
        dataSource={_data}
        columns={columns}
        pagination={{
          pageSize: pageInfo?.pageSize,
          total: pageInfo?.total,
        }}
        onChange={(pagination) => setPageNum(pagination.current)}
        loading={props?.isLoading || props?.isFetching || loading}
      />
    </div>
  );
};

export default PropertyMergeIndex;
