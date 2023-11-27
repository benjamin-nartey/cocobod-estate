import { useState } from "react";

import { Button, Modal, Form, Input, Table, message, Popconfirm } from "antd";

import { UserOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@ant-design/icons";
import { BiEdit } from "react-icons/bi";

import CustomSelect from "../CustomSelect/CustomSelect";

import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "../../axios/axiosInstance";

const AreasTable = () => {
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
    category: "",
    areaId: "",
  });

  const confirm = (e) => {
    message.success("Click on Yes");
  };
  const cancel = (e) => {};

  const { name, category, areaId } = formFields;

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

  const fetchAreas = async (pageNum) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/areas", {
        params: {
          pageNum: pageNum,
        },
      });
      if (response) {
        setTotalPages(response.data.meta.totalPages);
        setRecordsPerPage(response.data.meta.recordsPerPage);
        console.log({ totalPages });
        return response.data;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const { data, status, error } = useQuery(["areas"], () => fetchAreas(1));

  console.log(data);

  if (status === "error") {
    console.log(error);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.patch(`/areas/${areaId}`, {
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
    setformFields({ name: "", category: "", areaId: "" });
    form.resetFields();
  }

  const columns = [
    {
      title: "Area Name",
      dataIndex: "name",
      key: "name",
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return (
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.status).toLowerCase().includes(value.toLowerCase()) ||
          String(record.category).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filteredValue: [searchText],
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
                  areaId: value?.id,
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
        title="EDIT AREA"
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
              placeholder="Enter Area name"
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <CustomSelect
              mode="single"
              value={category}
              placeholder="Select category"
              options={options}
              onChange={(e) => setformFields({ ...formFields, category: e })}
              style={{
                width: "100%",
              }}
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
            fetchAreas(pageNum);
          },
        }}
        style={{ width: "100%" }}
        rowKey="id"
        columns={columns}
      ></Table>
    </>
  );
};
export default AreasTable;
