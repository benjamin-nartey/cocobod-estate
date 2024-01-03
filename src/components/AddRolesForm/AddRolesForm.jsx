import React, { useState, useEffect } from "react";

import { Button, Modal, Form, Input, message } from "antd";

import { UserOutlined } from "@ant-design/icons";

import { useAddRoleData } from "../../Hooks/useAddFetch";
import { axiosInstance } from "../../axios/axiosInstance";
import CustomSelect from "../CustomSelect/CustomSelect";

const AddRolesForm = () => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [pageNum, setPageNum] = useState(1);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const { mutate } = useAddRoleData();

  const [formFields, setformFields] = useState({
    name: "",
    permissionIds: [],
  });

  const { name, permissionIds } = formFields;

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  async function fetchPermissions(pageNum) {
    const response = await axiosInstance.get("/permissions", {
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
    setOptions(dataRcord);
  }

  useEffect(() => {
    fetchPermissions(pageNum);
  }, []);

  // console.log(formFields);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const role = {name, permissionIds};
      mutate(role, {
        onSuccess: () => {
          message.success("Role created successfuly");

          clearInput();
          handleCancel();
        },
      });
    } catch (error) {
      message.error("Error creating role");
      throw new Error(`Error in creating role ${error}`);
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
        Add Role
      </Button>
      <Modal
        title="ADD ROLE"
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
              placeholder="Enter role name"
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="Permissions"
            name="permissions"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <CustomSelect
              mode="multiple"
              value={permissionIds}
              placeholder="Select permissions"
              options={options}
              onChange={(e) =>
                setformFields({ ...formFields, permissionIds: e })
              }
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
export default AddRolesForm;
