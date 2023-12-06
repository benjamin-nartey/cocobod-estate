import React, { useEffect, useState } from "react";

import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Space,
  Divider,
} from "antd";
import Upload from "antd/es/upload/Upload";

import { UserOutlined } from "@ant-design/icons";
import { MdOutlineEmail } from "react-icons/md";

import CustomSelect from "../../components/CustomSelect/CustomSelect";
import PhotosUploader from "../../components/PhotosUploader/PhotosUploader";

import { axiosInstance } from "../../axios/axiosInstance";
import { useAddPropertyData } from "../../Hooks/useAddFetch";

const defaultFormFields = {
  name: "",
  description: "",
  plotSize: "",
  floorArea: "",
  condition: "",
  propertyId: "",
  propertyTypeId: "",
  propertyReferenceId: "",
  occupant: "",
  occupantType: "",
  tenancyAgreeMentStartDate: "",
  tenancyAgreeMentEndDate: "",
};

const PropertyUnitForm = () => {
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
  const [formFields, setformFields] = useState(defaultFormFields);
  const [optionsOccupant, setOptionsOccupant] = useState([
    {
      label: "LBC",
      value: "LBC",
    },
    {
      label: "NON LBC",
      value: "NON LBC",
    },
  ]);

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

  const {
    name,
    description,
    plotSize,
    floorArea,
    condition,
    propertyTypeId,
    propertyReferenceId,
    occupant,
    occupantType,
    tenancyAgreeMentStartDate,
    tenancyAgreeMentEndDate,
  } = formFields;

  console.log({ formFields });
  console.log({ fileList });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const property = {
        name,
        description,
        plotSize,
        floorArea,
        condition,
        propertyTypeId,
        propertyReferenceId,
        occupant,
        occupantType,
        tenancyAgreeMentStartDate,
        tenancyAgreeMentEndDate,
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
        },
      });
    } catch (error) {
      errorMessage("Error adding property");
      throw new Error(`Error in creating user ${error}`);
    }
  };

  function clearInput() {
    setformFields(defaultFormFields);
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
    <div className="w-full bg-white p-3">
      <Form
        className="bg-white w-full"
        form={form}
        layout="vertical"
        onSubmitCapture={handleSubmit}
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
        style={
          {
            // maxWidth: 600,
          }
        }
      >
        <Divider orientation="left">Property Unit Information</Divider>
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
            placeholder="Enter property unit name"
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
            placeholder="Enter property unit description"
            prefix={<MdOutlineEmail />}
          />
        </Form.Item>

        <Form.Item
          label="Category"
          name="propertyTypeId"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <CustomSelect
            mode="single"
            value={propertyTypeId}
            placeholder="Select category"
            options={optionsLocation}
            onChange={(e) =>
              setformFields({ ...formFields, propertyTypeId: e })
            }
            style={{
              width: "100%",
            }}
          />
        </Form.Item>

        <Form.Item
          label="Plot Size"
          name="plotSize"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input
            name="plotSize"
            value={plotSize}
            onChange={(e) =>
              setformFields({ ...formFields, plotSize: e.target.value })
            }
            type="text"
            placeholder="Enter Plot Size"
            prefix={<MdOutlineEmail />}
          />
        </Form.Item>

        <Form.Item
          label="Floor Area"
          name="floorArea"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input
            name="floorArea"
            value={floorArea}
            onChange={(e) =>
              setformFields({ ...formFields, floorArea: e.target.value })
            }
            type="text"
            placeholder=""
            prefix={<MdOutlineEmail />}
          />
        </Form.Item>

        <Form.Item
          label="Condition"
          name="condition"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input
            name="condition"
            value={condition}
            onChange={(e) =>
              setformFields({ ...formFields, condition: e.target.value })
            }
            type="text"
            placeholder="Enter property unit condition"
            prefix={<MdOutlineEmail />}
          />
        </Form.Item>

        <Divider orientation="left">Occupancy</Divider>

        <Form.Item
          label="Occupant Name"
          name="occupant"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input
            name="occupant"
            value={occupant}
            onChange={(e) =>
              setformFields({ ...formFields, occupant: e.target.value })
            }
            type="text"
            placeholder="Enter occupant name"
            prefix={<MdOutlineEmail />}
          />
        </Form.Item>

        <Form.Item
          label="Occupant Type"
          name="occupantType"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <CustomSelect
            mode="single"
            value={occupantType}
            placeholder="Select type of Occupant"
            options={optionsOccupant}
            onChange={(e) => setformFields({ ...formFields, occupantType: e })}
            style={{
              width: "100%",
            }}
          />
        </Form.Item>

        <Form.Item
          label="Tenancy Agreement Start-date"
          name="tenancyAgreeMentStartDate"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker
            name="tenancyAgreeMentStartDate"
            value={tenancyAgreeMentStartDate}
            onChange={handleDatePicker}
          />
        </Form.Item>

        <Form.Item
          label="Tenancy Agreement End-date"
          name="tenancyAgreeMentEndDate"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker
            name="tenancyAgreeMentEndDate"
            value={tenancyAgreeMentEndDate}
            onChange={handleDatePicker}
          />
        </Form.Item>

        <Divider />

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
    </div>
  );
};
export default PropertyUnitForm;
