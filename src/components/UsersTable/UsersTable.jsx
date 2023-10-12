import React, { useEffect } from "react";
import { Space, Table, Tag } from "antd";
import { Button, Modal, Form, Input } from "antd";
import { message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { BiEdit } from "react-icons/bi";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../axios/axiosInstance";
import { UserOutlined } from "@ant-design/icons";
import DebounceSelect from "../DebounceSelect/DebounceSelect";
import { useState } from "react";

import { MdOutlineEmail } from "react-icons/md";

const { Column, ColumnGroup } = Table;

const UsersTable = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [formFields, setformFields] = useState({
    name: "",
    email: "",
    roleIds: [],
    id: "",
  });

  const { name, email, roleIds, id } = formFields;

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const success = () => {
    messageApi.open({
      type: "success",
      content: "User updated successfully",
    });
  };

  const errorMessage = () => {
    messageApi.open({
      type: "error",
      content: "Error updating user",
    });
  };

  const handleOk = () => {
    //an empty function to keep the modal working
  };

  const { data, status, error } = useQuery(["users"], async () => {
    const response = await axiosInstance.get("/users", {
      params: {
        pageNum: "1",
      },
    });

    return response.data;
  });

  if (status === "loading") {
    return <p>...loading</p>;
  } else if (status === "error") {
    console.log(error);
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roles = roleIds.map((role) => role.value);

    try {
      await axiosInstance.patch(`/users/${id}`, {
        name,
        email,
        roleIds: roles,
      });

      success();

      clearInput();
      handleCancel();
    } catch (error) {
      errorMessage();
      throw new Error(`Error adding user edits ${error}`);
    }
  };

  const clearInput = () => {
    setformFields({ name: "", email: "", roleIds: [] });
    form.resetFields();
  };

  console.log(formFields);

  return (
    <>
      {contextHolder}
      <Modal
        title="EDIT USER"
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
          name="useredit"
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
              defaultValue={name}
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
              defaultValue={email}
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

      <Table dataSource={data?.records} style={{ width: "100%" }} rowKey="id">
        <Column title="Name" dataIndex="name" key="name" />
        <Column
          title="Department"
          dataIndex="staff"
          render={(value) => <p>{value?.department?.name}</p>}
          key="department"
        />
        <Column
          title="Division"
          dataIndex="staff"
          render={(value) => <p>{value?.department?.division?.name}</p>}
          key="division"
        />
        <Column
          title=" Station"
          dataIndex="staff"
          render={(value) => <p>{value?.station?.region?.name}</p>}
          key="region"
        />

        <Column
          title="Roles"
          dataIndex="roles"
          key="roles"
          render={(roles) => (
            <>
              {roles?.map((role, i) => (
                <Tag
                  color={`${
                    role?.name === "Super Administrator" ? "green" : "blue"
                  }`}
                  key={i}
                >
                  {role?.name}
                </Tag>
              ))}
            </>
          )}
        />

        <Column
          title=" Status"
          dataIndex="status"
          render={(value) => <p>{value}</p>}
          key="status"
        />

        <Column
          title="Action"
          dataIndex=""
          key="action"
          render={(value) => {
            return (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={(e) => {
                    setformFields({
                      ...formFields,
                      name: value?.name,
                      email: value?.email,
                      id: value?.id,
                    });
                    console.log(value);
                    showModal();
                  }}
                >
                  <BiEdit size={22} className="cursor-pointer text-gray-600" />
                </button>
                <DeleteOutlined
                  style={{
                    fontSize: "18px",
                    color: " #FF6A74",
                    cursor: "pointer",
                  }}
                />
              </div>
            );
          }}
        />
      </Table>
    </>
  );
};
export default UsersTable;
