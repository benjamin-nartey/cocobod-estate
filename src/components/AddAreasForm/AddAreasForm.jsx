import React, { useState } from 'react';

import { Button, Modal, Form, Input, message } from 'antd';

import { UserOutlined } from '@ant-design/icons';

import CustomSelect from '../CustomSelect/CustomSelect';

import { useAddRegionData } from '../../Hooks/useAddFetch';

const AddAreasForm = () => {
  const [open, setOpen] = useState(false);
  const [pageNum, setpageNum] = useState(1);
  const [options, setOptions] = useState([
    {
      label: 'REGION',
      value: 'REGION',
    },
    {
      label: 'METROPOLITAN',
      value: 'METROPOLITAN',
    },
    {
      label: 'MUNICIPAL',
      value: 'MUNICIPAL',
    },
    {
      label: 'DISTRICT',
      value: 'DISTRICT',
    },
  ]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const { mutate } = useAddRegionData();

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

  const [formFields, setformFields] = useState({
    name: '',
  });

  const { name } = formFields;

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const region = {
        name,
      };

      mutate(region, {
        onSuccess: () => {
          success('Region created successfully');

          clearInput();
          handleCancel();
        },
      });
    } catch (error) {
      errorMessage('Error creating Region');
      throw new Error(`Error creating Region ${error}`);
    }
  };

  function clearInput() {
    setformFields({
      name: '',
    });
    form.resetFields();
  }

  const handleOk = () => {
    //an empty function to keep the modal working
  };

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        onClick={showModal}
        style={{ backgroundColor: '#6E431D', color: '#fff' }}
      >
        Add Region
      </Button>
      <Modal
        title="ADD REGION"
        open={open}
        onOk={handleOk}
        okButtonProps={{
          hidden: true,
        }}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        cancelButtonProps={{
          hidden: true,
        }}
      >
        <Form
          form={form}
          onSubmitCapture={handleSubmit}
          layout="vertical"
          name="wrap"
          // labelCol={{
          //   flex: "110px",
          // }}
          labelAlign="left"
          labelWrap
          // wrapperCol={{
          //   flex: 1,
          // }}
          colon={false}
          style={{
            maxWidth: 600,
          }}
          className="mt-5"
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
              value={name}
              onChange={(e) =>
                setformFields({ ...formFields, name: e.target.value })
              }
              placeholder="Enter Region name"
              prefix={<UserOutlined />}
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
export default AddAreasForm;
