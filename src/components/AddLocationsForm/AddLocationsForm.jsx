import React, { useEffect, useState } from "react";

import { Button, Modal, Form, Input } from "antd";
import { message } from "antd";
import DebounceSelect from "../DebounceSelect/DebounceSelect";
import CustomSelect from "../CustomSelect/CustomSelect";
import { UserOutlined } from "@ant-design/icons";

import { MdOutlineEmail } from "react-icons/md";
import { axiosInstance } from "../../axios/axiosInstance";

const AddLocationsForm = () => {
  const [open, setOpen] = useState(false);
  const [pageNum, setpageNum] = useState(1);
  const [options, setOptions] = useState([]);
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
    digitalAddress: "",
    town: "",
    areaId: "",
    lat: "",
    long: "",
  });

  const { name, digitalAddress, town, areaId, lat, long } = formFields;

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
      await axiosInstance.post("/locations", {
        name,
        digitalAddress,
        town,
        areaId,
        lat,
        long,
      });

      success("Location created successfully");

      clearInput();
      handleCancel();
    } catch (error) {
      errorMessage("Error creating location");
      throw new Error(`Error creating location ${error}`);
    }
  };

  const clearInput = () => {
    setformFields({
      name: "",
      digitalAddress: "",
      town: "",
      areaId: "",
      lat: "",
      long: "",
    });
    form.resetFields();
  };

  const handleOk = () => {
    //an empty function to keep the modal working
  };

  async function fetchAreas(pageNum) {
    const response = await axiosInstance.get("/areas", {
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
    fetchAreas(pageNum);
  }, []);

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        onClick={showModal}
        style={{ backgroundColor: "#6E431D", color: "#fff" }}
      >
        Add Location
      </Button>
      <Modal
        title="ADD LOCATION"
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
              placeholder="Enter location name"
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="Digital Address"
            name="digitalAddress"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              name="digitalAddress"
              value={digitalAddress}
              onChange={(e) =>
                setformFields({ ...formFields, digitalAddress: e.target.value })
              }
              type="text"
              placeholder="Enter digital address"
              prefix={<MdOutlineEmail />}
            />
          </Form.Item>

          <Form.Item
            label="Town"
            name="town"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              name="town"
              value={town}
              onChange={(e) =>
                setformFields({ ...formFields, town: e.target.value })
              }
              type="text"
              placeholder="Enter town name"
              prefix={<MdOutlineEmail />}
            />
          </Form.Item>

          <Form.Item
            label="Area"
            name="areaId"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <CustomSelect
              mode="single"
              value={areaId}
              placeholder="Select area"
              options={options}
              onChange={(e) => setformFields({ ...formFields, areaId: e })}
              style={{
                width: "100%",
              }}
            />
          </Form.Item>

          <Form.Item
            label="Lattitude"
            name="lat"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              name="lat"
              value={lat}
              onChange={(e) =>
                setformFields({ ...formFields, lat: e.target.value })
              }
              placeholder="Enter lattitude"
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="Longitude"
            name="long"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              name="long"
              value={long}
              onChange={(e) =>
                setformFields({ ...formFields, long: e.target.value })
              }
              placeholder="Enter longitude"
              prefix={<UserOutlined />}
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
export default AddLocationsForm;
