import React, { useEffect, useState } from 'react';

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

import { DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { BiEdit } from 'react-icons/bi';
import { MdOutlineEmail } from 'react-icons/md';

import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '../../axios/axiosInstance';

import CustomSelect from '../CustomSelect/CustomSelect';
import { useGetPaginatedData } from '../../Hooks/query/generics';
import { getAllUsers } from '../../http/users';
import state from '../../store/store';
import { CRUDTYPES } from '../../store/modalSlice';

const UsersTable = () => {
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [recordsPerPage, setRecordsPerPage] = useState(1);
  const [page, setPage] = useState(1);
  const [rolePage, setRolePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [formFields, setformFields] = useState({
    name: '',
    email: '',
    roleIds: [],
    id: '',
  });

  const confirm = (e) => {
    message.success('Click on Yes');
  };
  const cancel = (e) => {};

  const { name, email, roleIds, id } = formFields;

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'User updated successfully',
    });
  };

  const errorMessage = () => {
    messageApi.open({
      type: 'error',
      content: 'Error updating user',
    });
  };

  const handleOk = () => {
    //an empty function to keep the modal working
  };

  const [paginatedData, props] = useGetPaginatedData(
    'users',
    '',
    { pageNum: page },
    getAllUsers
  );

  const _data = props.data?.data?.records?.map((rec) => ({
    ...rec,
    key: rec?.id,
  }));

  async function fetchRoles(rolePage) {
    const response = await axiosInstance.get('/roles', {
      params: {
        pageNum: rolePage,
      },
    });

    const data = await response.data;

    const dataRcord = await data.records.map((record) => {
      return {
        label: `${record.name}`,
        value: record.id,
      };
    });
    setOptions(dataRcord);
  }

  useEffect(() => {
    fetchRoles(rolePage);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roles = roleIds.map((role) => role.value);

    try {
      await axiosInstance.patch(`/users/${id}`, {
        name,
        email,
        roleIds: roles,
      });

      success();

      clearInput();
      handleCancel();
    } catch (error) {
      errorMessage();
      throw new Error(`Error adding user edits ${error}`);
    }
  };

  const clearInput = () => {
    setformFields({ name: '', email: '', roleIds: [] });
    form.resetFields();
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return (
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.status).toLowerCase().includes(value.toLowerCase()) ||
          String(record.staff.department.name)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.staff.department.division.name)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.staff.station.region.name)
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      },
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
      dataIndex: ['staff', 'station', 'region', 'name'],
      key: 'region',
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

            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              onConfirm={confirm}
              onCancel={cancel}
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
        loading={props?.isLoading || props?.isFetching}
        pagination={{
          pageSize: paginatedData?.pageSize,
          total: paginatedData?.total,
          // onChange: (pageNum) => {
          //   fetchUsers(pageNum);
          // },
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
