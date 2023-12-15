import React, { Fragment, useEffect, useState, useContext } from "react";
import { PropertyPseudoContext } from "../../context/propertyPseudo.context";
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

import { useIndexedDB } from "react-indexed-db-hook";
import Loader from "../Loader/Loader";

const PropertyForm = () => {
  const [propertyUnitReference, setPropertyUnitRefernce] = useState(null);
  const [optionsPropertyType, setOptionsPropertyType] = useState([]);
  const [optionsDistrict, setOptionsDistrict] = useState([]);
  const [optionsLocation, setOptionsLocation] = useState([]);
  const [districtId, setDistrictId] = useState("");
  const [propertyUnits, setPropertyUnits] = useState([]);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
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
  const { propertyPseudo, setPropertyPseudo } = useContext(
    PropertyPseudoContext
  );

  const { getAll: getAllPropertyTypes } = useIndexedDB("propertyTypes");
  const { getAll: getAllDistricts } = useIndexedDB("districts");
  const { getAll: getAllLocations } = useIndexedDB("locations");
  const { getAll: getAllpropertyReferences } =
    useIndexedDB("propertyReferences");

  const { add: addProperty } = useIndexedDB("property");

  const getAllPropertyUnits = (propertyPseudoId) => {
    getAllpropertyReferences().then((propertyReferences) => {
      const getPropertyUnitsByPropPseudoId = propertyReferences.filter(
        (references) =>
          references?.propertyReferenceCategory?.id === propertyPseudoId
      );
      setPropertyUnits(getPropertyUnitsByPropPseudoId);
      console.log({ getPropertyUnitsByPropPseudoId });
    });
  };

  useEffect(() => {
    getAllPropertyUnits(propertyPseudo?.id);
  }, [propertyPseudo]);

  const getDomainDistricts = () => {
    getAllDistricts().then((districts) => {
      const data = districts.map((record) => {
        return {
          label: record?.name,
          value: record?.id,
        };
      });

      setOptionsDistrict(data);
    });
  };

  useEffect(() => {
    getDomainDistricts();
  }, [propertyPseudo]);

  const getDomainTowns = (districtId) => {
    getAllLocations().then((locations) => {
      const getTownsByRegionId = locations.filter(
        (location) => location?.districtId === districtId
      );
      console.log({ getTownsByRegionId });

      const data = getTownsByRegionId.map((record) => {
        return {
          label: record?.name,
          value: record?.id,
        };
      });
      setOptionsLocation(data);
    });
  };

  console.log({ propertyUnits });

  useEffect(() => {
    getDomainTowns(districtId || propertyPseudo?.district?.id);
  }, [districtId]);

  const fetchPropertyTypes = async () => {
    getAllPropertyTypes().then((propertyType) => {
      const data = propertyType.map((record) => {
        return {
          label: record?.name,
          value: record?.id,
        };
      });
      setOptionsPropertyType(data);
    });
  };

  useEffect(() => {
    fetchPropertyTypes();
  }, []);

  const [location, setLocation] = useState(null);

  useEffect(() => {
    console.log({ propertyPseudo });
  }, [propertyPseudo]);

  const handleLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          form.setFieldValue("lat", latitude);
          form.setFieldValue("long", longitude);
          console.log(longitude, latitude);
        },
        (error) => {
          console.error("Error getting location", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
    }
    setLoading(false);
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

  const handleSubmit = async (values) => {
    // console.log(values);

    const data = {
      name: values?.name,
      description: values?.description,
      propertyCode: values?.propertyCode,
      digitalAddress: values?.digitalAddress,
      propertyTypeId: values?.propertyTypeId,
      locationId: values?.locationId,
      propertyReferenceCategoryId: propertyPseudo?.id,
      lat: `${values?.lat}`,
      long: `${values?.long}`,
      landmark: values?.landmark,
      propertyUnits: values?.propertyUnits?.length
        ? values?.propertyUnits?.map((propertyUnit) => ({
            description: propertyUnit.description,
            propertyCode: propertyUnit.propertyCode,
            plotSize: propertyUnit.plotSize ? propertyUnit.plotSize : undefined,
            floorArea: propertyUnit.floorArea
              ? propertyUnit.floorArea
              : undefined,
            propertyTypeId: propertyUnit.propertyTypeId,
            propertyReferenceId: propertyUnit?.id,
            propertyOccupancy: propertyUnit.occupants?.length
              ? propertyUnit.occupants?.map((occupant) => ({
                  leaseStartsOn:
                    occupant?.tenancyAgreeMentStartDate.toISOString(),
                  leaseExpiresOn:
                    occupant?.tenancyAgreeMentEndDate.toISOString(),
                  name: occupant?.occupantName,
                  category: occupant?.occupantType,
                  clientOccupantId: occupant?.occupantName,
                }))
              : [],
            propertyUnitStates: [
              {
                condition: propertyUnit?.condition,
                remarks: propertyUnit?.remarks,
              },
            ],
          }))
        : [],

      photos: fileList,
    };

    addProperty(data).then(
      () => {
        // success(`${values.name} saved successfully`);
        message.success(`${values.name} saved successfully`);
        // form.resetFields();
        // setPropertyPseudo(null);
      },
      (error) => {
        console.log(error);
        message.error(`Error saving ${values.name}`);
      }
    );
  };

  console.log({ fileList });

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      name: propertyPseudo?.name,
      propertyTypeId: propertyPseudo?.propertyType?.id,
      districtId: propertyPseudo?.district?.id,
    });
  }, [propertyPseudo]);

  return (
    <Fragment>
      {propertyPseudo && (
        <div className="w-full p-6">
          <Form
            className="bg-white w-full"
            form={form}
            layout="vertical"
            onFinish={(values) => handleSubmit(values)}
            // initialValues={propertyPseudo}
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
                readOnly
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
                placeholder="Select category"
                options={optionsPropertyType}
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>

            <Form.Item
              label="Ghana Post Address"
              name="digitalAddress"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input
                name="digitalAddress"
                type="text"
                placeholder="Enter Ghana Post Address"
                prefix={<MdOutlineEmail />}
              />
            </Form.Item>

            <Divider orientation="left">Location</Divider>

            <Form.Item
              label="District"
              name="districtId"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <CustomSelect
                mode="single"
                placeholder="Select District"
                options={optionsDistrict}
                style={{
                  width: "100%",
                }}
                onChange={(e) => setDistrictId(e)}
              />
            </Form.Item>

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
                placeholder="Select Town"
                options={optionsLocation}
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>

            <Space.Compact>
              <Form.Item
                label="Latitude"
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
                  type="text"
                  placeholder="latitude"
                  // value={location?.latitude}
                />
              </Form.Item>

              <Form.Item
                label="Longitude"
                name="long"
                // rules={[
                //   {
                //     required: true,
                //   },
                // ]}
              >
                <Input
                  name="long"
                  readOnly
                  type="text"
                  placeholder="longitude"
                  // value={location?.longitude}
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
                  {loading ? (
                    <Loader
                      width="w-5"
                      height="h-5"
                      fillColor="fill-[#6E431D]"
                    />
                  ) : (
                    "Generate"
                  )}
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
                type="text"
                placeholder="Enter landmark"
                prefix={<MdOutlineEmail />}
              />
            </Form.Item>

            <Divider />

            <Form.Item label=" " name="photos">
              <PhotosUploader
                props={props}
                handleChange={handleChange}
                fileList={fileList}
              />
            </Form.Item>

            <Divider orientation="left">Property Units</Divider>

            <Accordion
              propertyUnits={propertyUnits}
              form={form}
              setPropertyUnitRefernce={setPropertyUnitRefernce}
            />

            <Button
              className="w-full"
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#6E431D", color: "#fff" }}
            >
              Save
            </Button>
          </Form>
        </div>
      )}
    </Fragment>
  );
};
export default PropertyForm;
