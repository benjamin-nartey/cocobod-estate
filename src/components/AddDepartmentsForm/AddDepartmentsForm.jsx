import React, { useEffect, useState } from 'react';

import { Button, Modal, Form, Input, message, Select } from 'antd';

import { UserOutlined } from '@ant-design/icons';

import CustomSelect from '../CustomSelect/CustomSelect';

import { axiosInstance } from '../../axios/axiosInstance';
import { useGetAllDivisions } from '../../Hooks/query/divisions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addDepartment, updateDepartment } from '../../http/department';
import state from '../../store/store';
import { CRUDTYPES } from '../../store/modalSlice';
import { useSnapshot } from 'valtio';

const AddDepartmentsForm = () => {
  const [pageNum, setPageNum] = useState(1);
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const snap = useSnapshot(state);
  const { showDepartmentModal, selectedRecord, crudType } = snap.modalSlice;

  console.log({ selectedRecord });

  const { data: divisions } = useGetAllDivisions();

  const queryClient = useQueryClient();

  useEffect(() => {
    form.setFieldsValue({
      name: selectedRecord?.name,
      divisionId: selectedRecord?.division?.id,
    });
  }, [selectedRecord]);

  const { mutate, isLoading: addIsLoading } = useMutation({
    mutationKey: 'addDepartment',
    mutationFn: (data) => {
      return addDepartment(data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: 'departments' });
      success('Department added successfully');
      state.modalSlice.toggleshowDepartmentModal();
      state.modalSlice.crudType = CRUDTYPES.RESET;
      state.modalSlice.selectedRecord = null;
      form.resetFields();
    },
    onError: (err) => {
      errorMessage(err.message);
    },
  });
  const { mutate: updateDepartmentfn, isLoading: updateLoading } = useMutation({
    mutationKey: 'updateDepartment',
    mutationFn: (data) => {
      return updateDepartment(selectedRecord?.id, data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: 'departments' });
      success('Department updated successfully');
      state.modalSlice.toggleshowDepartmentModal();
    },
    onError: (err) => {
      errorMessage(err.response?.data?.message);
    },
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

  const handleSubmit = async (values) => {
    crudType == CRUDTYPES.ADD ? mutate(values) : updateDepartmentfn(values);
  };

  function clearInput() {
    setformFields({ name: '', divisionId: [] });
    form.resetFields();
  }

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        onClick={() => {
          state.modalSlice.toggleshowDepartmentModal();
          state.modalSlice.selectedRecord = null;
          state.modalSlice.crudType = CRUDTYPES.ADD;
        }}
        style={{ backgroundColor: '#6E431D', color: '#fff' }}
      >
        Add Department
      </Button>
      <Modal
        title="ADD DEPARTMENT"
        open={showDepartmentModal}
        footer={false}
        onCancel={() => {
          state.modalSlice.selectedRecord = null;
          state.modalSlice.toggleshowDepartmentModal();
          state.modalSlice.crudType = CRUDTYPES.RESET;
        }}
        maskClosable={false}
      >
        <Form
          form={form}
          onFinish={(values) => handleSubmit(values)}
          layout="vertical"
          name="wrap"
          labelAlign="left"
          labelWrap
          colon={false}
          style={{
            maxWidth: 600,
          }}
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
              name="name"
              placeholder="Enter name"
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="Divisions"
            name="divisionId"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              placeholder="Select divisions"
              options={divisions?.data.map((d) => ({
                label: d?.name,
                value: d?.id,
              }))}
              style={{
                width: '100%',
              }}
            />
          </Form.Item>

          <Form.Item label=" ">
            <Button
              className="w-full"
              loading={
                crudType === CRUDTYPES.ADD ? addIsLoading : updateLoading
              }
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
export default AddDepartmentsForm;
