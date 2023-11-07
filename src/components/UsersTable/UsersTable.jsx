import React, { useEffect } from "react";
import { Table, Tag } from "antd";
import { Button, Modal, Form, Input } from "antd";
import { message, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { BiEdit } from "react-icons/bi";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../axios/axiosInstance";
import { UserOutlined } from "@ant-design/icons";
import DebounceSelect from "../DebounceSelect/DebounceSelect";
import { useState } from "react";

import { MdOutlineEmail } from "react-icons/md";

const UsersTable = () => {
  const [open, setOpen] = useState(false);
  const [recordsPerPage, setRecordsPerPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [formFields, setformFields] = useState({
    name: "",
    email: "",
    roleIds: [],
    id: "",
  });

  const confirm = (e) => {
    message.success("Click on Yes");
  };
  const cancel = (e) => {};

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

  const fetchUsers = async (pageNum) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/users", {
        params: {
          pageNum: pageNum,
        },
      });
      setTotalPages(response.data.meta.totalPages);
      setRecordsPerPage(response.data.meta.recordsPerPage);
      console.log({ totalPages });
      return response.data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const { data, status, error } = useQuery(["users"], () => fetchUsers(1));

  console.log(data);

  if (status === "error") {
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

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return (
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.status).toLowerCase().includes(value.toLowerCase()) ||
          String(record.staff.department.name)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.staff.department.division.name)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.staff.station.region.name)
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Department",
      dataIndex: ["staff", "department", "name"],
      key: "department",
      filteredValue: [searchText],
    },
    {
      title: "Division",
      dataIndex: ["staff", "department", "division", "name"],
      key: "division",
    },
    {
      title: " Station",
      dataIndex: ["staff", "station", "region", "name"],
      key: "region",
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: 'roles',
      render: (_, {roles}) => (
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
      ),
    },
    {
      title: " Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "action",
      render: (value) => {
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
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              onConfirm={confirm}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <span className="grid place-items-center">
                <DeleteOutlined
                  style={{
                    fontSize: "18px",
                    color: " #FF6A74",
                    cursor: "pointer",
                  }}
                />
              </span>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

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

      <Input.Search
        placeholder="Search records..."
        onSearch={(value) => setSearchText(value)}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <Table
        dataSource={data?.records}
        loading={status === "loading" || loading}
        pagination={{
          pageSize: recordsPerPage,
          total: totalPages,
          onChange: (pageNum) => {
            fetchUsers(pageNum);
          },
        }}
        style={{ width: "100%" }}
        rowKey="id"
        columns={columns}
      ></Table>
    </>
  );
};
export default UsersTable;

