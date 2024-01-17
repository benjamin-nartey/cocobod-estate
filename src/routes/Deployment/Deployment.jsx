import React, { useState } from 'react';
import state from '../../store/store';
import { useSnapshot } from 'valtio';
import { Button, Input, Popconfirm, Table, Tag, Tooltip, message } from 'antd';
import NewDeployment from '../../components/modals/deployment/new';
// import { useGetAllDeployments } from '../../Hooks/query/deployment';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { BiEdit } from 'react-icons/bi';
import { HiCheck, HiEye } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useGetPaginatedData } from '../../Hooks/query/generics';
import {
  deleteDeployment,
  getPaginatedDeployments,
  updateDeployment,
} from '../../http/deployment';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CRUDTYPES } from '../../store/modalSlice';

const Deployment = () => {
  const snap = useSnapshot(state);

  const navigate = useNavigate();

  const { showNewDeploymentModal } = snap.modalSlice;

  const [pageNum, setPageNum] = useState(1);
  const [paginatedData, props] = useGetPaginatedData(
    'deployment',
    '',
    { pageNum },
    getPaginatedDeployments
  );

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: 'completeDeployment',
    mutationFn: (id) => {
      return updateDeployment(id, { completed: true });
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: 'deployment' });
      message.success('Deployment marked as completed successfully');
    },

    onError: (e) => {
      message.error(e.response.data.message);
    },
  });

  const { mutate: deleteDeploymentFn } = useMutation({
    mutationKey: 'deploy',
    mutationFn: (id) => {
      return deleteDeployment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: 'deployment' });
      message.success('Deployment deleted successfully');
    },

    onError: (e) => {
      message.error(e?.response?.data.message);
    },
  });

  const completeDeployment = (id) => {
    mutate(id);
  };

  const handleDeletion = (id) => {
    deleteDeploymentFn(id);
  };

  const _data = props.data?.data.records.map((rec) => ({
    ...rec,
    key: rec?.id,
  }));

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',

      render: (value) => <p>{new Date(value).toDateString()}</p>,
    },

    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'id',
      render: (value) => <p>{new Date(value).toDateString()}</p>,
    },

    {
      title: 'Status',
      dataIndex: 'completed',
      render: (value) => {
        return value === false ? (
          <Tag icon={<SyncOutlined spin />} color="processing">
            Ongoing
          </Tag>
        ) : (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Completed
          </Tag>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: 'id',
      width: '30%',
      render: (id, record) => {
        return (
          <div className="flex items-center  gap-4">
            <Tooltip title={'View & Make Allocation'}>
              <HiEye
                className="text-blue-500 cursor-pointer"
                size={22}
                onClick={() => navigate(`/deployment/${id}`)}
              />
            </Tooltip>
            {record.completed === false && (
              <Tooltip title={'Complete Deployment'}>
                <HiCheck
                  size={22}
                  color="green"
                  className="cursor-pointer"
                  onClick={() => completeDeployment(id)}
                />
              </Tooltip>
            )}
            <Tooltip title={'Edit Deployment'}>
              <BiEdit
                size={22}
                className="cursor-pointer text-gray-600"
                onClick={() => {
                  state.modalSlice.selectedRecord = record;
                  state.modalSlice.crudType = CRUDTYPES.EDIT;
                  state.modalSlice.toggleShowNewDeploymentModal();
                }}
              />
            </Tooltip>
            <Tooltip title={'Delete Deplolyment'}>
              <Popconfirm
                title="Delete Deployment"
                description="Are you sure you want to delete this deployment. This action is irrevisible!!!?"
                onConfirm={() => {
                  handleDeletion(id);
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
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-[90%] mx-auto mt-10">
      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          onClick={() => {
            state.modalSlice.toggleShowNewDeploymentModal();
            state.modalSlice.selectedRecord = null;
            state.modalSlice.crudType = CRUDTYPES.ADD;
          }}
          style={{ backgroundColor: '#6E431D', color: '#fff' }}
        >
          Add Deployment
        </Button>
      </div>
      <Input.Search
        placeholder="Search records..."
        // onSearch={(value) => setSearchText(value)}
        // onChange={(e) => setSearchText(e.target.value)}
      />
      <Table
        loading={props.isLoading}
        dataSource={_data}
        columns={columns}
        pagination={{
          pageSize: paginatedData.pageSize,
          total: paginatedData.total,
        }}
        onChange={(pagination) => {
          setPageNum(pagination.current);
        }}
      />

      {showNewDeploymentModal && <NewDeployment />}
    </div>
  );
};

export default Deployment;
