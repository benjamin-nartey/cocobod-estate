import { Button, DatePicker, Form, Input, Modal, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import state from '../../../store/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addDeployment, updateDeployment } from '../../../http/deployment';
import dayjs from 'dayjs';
import { CRUDTYPES } from '../../../store/modalSlice';

const NewDeployment = () => {
  const snap = useSnapshot(state);
  const { showNewDeploymentModal, selectedRecord, crudType } = snap.modalSlice;
  const [form] = Form.useForm();

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationKey: 'create-deployment',
    mutationFn: (data) => {
      return addDeployment(data);
    },

    onSuccess: (result) => {
      console.log(result);
      state.modalSlice.toggleShowNewDeploymentModal();
      queryClient.invalidateQueries({ queryKey: 'getAllDeployments' });
      message.success('Deployment created successfully');
    },
    onError: (e) => {
      message.error(e?.response?.data.message);
    },
  });
  const { mutate: updateDeploymentFn, isLoading: isLoadingUpdate } =
    useMutation({
      mutationKey: 'create-deployment',
      mutationFn: (data) => {
        return updateDeployment(selectedRecord?.id, data);
      },

      onSuccess: (result) => {
        console.log(result);
        state.modalSlice.toggleShowNewDeploymentModal();
        queryClient.invalidateQueries({ queryKey: 'getAllDeployments' });
        message.success('Deployment updated successfully');
      },
      onError: (e) => {
        message.error(e?.response?.data.message);
      },
    });

  const handleSubmit = (values) => {
    values['startDate'] = values['startDate'].toISOString();
    values['endDate'] = values['endDate'].toISOString();

    crudType === CRUDTYPES.ADD
      ? mutate(values)
      : updateDeploymentFn({ ...values, completed: false });
  };

  useEffect(() => {
    if (selectedRecord) {
      form.setFieldsValue({
        name: selectedRecord?.name,
        startDate: dayjs(selectedRecord?.startDate),
        endDate: dayjs(selectedRecord?.endDate),
      });
    }
  }, [selectedRecord]);

  return (
    <div>
      <Modal
        open={showNewDeploymentModal}
        onCancel={() => state.modalSlice.toggleShowNewDeploymentModal()}
        footer={false}
      >
        <Form
          name="deployment-form"
          layout="vertical"
          className="mt-10"
          onFinish={handleSubmit}
          form={form}
        >
          <Form.Item name={'name'} label={'Name'} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name={'startDate'}
            label={'Start Date'}
            rules={[{ required: true }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item
            name={'endDate'}
            label={'End Date'}
            rules={[{ required: true }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Button
            htmlType="submit"
            className="w-full mt-5"
            loading={crudType === CRUDTYPES.ADD ? isLoading : isLoadingUpdate}
          >
            Submit
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default NewDeployment;
