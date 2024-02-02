import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  Table,
  message,
  Popconfirm,
  Tag,
} from 'antd';

import { DeleteOutlined } from '@ant-design/icons';
import { BiEdit } from 'react-icons/bi';

import { useGetPaginatedData } from '../../Hooks/query/generics';
import { deleteRole, getPaginatedRoles, getRoles } from '../../http/roles';
import state from '../../store/store';
import { CRUDTYPES } from '../../store/modalSlice';
import { useSnapshot } from 'valtio';
import RolesModal from '../modals/roles/roles';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const RolesTable = () => {
  const [pageNum, setPageNum] = useState(1);

  const [searchText, setSearchText] = useState('');

  const snap = useSnapshot(state);
  const { showRolesModal, selectedRecord } = snap.modalSlice;

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: 'deleteRole',
    mutationFn: (value) => {
      return deleteRole(value);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: 'roles',
      });
      message.success('Role deleted successfully');
    },
    onError: (err) => {
      message.error(err?.response?.data?.message);
    },
  });

  const columns = [
    {
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return (
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.status).toLowerCase().includes(value.toLowerCase())
        );
      },
    },

    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (_, { permissions }) => (
        <>
          {permissions?.map((permission, i) => (
            <Tag key={i}>{permission?.name}</Tag>
          ))}
        </>
      ),
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
                state.modalSlice.toggleshowRolesModal();
                state.modalSlice.crudType = CRUDTYPES.EDIT;
                state.modalSlice.selectedRecord = record;
              }}
            />

            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this role?"
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

  const [paginatedData, props] = useGetPaginatedData(
    'roles',
    '',
    { pageNum },
    getPaginatedRoles
  );

  const _data = props.data?.data?.records?.map((rec) => ({
    ...rec,
    key: rec?.id,
  }));

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => {
            state.modalSlice.toggleshowRolesModal();
            state.modalSlice.selectedRecord = null;
            state.modalSlice.crudType = CRUDTYPES.ADD;
          }}
        >
          Add Role
        </Button>
      </div>
      <Input.Search
        placeholder="Search records..."
        onSearch={(value) => setSearchText(value)}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <Table
        dataSource={_data}
        loading={props?.isLoading || props?.isFetching}
        pagination={{
          pageSize: paginatedData.pageSize,
          total: paginatedData.total,
        }}
        columns={columns}
        onChange={(pagination) => {
          setPageNum(pagination.current);
        }}
      ></Table>

      {showRolesModal && <RolesModal />}
    </>
  );
};
export default RolesTable;
