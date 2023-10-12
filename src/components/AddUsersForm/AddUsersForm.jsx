import React, { useState } from "react";

import { Button, Modal, Form, Input } from "antd";
import { message } from "antd";
import DebounceSelect from "../DebounceSelect/DebounceSelect";
import { UserOutlined } from "@ant-design/icons";

import { MdOutlineEmail } from "react-icons/md";
import { axiosInstance } from "../../axios/axiosInstance";

const AddUsersForm = () => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: "success",
      content: "User added successfully",
    });
  };

  const errorMessage = () => {
    messageApi.open({
      type: "error",
      content: "Error creating user",
    });
  };

  const [formFields, setformFields] = useState({
    name: "",
    email: "",
    roleIds: [],
  });

  const { name, email, roleIds } = formFields;

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  console.log(formFields);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roles = roleIds.map((role) => role.value);

    try {
      await axiosInstance.post("/users", {
        name,
        email,
        roleIds: roles,
      });

      success();

      clearInput();
      handleCancel();
    } catch (error) {
      errorMessage();
      throw new Error(`Error in creating user ${error}`);
    }
  };

  const clearInput = () => {
    setformFields({ name: "", email: "", roleIds: [] });
    form.resetFields();
  };

  const handleOk = () => {
    //an empty function to keep the modal working
  };

  async function fetchRoles(username) {
    return axiosInstance
      .get("/roles", {
        params: {
          pageNum: "1",
        },
      })
      .then((response) => response.data)
      .then((body) =>
        body.records.map((record) => ({
          label: `${record.name}`,
          value: record.id,
        }))
      );
  }

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        onClick={showModal}
        style={{ backgroundColor: "#6E431D", color: "#fff" }}
      >
        Add User
      </Button>
      <Modal
        title="ADD USER"
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
          labelCol={{
            flex: "110px",
          }}
          labelAlign="left"
          labelWrap
          wrapperCol={{
            flex: 1,
          }}
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
              placeholder="Enter name"
              prefix={<UserOutlined />}
            />
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
              name="email"
              value={email}
              onChange={(e) =>
                setformFields({ ...formFields, email: e.target.value })
              }
              type="email"
              placeholder="Enter email"
              prefix={<MdOutlineEmail />}
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
            <DebounceSelect
              mode="multiple"
              value={roleIds}
              placeholder="Select roles"
              fetchOptions={fetchRoles}
              onChange={(e) => setformFields({ ...formFields, roleIds: e })}
              style={{
                width: "100%",
              }}
            />
          </Form.Item>

          <Form.Item label=" ">
            <Button
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
export default AddUsersForm;
