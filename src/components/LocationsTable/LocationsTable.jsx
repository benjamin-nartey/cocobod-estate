import React, { useEffect } from "react";
import { Table, Tag } from "antd";
import { Button, Modal, Form, Input } from "antd";
import { message, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { BiEdit } from "react-icons/bi";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../axios/axiosInstance";
import { UserOutlined } from "@ant-design/icons";
import CustomSelect from "../CustomSelect/CustomSelect";
import { useState } from "react";
import { MdOutlineEmail } from "react-icons/md";

const LocationsTable = () => {
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
    digitalAddress: "",
    town: "",
    areaId: "",
    lat: "",
    long: "",
    locationId: "",
  });

  const confirm = (e) => {
    message.success("Click on Yes");
  };
  const cancel = (e) => {};

  const { name, digitalAddress, town, areaId, lat, long, locationId } =
    formFields;

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

  const fetchLocations = async (pageNum) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/locations", {
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

  const { data, status, error } = useQuery(["locations"], () =>
    fetchLocations(1)
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
    setOptions(...options, dataRcord);

    return options;
  }

  useEffect(() => {
    fetchAreas(pageNum);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.patch(`/locations/${locationId}`, {
        name,
        digitalAddress,
        town,
        areaId,
        lat,
        long,
      });

      success("Location updated successfully");

      clearInput();
      handleCancel();
    } catch (error) {
      errorMessage("Error updating location");
      throw new Error(`Error updating location ${error}`);
    }
  };

  const clearInput = () => {
    setformFields({ name: "", divisionId: [] });
    form.resetFields();
  };

  const columns = [
    {
      title: "Location Name",
      dataIndex: "name",
      key: "name",
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return (
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.status).toLowerCase().includes(value.toLowerCase()) ||
          String(record.area.name)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.town).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Area",
      dataIndex: ["area", "name"],
      key: "area",
      filteredValue: [searchText],
    },
    {
      title: "Town",
      dataIndex: ["town"],
      key: "town",
      filteredValue: [searchText],
    },
    {
      title: " Lattitude",
      dataIndex: "lat",
      key: "lat",
    },
    {
      title: "Longitude",
      dataIndex: "long",
      key: "long",
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
        title="EDIT LOCATION"
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
              defaultValue={name}
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
              defaultValue={digitalAddress}
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
              defaultValue={town}
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
            fetchLocations(pageNum);
          },
        }}
        style={{ width: "100%" }}
        rowKey="id"
        columns={columns}
      ></Table>
    </>
  );
};
export default LocationsTable;
