import React, { Fragment, useEffect, useState, useContext } from "react";
// import { propertyReferenceCategoriesContext } from '../../context/propertyReferenceCategories.context';
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

import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import { MdOutlineEmail } from "react-icons/md";

import CustomSelect from "../../components/CustomSelect/CustomSelect";
import PhotosUploader from "../../components/PhotosUploader/PhotosUploader";

import { axiosInstance } from "../../axios/axiosInstance";
import { useAddPropertyData } from "../../Hooks/useAddFetch";

import { useIndexedDB } from "react-indexed-db-hook";
import Loader from "../Loader/Loader";
import { useNavigate, useLocation } from "react-router-dom";
import Dragger from "antd/es/upload/Dragger";
import { capitalize } from "../../utils/typography";

const PropertyForm = (id) => {
  const [propertyUnitReference, setPropertyUnitRefernce] = useState(null);
  const [politicalRegionId, setPoliticalRegionId] = useState("");
  const [optionsPropertyType, setOptionsPropertyType] = useState([]);
  const [optionsDistrict, setOptionsDistrict] = useState([]);
  const [optionsPoliticalRegions, setOptionsPoliticalRegions] = useState([]);
  const [propertyReferenceCategories, setPropertyReferenceCategories] =
    useState({});
  const [optionsPoliticalDistricts, setOptionsPoliticalDistricts] = useState(
    []
  );
  const [optionsLocation, setOptionsLocation] = useState([]);
  const [districtId, setDistrictId] = useState("");
  // const [propertyUnits, setPropertyUnits] = useState([]);
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

  const navigate = useNavigate();
  const pathLocation = useLocation();
  const pathName = pathLocation.pathname;

  const { getAll: getAllPropertyTypes } = useIndexedDB("propertyTypes");
  const { getAll: getAllDistricts } = useIndexedDB("districts");
  const { getAll: getAllPoliticalRegions } = useIndexedDB("politcalRegions");
  const { getAll: getAllPoliticalDistricts } =
    useIndexedDB("politcalDistricts");

  const { getAll: getAllLocations } = useIndexedDB("locations");
  // const { getAll: getAllpropertyReferences } =
  //   useIndexedDB('propertyReferences');

  const { getAll: getAllPropertyReferenceCategories } = useIndexedDB(
    "propertyReferenceCategories"
  );

  const { deleteRecord: deletePropertyReferenceCategory } = useIndexedDB(
    "propertyReferenceCategories"
  );

  const { getAll: getAllProperty } = useIndexedDB("property");

  // const { getAll: getAllpropertyReferences } =
  //   useIndexedDB("propertyReferences");

  // console.log({ propertyReferenceCategories });

  useEffect(() => {
    if (id && pathName.includes("property-capture")) {
      getAllPropertyReferenceCategories().then(
        (allPropertyReferenceCategory) => {
          // console.log({ allPropertyReferenceCategory });

          const referencesCategories = allPropertyReferenceCategory?.filter(
            (pr) => pr?.id === id?.id
          );

          setPropertyReferenceCategories(referencesCategories[0]);
        }
      );
    } else if (id && pathName.includes("property-upload")) {
      getAllProperty().then((properties) => {
        const property = properties?.filter(
          (property) => `${property?.id}` === `${id?.id}`
        );

        setPropertyReferenceCategories(property[0]);
      });
    }
  }, [id]);

  // console.log({ propertyReferenceCategories });

  const { add: addProperty } = useIndexedDB("property");
  const { update: updateProperty } = useIndexedDB("property");

  // const getAllPropertyUnits = (id) => {
  //   getAllpropertyReferences().then((propertyReferences) => {
  //     const getPropertyUnitsByPropPseudoId = propertyReferences.filter(
  //       (references) => references?.propertyReferenceCategory?.id === id?.id
  //     );
  //     setPropertyUnits(getPropertyUnitsByPropPseudoId);
  //   });
  // };

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

  const getPoliticalRegions = () => {
    getAllPoliticalRegions().then((regions) => {
      const data = regions.map((record) => {
        return {
          label: record?.name,
          value: record?.id,
        };
      });
      setOptionsPoliticalRegions(data);
    });
  };

  useEffect(() => {
    getPoliticalRegions();
    getDomainDistricts();
  }, [propertyReferenceCategories]);

  const getPolitcalDistricts = (regionId) => {
    getAllPoliticalDistricts().then((districts) => {
      const getDistrictsByRegionId = districts.filter(
        (district) => district?.politicalRegion?.id === regionId
      );

      const data = getDistrictsByRegionId.map((record) => {
        return {
          label: record && capitalize(record?.name.toLowerCase()),
          value: record?.id,
        };
      });
      setOptionsPoliticalDistricts(data);
    });
  };

  useEffect(() => {
    getPolitcalDistricts(
      politicalRegionId || propertyReferenceCategories?.politicalRegionId
    );
  }, [politicalRegionId, propertyReferenceCategories?.politicalRegionId]);

  const getDomainTowns = (districtId) => {
    getAllLocations().then((locations) => {
      const getTownsByRegionId = locations.filter(
        (location) => location?.districtId === districtId
      );
      // console.log({ getTownsByRegionId });

      const data = getTownsByRegionId.map((record) => {
        return {
          label: record?.name,
          value: record?.id,
        };
      });
      setOptionsLocation(data);
    });
  };

  useEffect(() => {
    getDomainTowns(
      districtId ||
        propertyReferenceCategories?.location?.district.id ||
        propertyReferenceCategories?.cocoaDistrictId
    );
  }, [
    districtId,
    propertyReferenceCategories?.location?.district.id,
    propertyReferenceCategories?.cocoaDistrictId,
  ]);

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

  console.log(loading);

  const handleLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          form.setFieldValue("lat", latitude);
          form.setFieldValue("long", longitude);
          // console.log(longitude, latitude);
          setLoading(false);
        },
        (error) => {
          setLoading(false);
          message.error("Error getting location", error.message);
        }
      );
    } else {
      setLoading(false);
      message.error("Geolocation is not supported by this browser");
    }
    // setLoading(false);
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

  const handleSubmit = async (values) => {
    // console.log(values);

    const data = {
      name: values?.name,
      description: values?.description,
      propertyCode: values?.digitalAddress,
      digitalAddress: values?.digitalAddress,
      propertyTypeId: values?.propertyTypeId,
      locationId: values?.locationId,
      propertyReferenceCategoryId: propertyReferenceCategories?.id,
      lat: `${values?.lat?.length > 10 ? values.lat.toFixed(10) : values.lat}`,
      long: `${
        values?.long?.length > 10 ? values.long.toFixed(10) : values.long
      }`,
      landmark: values?.landmark,
      politicalDistrictId: values?.politicalDistrict,
      photos: values?.photos,
      cocoaDistrictId: values?.districtId,
      politicalRegionId: values?.politicalRegion,

      propertyUnits: values?.propertyUnits?.length
        ? values?.propertyUnits?.map((propertyUnit) => {
            const data = {
              descriptionPerFixedAssetReport:
                propertyUnit.descriptionPerFixedAssetReport,
              description: propertyUnit.description,
              // propertyCode: propertyUnit.propertyCode,
              // plotSize: propertyUnit.plotSize ? propertyUnit.plotSize : undefined,
              // floorArea: propertyUnit.floorArea
              //   ? propertyUnit.floorArea
              //   : undefined,
              propertyTypeId: propertyUnit.propertyTypeId,
              propertyReferenceId: propertyUnit?.id,
              propertyOccupancy: propertyUnit.occupants?.length
                ? propertyUnit.occupants?.map((occupant) => ({
                    [occupant?.occupantName ? "name" : "clientOccupantId"]:
                      occupant.occupantName
                        ? occupant.occupantName
                        : occupant.occupantId,

                    category: occupant?.occupantType,
                  }))
                : [],
              propertyUnitStates: [
                {
                  condition: propertyUnit?.condition,
                  remarks: propertyUnit?.remarks,
                },
              ],
            };

            if (propertyUnit.plotSize === null) {
              data.plotSize = "0";
            } else if (propertyUnit.plotSize) {
              data.plotSize = propertyUnit.plotSize;
            } else if (propertyUnit.floorArea === null) {
              data.floorArea = "0";
            } else if (propertyUnit.floorArea) {
              data.floorArea = propertyUnit.floorArea;
            }

            return data;
          })
        : [],
    };

    if (id && pathName.includes("property-capture")) {
      addProperty(data).then(
        () => {
          message.success(`${values.name} saved successfully`);
          form.resetFields();

          deletePropertyReferenceCategory(propertyReferenceCategories.id).then(
            () => navigate("/property-upload")
          );
        },
        (error) => {
          message.error(error.message);
        }
      );
    } else {
      updateProperty({
        ...data,
        propertyReferenceCategoryId:
          propertyReferenceCategories?.propertyReferenceCategoryId,
        id: Number(id?.id),
      }).then(
        () => {
          message.success(`${values.name} edited successfully`);
          form.resetFields();
          navigate("/property-upload");

          // setpropertyReferenceCategories(null);
        },
        (error) => {
          message.error(error.message);
        }
      );
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      name: propertyReferenceCategories?.name,
      propertyTypeId:
        propertyReferenceCategories?.propertyType?.id ||
        propertyReferenceCategories?.propertyTypeId,
      districtId:
        propertyReferenceCategories?.location?.district?.id ||
        propertyReferenceCategories?.cocoaDistrictId,
      locationId:
        propertyReferenceCategories?.location?.id ||
        propertyReferenceCategories?.locationId,
      long: propertyReferenceCategories?.long,
      lat: propertyReferenceCategories?.lat,
      landmark: propertyReferenceCategories?.landmark,
      digitalAddress: propertyReferenceCategories?.digitalAddress,
      description: propertyReferenceCategories?.description,
      politicalRegion: propertyReferenceCategories?.politicalRegionId,
      politicalDistrict: propertyReferenceCategories?.politicalDistrictId,
    });
  }, [propertyReferenceCategories]);

  return (
    <Fragment>
      {propertyReferenceCategories && (
        <div className="w-full p-6">
          <Form
            className="bg-white w-full"
            form={form}
            layout="vertical"
            onFinish={(values) => handleSubmit(values)}
            // initialValues={propertyReferenceCategories}
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
              label="Cocoa District"
              name="districtId"

              // rules={[
              //   {
              //     required: true,
              //   },
              // ]}
            >
              <CustomSelect
                disabled={true}
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
              label="Political Region"
              name="politicalRegion"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <CustomSelect
                mode="single"
                placeholder="Select political region"
                options={optionsPoliticalRegions}
                style={{
                  width: "100%",
                }}
                onChange={(e) => setPoliticalRegionId(e)}
              />
            </Form.Item>
            <Form.Item
              label="Political District"
              name="politicalDistrict"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <CustomSelect
                mode="single"
                placeholder="Select political district"
                options={optionsPoliticalDistricts}
                style={{
                  width: "100%",
                }}
                // onChange={(e) => setDistrictId(e)}
              />
            </Form.Item>

            <Form.Item
              label="Town"
              name="locationId"
              // rules={[
              //   {
              //     required: true,
              //   },
              // ]}
            >
              <CustomSelect
                disabled={true}
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
                rules={[
                  {
                    required: true,
                  },
                ]}
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

            <Form.Item label="photos" name="photos">
              <Dragger
                multiple
                accept={"image/png, image/jpeg, image/jpg"}
                listType="picture"
                {...props}
                // onChange={handleChange}
                // fileList={fileList}
              >
                <p className="ant-upload-drag-icon">
                  <PlusOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag image files to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload.
                </p>
              </Dragger>
            </Form.Item>

            <Divider orientation="left">Property Units</Divider>

            <Accordion form={form} id={id.id} />

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

      {/* {loading && (
        <Loader width="w-5" height="h-5" fillColor="fill-[#6E431D]" />
      )} */}
    </Fragment>
  );
};
export default PropertyForm;
