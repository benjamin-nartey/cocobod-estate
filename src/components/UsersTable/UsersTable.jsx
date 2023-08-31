import React from "react";
import { Space, Table, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { BiEdit } from "react-icons/bi";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios/axiosInstance";
import { useState } from "react";

const { Column, ColumnGroup } = Table;

const UsersTable = () => {
  const { data, status, error } = useQuery(["users"], async () => {
    const response = await axiosInstance.get("/users", {
      params: {
        pageNum: "1",
      },
    });

    return response.data;
  });

  console.log(data);

  if (status === "loading") {
    return <p>...loading</p>;
  } else if (status === "error") {
    console.log(error);
  }

  return (
    <Table dataSource={data?.records} style={{ width: "100%" }}>
      <Column title="Name" dataIndex={`name`} key="name" />
      <Column
        title="Department"
        dataIndex="staff"
        render={(value) => <p>{value.department.name}</p>}
        key="department"
      />
      <Column
        title="Division"
        dataIndex="staff"
        render={(value) => <p>{value?.department.division?.name}</p>}
        key="division"
      />
      <Column
        title=" Station"
        dataIndex="staff"
        render={(value) => <p>{value?.station.region?.name}</p>}
        key="region"
      />

      <Column
        title="Roles"
        dataIndex="roles"
        key="roles"
        render={(roles) => (
          <>
            {roles.map((role, i) => (
              <Tag
                color={`${
                  role.name === "Super Administrator" ? "green" : "blue"
                }`}
                key={i}
              >
                {role.name}
              </Tag>
            ))}
          </>
        )}
      />
      <Column
        title="Action"
        key="action"
        render={(_, record) => (
          <Space size="middle">
            <BiEdit size={24} className="cursor-pointer text-gray-600" />
            <DeleteOutlined
              style={{
                fontSize: "24px",
                color: " #FF6A74",
                cursor: "pointer",
              }}
            />
          </Space>
        )}
      />
    </Table>
  );
};
export default UsersTable;
