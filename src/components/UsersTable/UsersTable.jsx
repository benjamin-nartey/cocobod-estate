import React, { useCallback, useEffect, useState } from 'react';

import {
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Table,
  Tag,
} from 'antd';

import { BiEdit } from 'react-icons/bi';

import _ from 'lodash';

import { useGetPaginatedData } from '../../Hooks/query/generics';
import { getAllUsers } from '../../http/users';
import state from '../../store/store';
import { CRUDTYPES } from '../../store/modalSlice';
import { searchResource } from '../../http/search';

const UsersTable = () => {
  const [page, setPage] = useState(1);

  const [searchText, setSearchText] = useState('');

  const [messageApi, contextHolder] = message.useMessage();
  const [formFields, setformFields] = useState({
    name: '',
    email: '',
    roleIds: [],
    id: '',
  });

  const [paginatedData, props] = useGetPaginatedData(
    'users',
    '',
    { pageNum: page },
    getAllUsers
  );
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
      const result = await searchResource('/users', text);
      setData(
        result?.data?.records?.map((rec) => ({
          ...rec,
          key: rec?.id,
        }))
      );
      setPageInfo({
        pageSize: result?.data?.recordsPerPage,
        total: result?.data?.totalRecords,
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

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      // filteredValue: [searchText],
      // onFilter: (value, record) => {
      //   return (
      //     String(record?.name).toLowerCase().includes(value.toLowerCase()) ||
      //     String(record?.status).toLowerCase().includes(value.toLowerCase()) ||
      //     String(record?.staff?.department?.name)
      //       .toLowerCase()
      //       .includes(value.toLowerCase()) ||
      //     String(record?.staff?.department?.division.name)
      //       .toLowerCase()
      //       .includes(value.toLowerCase()) ||
      //     String(record?.staff?.station?.name)
      //       .toLowerCase()
      //       .includes(value.toLowerCase())
      //   );
      // },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Department',
      dataIndex: ['staff', 'department', 'name'],
      key: 'department',
      filteredValue: [searchText],
    },
    {
      title: 'Division',
      dataIndex: ['staff', 'department', 'division', 'name'],
      key: 'division',
    },
    {
      title: ' Station',
      dataIndex: ['staff', 'station', 'name'],
      key: 'station',
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: (_, { roles }) => (
        <>
          {roles?.map((role, i) => (
            <Tag
              color={`${
                role?.name === 'Super Administrator' ? 'green' : 'blue'
              }`}
              key={i}
            >
              {role?.name}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: ' Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'action',
      render: (value, record) => {
        return (
          <div className="flex items-center justify-center gap-4">
            <BiEdit
              size={22}
              className="cursor-pointer text-gray-600"
              onClick={() => {
                state.modalSlice.selectedRecord = record;
                state.modalSlice.toggleshowUserAddModal();
                state.modalSlice.crudType = CRUDTYPES.EDIT;
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      {contextHolder}

      <Input.Search
        placeholder="Search records..."
        // onSearch={(value) => setSearchText(value)}
        onChange={handleChange}
      />
      <Table
        dataSource={_data}
        loading={props?.isLoading || props?.isFetching || loading}
        pagination={{
          pageSize: pageInfo?.pageSize,
          total: pageInfo?.total,
        }}
        onChange={(pagination) => {
          setPage(pagination.current);
        }}
        style={{ width: '100%' }}
        rowKey="id"
        columns={columns}
      ></Table>
    </>
  );
};
export default UsersTable;
