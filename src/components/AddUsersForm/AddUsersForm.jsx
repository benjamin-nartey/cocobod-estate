import React, { useEffect, useState } from 'react';

import { Button, Modal, Form, Input, message, Select, InputNumber } from 'antd';

import { UserOutlined } from '@ant-design/icons';
import { MdOutlineEmail } from 'react-icons/md';

import { useAddUserData } from '../../Hooks/useAddFetch';
import { useGetRoles } from '../../Hooks/query/roles';
import {
  useGetAllDepartments,
  useGetDepartmentByDivisionId,
} from '../../Hooks/query/department';
import { useGetAllDivisions } from '../../Hooks/query/divisions';
import { useSnapshot } from 'valtio';
import state from '../../store/store';
import { CRUDTYPES } from '../../store/modalSlice';
import { useMutation } from '@tanstack/react-query';
import { updateUser } from '../../http/users';

const AddUsersForm = () => {
  const [open, setOpen] = useState(false);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedDivisionId, setSelectDivisionId] = useState(null);
  const snap = useSnapshot(state);
  const { showUserAddModal, selectedRecord, crudType } = snap.modalSlice;

  const { mutate } = useAddUserData();
  const { data: roles } = useGetRoles();

  const { data: divisions } = useGetAllDivisions();

  let divisionFilter = selectedDivisionId
    ? selectedDivisionId
    : selectedRecord?.staff?.department?.division?.id;

  const {
    data: departments,
    refetch: fetchDepartmentByDivisionId,
    isLoading,
  } = useGetDepartmentByDivisionId(divisionFilter, {
    enabled: false,
  });

  const success = (content) => {
    messageApi.open({
      type: 'success',
      content: content,
    });
  };

  const errorMessage = (content) => {
    messageApi.open({
      type: 'error',
      content: content,
    });
  };

  const { mutate: UpdateUserFn } = useMutation({
    mutationKey: 'updateUser',
    mutationFn: (data) => {
      updateUser(selectedRecord?.id, data);
    },
    onSuccess: () => {
      state.modalSlice.selectedRecord = null;
      state.modalSlice.crudType = CRUDTYPES.RESET;
      state.modalSlice.toggleshowUserAddModal();
      success('User updated successfully');
    },
    onError: (err) => {
      errorMessage(err?.message);
    },
  });

  useEffect(() => {
    fetchDepartmentByDivisionId();
    const initialValues = {
      name: selectedRecord?.name,
      email: selectedRecord?.email,
      staffNumber: selectedRecord?.staff?.staffNumber,
      departmentId: selectedRecord?.staff?.department?.id,
      divisionId: selectedRecord?.staff?.department?.division?.id,
      roleIds: selectedRecord?.roles?.map((role) => role?.id),
      status: selectedRecord?.status,
    };
    form.setFieldsValue(initialValues);
  }, [selectedRecord]);

  useEffect(() => {
    if (selectedDivisionId) {
      fetchDepartmentByDivisionId();
    }
  }, [selectedDivisionId]);

  const [formFields, setformFields] = useState({
    name: '',
    email: '',
    roleIds: [],
  });

  const handleCancel = () => {
    setOpen(false);
  };

  console.log(selectedRecord?.roles?.map((role) => role?.id));

  // console.log(initialValues);

  const handleSubmit = (values) => {
    try {
      crudType === CRUDTYPES.ADD
        ? mutate(values, {
            onSuccess: () => {
              state.modalSlice.crudType = CRUDTYPES.RESET;
              state.modalSlice.toggleshowUserAddModal();
              success('User created successfully');
              clearInput();
            },
          })
        : UpdateUserFn(values);
    } catch (error) {
      errorMessage('Error creating user');
      throw new Error(`Error creating user ${error}`);
    }
  };

  function clearInput() {
    setformFields({ name: '', email: '', roleIds: [] });
    form.resetFields();
  }

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        onClick={() => {
          state.modalSlice.crudType = CRUDTYPES.ADD;
          state.modalSlice.toggleshowUserAddModal();
        }}
        style={{ backgroundColor: '#6E431D', color: '#fff' }}
      >
        Add User
      </Button>
      <Modal
        title="ADD USER"
        open={showUserAddModal}
        footer={false}
        confirmLoading={confirmLoading}
        onCancel={() => {
          state.modalSlice.selectedRecord = null;
          state.modalSlice.crudType = CRUDTYPES.RESET;
          state.modalSlice.toggleshowUserAddModal();
        }}
        cancelButtonProps={{
          hidden: true,
        }}
      >
        <Form
          form={form}
          onFinish={(values) => handleSubmit(values)}
          name="wrap"
          layout="vertical"
          labelAlign="left"
          labelWrap
          colon={false}
          style={{
            maxWidth: 600,
          }}
          // initialValues={initialValues}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              placeholder="Enter name"
              prefix={<UserOutlined />}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            label="Staff Number"
            name="staffNumber"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Enter Staff Number" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              type="email"
              placeholder="Enter email"
              prefix={<MdOutlineEmail />}
            />
          </Form.Item>

          <Form.Item
            label="Division"
            name="divisionId"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              showSearch
              optionFilterProp={'label'}
              onChange={(value) => {
                form.setFieldValue('departmentId', '');
                setSelectDivisionId(value);
              }}
              placeholder="Select division"
              options={divisions?.data?.map((division) => ({
                label: division?.name,
                value: division?.id,
              }))}
              style={{
                width: '100%',
              }}
            />
          </Form.Item>
          <Form.Item
            label="Department"
            name="departmentId"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              loading={isLoading}
              showSearch
              optionFilterProp={'label'}
              placeholder="Select department"
              options={departments?.data?.map((department) => ({
                label: department?.name,
                value: department?.id,
              }))}
              style={{
                width: '100%',
              }}
            />
          </Form.Item>
          <Form.Item
            label="Roles"
            name="roleIds"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              mode="multiple"
              showSearch
              optionFilterProp={'label'}
              placeholder="Select roles"
              options={roles?.data?.map((role) => ({
                label: role?.name,
                value: role?.id,
              }))}
              style={{
                width: '100%',
              }}
            />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              placeholder="Set Status"
              options={[
                {
                  label: 'ACTIVE',
                  value: 'ACTIVE',
                },
                {
                  label: 'INACTIVE',
                  value: 'INACTIVE',
                },
              ]}
              style={{
                width: '100%',
              }}
            />
          </Form.Item>

          <Form.Item label=" ">
            <Button
              className="w-full"
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: '#6E431D', color: '#fff' }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default AddUsersForm;
