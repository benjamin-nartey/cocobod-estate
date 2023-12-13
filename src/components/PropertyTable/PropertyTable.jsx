import React, { useEffect, useState } from "react";

import { Button, Modal, Form, Input, Table, message, Popconfirm } from "antd";

import { DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { BiEdit } from "react-icons/bi";
import { MdOutlineEmail } from "react-icons/md";

import { axiosInstance } from "../../axios/axiosInstance";

import CustomSelect from "../CustomSelect/CustomSelect";

import { useQuery } from "@tanstack/react-query";

const PropertyTable = () => {
  const [pageNum, setPageNum] = useState(1);
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [recordsPerPage, setRecordsPerPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [formFields, setformFields] = useState({
    name: "",
    description: "",
    propertyNumber: "",
    propertyTypeId: "",
    locationId: "",
    divisionId: "",
  });

  const confirm = (e) => {
    message.success("Click on Yes");
  };
  const cancel = (e) => {};

  const {
    name,
    description,
    propertyNumber,
    propertyTypeId,
    locationId,
    divisionId,
  } = formFields;

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
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

  const handleOk = () => {
    //an empty function to keep the modal working
  };

  const fetchProperties = async (pageNum) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/properties", {
        params: {
          pageNum: pageNum,
        },
      });
      setTotalPages(response.data.meta.totalPages);
      setRecordsPerPage(response.data.meta.recordsPerPage);
      console.log({ totalPages });
      return response.data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const { data, status, error } = useQuery(["properties"], () =>
    fetchProperties(1)
  );

  console.log(data);

  if (status === "error") {
    console.log(error);
  }

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
    setOptions( dataRcord);

   
  }

  useEffect(() => {
    fetchAreas(pageNum);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.patch(`/locations/${locationId}`, {
        name,
        digitalAddress,
        town,
        areaId,
        lat,
        long,
      });

      if (response) {
        success("Location updated successfully");
        clearInput();
        handleCancel();
      }
    } catch (error) {
      errorMessage("Error updating location");
      throw new Error(`Error updating location ${error}`);
    }
  };

  function clearInput() {
    setformFields({
      name: "",
      description: "",
      propertyNumber: "",
      propertyTypeId: "",
      locationId: "",
      divisionId: "",
    });
    form.resetFields();
  }

  const columns = [
    {
      title: "Property Name",
      dataIndex: "name",
      key: "name",
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return (
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.status).toLowerCase().includes(value.toLowerCase()) ||
          String(record.propertyType.name)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.location.name)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.division.name)
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Property Number",
      dataIndex: ["propertyNumber"],
      key: "propertyNumber",
      filteredValue: [searchText],
    },
    {
      title: "Property Type",
      dataIndex: ["propertyType", "name"],
      key: "propertyType",
      filteredValue: [searchText],
    },
    {
      title: "Location ",
      dataIndex: ["location", "name"],
      key: "location",
    },
    {
      title: "Division",
      dataIndex: ["division", "name"],
      key: "division",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: " Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "action",
      render: (value) => {
        return (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={(e) => {
                setformFields({
                  ...formFields,
                  name: value?.name,
                  locationId: value?.id,
                });
                console.log(value);
                showModal();
              }}
            >
              <BiEdit size={22} className="cursor-pointer text-gray-600" />
            </button>
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              onConfirm={confirm}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <span className="grid place-items-center">
                <DeleteOutlined
                  style={{
                    fontSize: "18px",
                    color: " #FF6A74",
                    cursor: "pointer",
                  }}
                />
              </span>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  console.log(formFields);

  return (
    <>
      {contextHolder}
      <Modal
        title="EDIT PROPERTY"
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
            label="Property Number"
            name="propertyNumber"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              name="propertyNumber"
              value={propertyNumber}
              onChange={(e) =>
                setformFields({ ...formFields, propertyNumber: e.target.value })
              }
              type="text"
              placeholder="Enter property number"
              prefix={<MdOutlineEmail />}
            />
          </Form.Item>

          <Form.Item
            label="Property Type"
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
              placeholder="Select property type"
              options={options}
              onChange={(e) =>
                setformFields({ ...formFields, propertyTypeId: e })
              }
              style={{
                width: "100%",
              }}
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
              options={options}
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
              options={options}
              onChange={(e) => setformFields({ ...formFields, locationId: e })}
              style={{
                width: "100%",
              }}
            />
          </Form.Item>

          {/* <Form.Item label=" " name="uploadImages">
            <PhotosUploader
              props={props}
              handleUpload={handleUpload}
              handleChange={handleChange}
              fileList={fileList}
            />
          </Form.Item> */}

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

      <Input.Search
        placeholder="Search records..."
        onSearch={(value) => setSearchText(value)}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <Table
        dataSource={data?.records}
        loading={status === "loading" || loading}
        pagination={{
          pageSize: recordsPerPage,
          total: totalPages,
          onChange: (pageNum) => {
            fetchProperties(pageNum);
          },
        }}
        style={{ width: "100%" }}
        rowKey="id"
        columns={columns}
      ></Table>
    </>
  );
};
export default PropertyTable;
