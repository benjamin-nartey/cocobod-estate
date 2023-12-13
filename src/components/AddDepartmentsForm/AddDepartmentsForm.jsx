import React, { useEffect, useState } from "react";

import { Button, Modal, Form, Input, message } from "antd";

import { UserOutlined } from "@ant-design/icons";

import CustomSelect from "../CustomSelect/CustomSelect";

import { axiosInstance } from "../../axios/axiosInstance";

const AddDepartmentsForm = () => {
  const [pageNum, setPageNum] = useState(1);
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

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
    divisionId: [],
  });

  const { name, divisionId } = formFields;

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  console.log(formFields);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const divisions = divisionId.map((division) => division.value);

    try {
      await axiosInstance.post("/departments", {
        name,
        divisionId: divisions,
      });

      success("Department added successfully");

      clearInput();
      handleCancel();
    } catch (error) {
      errorMessage("Error in creating department");
      throw new Error(`Error in creating department ${error}`);
    }
  };

  function clearInput() {
    setformFields({ name: "", divisionId: [] });
    form.resetFields();
  }

  const handleOk = () => {
    //an empty function to keep the modal working
  };

  async function fetchDivisions(pageNum) {
    const response = await axiosInstance.get("/divisions", {
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
    fetchDivisions(pageNum);
  }, []);

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        onClick={showModal}
        style={{ backgroundColor: "#6E431D", color: "#fff" }}
      >
        Add Department
      </Button>
      <Modal
        title="ADD DEPARTMENT"
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
              placeholder="Enter name"
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="Divisions"
            name="divisionId"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <CustomSelect
              mode="single"
              value={divisionId}
              placeholder="Select divisions"
              options={options}
              onChange={(e) => setformFields({ ...formFields, divisionId: e })}
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
export default AddDepartmentsForm;
