import { Button, DatePicker, Form, Input, Modal, message } from 'antd';
import React, { useState } from 'react';
import { useSnapshot } from 'valtio';
import state from '../../../store/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addDeployment } from '../../../http/deployment';

const NewDeployment = () => {
  const snap = useSnapshot(state);
  const { showNewDeploymentModal, selectedRecord } = snap.modalSlice;

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationKey: 'create-deployment',
    mutationFn: (data) => {
      return addDeployment(data);
    },

    onSuccess: (result) => {
      console.log(result);
      state.modalSlice.toggleShowNewDeploymentModal();
      message.success('Deployment created successfully');
      queryClient.invalidateQueries({ queryKey: 'getAllDeployments' });
    },
    onError: (e) => {
      message.error(e?.response?.data.message);
    },
  });

  const handleSubmit = (values) => {
    values['startDate'] = values['startDate'].toISOString();
    values['endDate'] = values['endDate'].toISOString();

    mutate(values);
  };

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

          <Button htmlType="submit" className="w-full mt-5" loading={isLoading}>
            Submit
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default NewDeployment;
