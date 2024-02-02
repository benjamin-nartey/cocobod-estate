import React, { useEffect, useState } from "react";

import {
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Table,
  Tag,
} from "antd";

import { DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { BiEdit } from "react-icons/bi";
import { MdOutlineEmail } from "react-icons/md";

import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "../../axios/axiosInstance";

import CustomSelect from "../CustomSelect/CustomSelect";
import { useGetPaginatedData } from "../../Hooks/query/generics";
import { getAllUsers } from "../../http/users";
import state from "../../store/store";
import { CRUDTYPES } from "../../store/modalSlice";

const UsersTable = () => {
  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(1);

  const [searchText, setSearchText] = useState("");

  const [form] = Form.useForm();

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

  const [paginatedData, props] = useGetPaginatedData(
    "users",
    "",
    { pageNum: page },
    getAllUsers
  );

  const _data = props.data?.data?.records?.map((rec) => ({
    ...rec,
    key: rec?.id,
  }));

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return (
          String(record?.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record?.status).toLowerCase().includes(value.toLowerCase()) ||
          String(record?.staff?.department?.name)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record?.staff?.department?.division.name)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record?.staff?.station?.name)
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
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
      dataIndex: ["staff", "station", "name"],
      key: "station",
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      render: (_, { roles }) => (
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
      render: (value, record) => {
        return (
          <div className="flex items-center justify-center gap-4">
            <BiEdit
              size={22}
              className="cursor-pointer text-gray-600"
              onClick={() => {
                state.modalSlice.selectedRecord = record;
                state.modalSlice.toggleshowUserAddModal();
                state.modalSlice.crudType = CRUDTYPES.EDIT;
              }}
            />

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

  return (
    <>
      {contextHolder}

      <Input.Search
        placeholder="Search records..."
        onSearch={(value) => setSearchText(value)}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <Table
        dataSource={_data}
        loading={props?.isLoading || props?.isFetching}
        pagination={{
          pageSize: paginatedData?.pageSize,
          total: paginatedData?.total,
          // onChange: (pageNum) => {
          //   fetchUsers(pageNum);
          // },
        }}
        onChange={(pagination) => {
          setPage(pagination.current);
        }}
        style={{ width: "100%" }}
        rowKey="id"
        columns={columns}
      ></Table>
    </>
  );
};
export default UsersTable;
