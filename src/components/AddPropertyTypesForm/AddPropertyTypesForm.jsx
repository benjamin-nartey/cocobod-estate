import React, { useState } from "react";

import { Button, Modal, Form, Input, message } from "antd";

import { UserOutlined } from "@ant-design/icons";

import { useAddPropertyTypeData } from "../../Hooks/useAddFetch";

const AddPropertyTypesForm = () => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const { mutate } = useAddPropertyTypeData();

  const success = (content) => {
    messageApi.open({
      type: "success",
      content: content,
    });
  };

  const errorMessage = (content) => {
    messageApi.open({
      type: "error",
      content: content,
    });
  };

  const [formFields, setformFields] = useState({
    name: "",
  });

  const { name } = formFields;

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  console.log(formFields);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const propertyType = {
        name,
      };

      mutate(propertyType, {
        onSuccess: (data) => {
          console.log({ data });
          success("Property type added successfully");

          clearInput();
          handleCancel();
        },
      });
    } catch (error) {
      errorMessage("Error adding property type");
      throw new Error(`Error in creating property type ${error}`);
    }
  };

  function clearInput() {
    setformFields({ name: "" });
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
        style={{ backgroundColor: "#6E431D", color: "#fff" }}
      >
        Add Property-type
      </Button>
      <Modal
        title="ADD PROPERTY-TYPE"
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
          name="wrap"
          layout="vertical"
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
              placeholder="Enter property-type name"
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item label=" ">
            <Button
              className="w-full"
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#6E431D", color: "#fff" }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default AddPropertyTypesForm;
