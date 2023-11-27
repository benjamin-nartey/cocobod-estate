import React, { useEffect, useState } from "react";

import { Button, Modal, Form, Input, DatePicker, message } from "antd";
import Upload from "antd/es/upload/Upload";

import { UserOutlined } from "@ant-design/icons";
import { MdOutlineEmail } from "react-icons/md";

import CustomSelect from "../CustomSelect/CustomSelect";
import PhotosUploader from "../PhotosUploader/PhotosUploader";

import { axiosInstance } from "../../axios/axiosInstance";
import { useAddPropertyData } from "../../Hooks/useAddFetch";

const AddPropertyForm = () => {
  const [open, setOpen] = useState(false);
  const [pageNum, setpageNum] = useState(1);
  const [optionsPropertyType, setOptionsPropertyType] = useState([]);
  const [optionsLocation, setOptionsLocation] = useState([]);
  const [optionsDivision, setOptionsDivision] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [propertyResponse, setPropertyResponse] = useState("");

  const { mutate } = useAddPropertyData();

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },

    beforeUpload: (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
        return Upload.LIST_IGNORE;
      }

      return false;

      //   return isJpgOrPng || Upload.LIST_IGNORE;
    },
  };

  const handleChange = (info) => {
    let newFileList = [...info.fileList];
    setFileList(newFileList);
  };

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
    description: "",
    propertyCode: "",
    propertyTypeId: "",
    lotNumber: "",
    aquisitionDate: "",
    arcGisUrl: "",
    locationId: "",
    divisionId: "",
  });

  const {
    name,
    description,
    propertyCode,
    propertyTypeId,
    lotNumber,
    aquisitionDate,
    arcGisUrl,
    locationId,
    divisionId,
  } = formFields;

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  console.log({ formFields });
  console.log({ fileList });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const property = {
        name,
        description,
        propertyCode,
        propertyTypeId,
        lotNumber,
        aquisitionDate,
        arcGisUrl,
        locationId,
        divisionId,
      };

      mutate(property, {
        onSuccess: async (data) => {
          setPropertyResponse(data);
          console.log(data);
          if (data && fileList.length !== 0) {
            try {
              const response = await axiosInstance.post(
                `properties/${data.data.id}/photos`
              );
              if (response) {
                success("Property images uploaded successfully");
                console.log({ response });
              }
            } catch (error) {
              console.log(error);
              errorMessage("Error adding property images");
            }
          }
          success("Property added successfully");
          clearInput();
          handleCancel();
        },
      });
    } catch (error) {
      errorMessage("Error adding property");
      throw new Error(`Error in creating user ${error}`);
    }
  };

  function clearInput() {
    setformFields({
      name: "",
      description: "",
      propertyCode: "",
      propertyTypeId: "",
      lotNumber: "",
      aquisitionDate: "",
      arcGisUrl: "",
      locationId: "",
      divisionId: "",
    });
    form.resetFields();
  }

  const handleOk = () => {
    //an empty function to keep the modal working
  };

  async function fetchPropertyTypes(pageNum) {
    const response = await axiosInstance.get("/property-types", {
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
    setOptionsPropertyType(...optionsPropertyType, dataRcord);

    return optionsPropertyType;
  }

  async function fetchDivision(pageNum) {
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
    setOptionsDivision(...optionsDivision, dataRcord);

    return optionsDivision;
  }

  async function fetchLocations(pageNum) {
    const response = await axiosInstance.get("/locations", {
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
    setOptionsLocation(...optionsLocation, dataRcord);

    return optionsLocation;
  }

  useEffect(() => {
    fetchPropertyTypes(pageNum);
    fetchLocations(pageNum);
    fetchDivision(pageNum);
  }, []);

  const handleDatePicker = (_, dateString) => {
    setformFields({ ...formFields, aquisitionDate: dateString });
  };

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        onClick={showModal}
        style={{ backgroundColor: "#6E431D", color: "#fff" }}
      >
        Add Property
      </Button>
      <Modal
        title="ADD PROPERTY"
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
              placeholder="Enter property name"
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              name="description"
              value={description}
              onChange={(e) =>
                setformFields({ ...formFields, description: e.target.value })
              }
              type="text"
              placeholder="Enter property description"
              prefix={<MdOutlineEmail />}
            />
          </Form.Item>

          <Form.Item
            label="Property Code"
            name="propertyCode"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              name="propertyCode"
              value={propertyCode}
              onChange={(e) =>
                setformFields({ ...formFields, propertyCode: e.target.value })
              }
              type="text"
              placeholder="Enter property code"
              prefix={<MdOutlineEmail />}
            />
          </Form.Item>

          <Form.Item
            label="Lot Number"
            name="lotNumber"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              name="lotNumber"
              value={lotNumber}
              onChange={(e) =>
                setformFields({ ...formFields, lotNumber: e.target.value })
              }
              type="text"
              placeholder="Enter lot number"
              prefix={<MdOutlineEmail />}
            />
          </Form.Item>

          <Form.Item
            label="Aquisition Date"
            name="aquisitionDate"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker
              name="aquisitionDate"
              value={aquisitionDate}
              onChange={handleDatePicker}
            />
          </Form.Item>

          <Form.Item
            label="ArcGIS url"
            name="arcGisUrl"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              name="arcGisUrl"
              value={arcGisUrl}
              onChange={(e) =>
                setformFields({ ...formFields, arcGisUrl: e.target.value })
              }
              type="text"
              placeholder="Enter ArcGIS url"
              prefix={<MdOutlineEmail />}
            />
          </Form.Item>

          <Form.Item
            label="Division"
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
              placeholder="Select division"
              options={optionsDivision}
              onChange={(e) => setformFields({ ...formFields, divisionId: e })}
              style={{
                width: "100%",
              }}
            />
          </Form.Item>

          <Form.Item
            label="Location"
            name="locationId"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <CustomSelect
              mode="single"
              value={locationId}
              placeholder="Select location"
              options={optionsLocation}
              onChange={(e) => setformFields({ ...formFields, locationId: e })}
              style={{
                width: "100%",
              }}
            />
          </Form.Item>

          <Form.Item label=" " name="uploadImages">
            <PhotosUploader
              props={props}
              handleChange={handleChange}
              fileList={fileList}
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
export default AddPropertyForm;
