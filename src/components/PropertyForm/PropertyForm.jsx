import React, { useEffect, useState } from "react";
import Accordion from "../Accordion/Accordion";

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
  propertyCode: "",
  propertyTypeId: "",
  description: "",
  digitalAddress: "",
  locationId: "",
  propertyReferenceCategoryId: "",
  arcGisLink: "",
  lat: "",
  long: "",
  landmark: "",
};

const PropertyForm = () => {
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
  const [location, setLocation] = useState(null);

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          console.log(longitude, latitude);
        },
        (error) => {
          console.error("Error getting location", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
    }
  };

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
    propertyCode,
    propertyTypeId,
    description,
    digitalAddress,
    locationId,
    propertyReferenceCategoryId,
    arcGisLink,
    lat,
    long,
    landmark,
  } = formFields;

  console.log({ formFields });
  console.log({ fileList });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const property = {
        // name,
        // description,
        // digitalAddress,
        // locationId,
        // landmark,
        // propertyTypeId,
        // aquisitionDate,
        // lat,
        // long,
        // photos,
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
    <div className="w-full p-6">
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
        <Divider orientation="left">Property Information</Divider>

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
          label="Ghana Post Address"
          name="digitalAdress"
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
            placeholder="Enter Ghana Post Address"
            prefix={<MdOutlineEmail />}
          />
        </Form.Item>

        <Divider orientation="left">Location</Divider>

        <Form.Item
          label="Town"
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
            placeholder="Select Town"
            options={optionsLocation}
            onChange={(e) => setformFields({ ...formFields, locationId: e })}
            style={{
              width: "100%",
            }}
          />
        </Form.Item>

        <Space.Compact>
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
              readOnly
              value={lat}
              onChange={(e) =>
                setformFields({ ...formFields, lat: e.target.value })
              }
              type="text"
              placeholder="lattitude"
              // prefix={<MdOutlineEmail />}
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
              readOnly
              value={long}
              onChange={(e) =>
                setformFields({ ...formFields, long: e.target.value })
              }
              type="text"
              placeholder="longitude"
              // prefix={<MdOutlineEmail />}
            />
          </Form.Item>

          <Form.Item label=" ">
            <Button
              className=""
              type="primary"
              htmlType="button"
              style={{ backgroundColor: "#6E431D", color: "#fff" }}
              onClick={handleLocation}
            >
              Generate
            </Button>
          </Form.Item>
        </Space.Compact>

        <Form.Item
          label="Landmark"
          name="landmark"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input
            name="landmark"
            value={landmark}
            onChange={(e) =>
              setformFields({ ...formFields, landmark: e.target.value })
            }
            type="text"
            placeholder="Enter landmark"
            prefix={<MdOutlineEmail />}
          />
        </Form.Item>

        <Divider />

        <Form.Item label=" " name="uploadImages">
          <PhotosUploader
            props={props}
            handleChange={handleChange}
            fileList={fileList}
          />
        </Form.Item>

        <Divider orientation="left">Property Units</Divider>

        <Accordion />

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
export default PropertyForm;
