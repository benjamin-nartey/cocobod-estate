import React, { useEffect, useState } from "react";

import { Button, Modal, Form, Input, message } from "antd";

import { UserOutlined } from "@ant-design/icons";
import { MdOutlineEmail } from "react-icons/md";

import CustomSelect from "../CustomSelect/CustomSelect";

import { axiosInstance } from "../../axios/axiosInstance";
import { useAddUserData } from "../../Hooks/useAddFetch";

const AddUsersForm = () => {
  const [open, setOpen] = useState(false);
  const [pageNum, setpageNum] = useState(1);
  const [options, setOptions] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const { mutate } = useAddUserData();

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
      const user = {
        name,
        email,
        roleIds: roles,
      };

      mutate(user, {
        onSuccess: () => {
          success("User created successfully");

          clearInput();
          handleCancel();
        },
      });
    } catch (error) {
      errorMessage("Error creating user");
      throw new Error(`Error creating user ${error}`);
    }
  };

  function clearInput() {
    setformFields({ name: "", email: "", roleIds: [] });
    form.resetFields();
  }

  const handleOk = () => {
    //an empty function to keep the modal working
  };

  async function fetchRoles(pageNum) {
    const response = await axiosInstance.get("/roles", {
      params: {
        pageNum: pageNum,
      },
    });

    const data = await response.data;

    const dataRcord = await data.records.map((record) => {
      return {
        label: `${record.name}`,
        value: record.id,
      };
    });
    setOptions(...options, dataRcord);

    return options;
  }

  useEffect(() => {
    fetchRoles(pageNum);
  }, []);

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
            <CustomSelect
              mode="multiple"
              value={roleIds}
              placeholder="Select roles"
              options={options}
              onChange={(e) => setformFields({ ...formFields, roleIds: e })}
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
export default AddUsersForm;
