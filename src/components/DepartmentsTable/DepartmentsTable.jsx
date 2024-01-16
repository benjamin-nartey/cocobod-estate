import React, { useEffect, useState } from 'react';

import { Button, Modal, Form, Input, Table, message, Popconfirm } from 'antd';

import { DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { BiEdit } from 'react-icons/bi';

import CustomSelect from '../CustomSelect/CustomSelect';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { axiosInstance } from '../../axios/axiosInstance';
import { useGetPaginatedData } from '../../Hooks/query/generics';
import {
  deleteDepartment,
  getPaginatedDepartments,
} from '../../http/department';
import { useSnapshot } from 'valtio';
import state from '../../store/store';
import { CRUDTYPES } from '../../store/modalSlice';

const DepartmentsTable = () => {
  const [pageNum, setPageNum] = useState(1);

  const [searchText, setSearchText] = useState('');

  const [messageApi, contextHolder] = message.useMessage();

  const [paginatedData, props] = useGetPaginatedData(
    'departments',
    '',
    {
      pageNum,
    },
    getPaginatedDepartments
  );

  const _data = props.data?.data?.records?.map((rec) => ({
    ...rec,
    key: rec?.id,
  }));

  const snap = useSnapshot(state);

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: 'deleteDepartment',
    mutationFn: (id) => {
      return deleteDepartment(id);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: 'departments' });
      message.success('Department deleted successfully');
    },

    onError: (err) => {
      console.log(err);
      message.error(err.response.data.message);
    },
  });

  const columns = [
    {
      title: 'Department Name',
      dataIndex: 'name',
      key: 'name',
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return (
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.status).toLowerCase().includes(value.toLowerCase()) ||
          String(record.division.name)
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      },
    },
    {
      title: 'Division',
      dataIndex: ['division', 'name'],
      key: 'division',
      filteredValue: [searchText],
    },

    {
      title: 'Action',
      dataIndex: 'id',
      key: 'action',
      render: (value, record) => {
        return (
          <div className="flex items-center justify-center gap-4">
            <BiEdit
              size={22}
              className="cursor-pointer text-gray-600"
              onClick={() => {
                state.modalSlice.selectedRecord = record;
                state.modalSlice.crudType = CRUDTYPES.EDIT;
                state.modalSlice.toggleshowDepartmentModal();
              }}
            />

            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              onConfirm={() => {
                mutate(value);
              }}
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
    <>
      {contextHolder}

      <Input.Search
        placeholder="Search records..."
        onSearch={(value) => setSearchText(value)}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <Table
        dataSource={_data}
        loading={props.isLoading || props?.isFetching}
        pagination={{
          pageSize: paginatedData?.pageSize,
          total: paginatedData?.total,
        }}
        onChange={(pagination) => {
          setPageNum(pagination?.current);
        }}
        style={{ width: '100%' }}
        rowKey="id"
        columns={columns}
      ></Table>
    </>
  );
};
export default DepartmentsTable;
