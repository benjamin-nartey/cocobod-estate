import React, { useState } from "react";

import { Button, Modal, Form, Input, message } from "antd";

import { UserOutlined } from "@ant-design/icons";

import CustomSelect from "../CustomSelect/CustomSelect";

import { useAddAreaData } from "../../Hooks/useAddFetch";

const AddAreasForm = () => {
  const [open, setOpen] = useState(false);
  const [pageNum, setpageNum] = useState(1);
  const [options, setOptions] = useState([
    {
      label: "REGION",
      value: "REGION",
    },
    {
      label: "METROPOLITAN",
      value: "METROPOLITAN",
    },
    {
      label: "MUNICIPAL",
      value: "MUNICIPAL",
    },
    {
      label: "DISTRICT",
      value: "DISTRICT",
    },
  ]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const { mutate } = useAddAreaData();

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
    category: "",
  });

  const { name, category } = formFields;

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
      const area = {
        name,
        category,
      };

      mutate(area, {
        onSuccess: () => {
          success("Area created successfully");

          clearInput();
          handleCancel();
        },
      });
    } catch (error) {
      errorMessage("Error creating Area");
      throw new Error(`Error creating Area ${error}`);
    }
  };

  function clearInput() {
    setformFields({
      name: "",
      category: "",
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
        style={{ backgroundColor: "#6E431D", color: "#fff" }}
      >
        Add Area
      </Button>
      <Modal
        title="ADD AREA"
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
              placeholder="Enter Area name"
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <CustomSelect
              mode="single"
              value={category}
              placeholder="Select category"
              options={options}
              onChange={(e) => setformFields({ ...formFields, category: e })}
              style={{
                width: "100%",
              }}
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
export default AddAreasForm;
