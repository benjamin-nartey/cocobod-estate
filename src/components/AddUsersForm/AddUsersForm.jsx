import React, { useState } from "react";

import { Button, Modal, Form, Input } from "antd";
import DebounceSelect from "../DebounceSelect/DebounceSelect";
import { UserOutlined } from "@ant-design/icons";
import { MdOutlineEmail } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../axios/axiosInstance";

const AddUsersForm = () => {
  const [roleValue, setRoleValue] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const [formFields, setformFields] = useState({
    name: "",
    email: "",
    roles: [],
  });

  const { name, email, roles } = formFields;

  const showModal = () => {
    setOpen(true);
  };

  console.log(formFields);

  const handleSubmit = (e) => {};

  const handleOk = () => {
    setModalText("The modal will be closed after two seconds");
    // setConfirmLoading(true);
    setTimeout(() => {
      //   setOpen(false);
      //   setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  //   async function fetchUserList(username) {
  //     console.log("fetching user", username);
  //     return fetch("https://randomuser.me/api/?results=5")
  //       .then((response) => response.json())
  //       .then((body) =>
  //         body.results.map((user) => ({
  //           label: `${user.name.first} ${user.name.last}`,
  //           value: user.login.username,
  //         }))
  //       );
  //   }

  async function fetchRoles(username) {
    //   console.log("fetching user", username);
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
      <Button
        type="primary"
        onClick={showModal}
        style={{ backgroundColor: "#6E431D", color: "#fff" }}
      >
        Add User
      </Button>
      <Modal
        title="Title"
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
            name="roles"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DebounceSelect
              mode="multiple"
              value={roles}
              placeholder="Select roles"
              fetchOptions={fetchRoles}
              //   onChange={(newValue) => {
              //     setRoleValue(newValue);
              //   }}

              onChange={(e) => setformFields({ ...formFields, roles: e })}
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
