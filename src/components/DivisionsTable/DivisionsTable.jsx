import React, { useEffect, useState } from 'react';

import { Button, Modal, Form, Input, message, Popconfirm, Table } from 'antd';

import { DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { BiEdit } from 'react-icons/bi';

import CustomSelect from '../CustomSelect/CustomSelect';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { axiosInstance } from '../../axios/axiosInstance';
import { useDeleteDivision } from '../../Hooks/useAddFetch';

const DivisionsTable = () => {
  const [pageNum, setPageNum] = useState(1);
  const [options, setOptions] = useState([]);

  const [open, setOpen] = useState(false);
  const [recordsPerPage, setRecordsPerPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [formFields, setformFields] = useState({
    name: '',
    divisionIds: [],
    id: '',
  });

  const queryClient = useQueryClient();

  const confirm = (id, name) => {
    deleteDivision(id, {
      onSuccess: () => message.success(`${name} deleted successfully`),
      onError: () => message.error(error?.message),
    });
  };
  const cancel = (e) => {};

  const { name, divisionIds, id } = formFields;

  const showModal = () => {
    setOpen(true);
  };

  const { mutate: deleteDivision } = useDeleteDivision();

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const success = (content) => {
    messageApi.open({
      type: 'success',
      content: content,
    });
  };

  const errorMessage = (content) => {
    messageApi.open({
      type: 'error',
      content: content,
    });
  };

  const handleOk = () => {
    //an empty function to keep the modal working
  };

  const fetchDivisions = async (pageNum) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/divisions', {
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

  const { data, status, error } = useQuery(['divisions'], () =>
    fetchDivisions(1)
  );

  console.log(data);

  if (status === 'error') {
    console.log(error);
  }

  // async function fetchDivisionsForPatch(pageNum) {
  //   const response = await axiosInstance.get("/divisions", {
  //     params: {
  //       pageNum: pageNum,
  //     },
  //   });

  //   const data = await response.data;

  //   const dataRcord = await data.records.map((record) => {
  //     return {
  //       label: `${record.name}`,
  //       value: record.id,
  //     };
  //   });
  //   setOptions(dataRcord);
  // }

  // useEffect(() => {
  //   fetchDivisionsForPatch(pageNum);
  // }, []);

  const handleSubmit = async (values) => {
    try {
      const response = await axiosInstance.patch(`/divisions/${id}`, {
        name: values?.name,
      });

      if (response) {
        success('division updated successfuly');

        queryClient.invalidateQueries('divisions');
        clearInput();
        handleCancel();
      }
    } catch (error) {
      errorMessage('Error updating division');
      throw new Error(`Error updating division ${error}`);
    }
  };

  function clearInput() {
    form.resetFields();
  }

  const columns = [
    {
      title: 'Division Name',
      dataIndex: 'name',
      key: 'name',
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return (
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.status).toLowerCase().includes(value.toLowerCase()) ||
          String(record.division.name)
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      },
    },
    {
      title: ' Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'action',
      render: (value) => {
        return (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                form.setFieldsValue({
                  name: value?.name,
                });
                setformFields({
                  ...formFields,
                  name: value?.name,
                  id: value?.id,
                });
                console.log(value);
                showModal();
              }}
            >
              <BiEdit size={22} className="cursor-pointer text-gray-600" />
            </button>
            {/* <Popconfirm
              title="Delete Division"
              description="Are you sure to delete this Division?"
              onConfirm={() => confirm(value?.id, value?.name)}
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
            </Popconfirm> */}
          </div>
        );
      },
    },
    // {
    //   title: "Action",
    //   dataIndex: "",
    //   key: "action",
    //   render: (value) => {
    //     return (
    //       <div className="flex items-center justify-center gap-4">
    //         <button
    //           onClick={(e) => {
    //             setformFields({
    //               ...formFields,
    //               name: value?.name,
    //               id: value?.id,
    //             });
    //             console.log(value);
    //             showModal();
    //           }}
    //         >
    //           <BiEdit size={22} className="cursor-pointer text-gray-600" />
    //         </button>
    //         <Popconfirm
    //           title="Delete the task"
    //           description="Are you sure to delete this task?"
    //           onConfirm={confirm}
    //           onCancel={cancel}
    //           okText="Yes"
    //           cancelText="No"
    //         >
    //           <span className="grid place-items-center">
    //             <DeleteOutlined
    //               style={{
    //                 fontSize: "18px",
    //                 color: " #FF6A74",
    //                 cursor: "pointer",
    //               }}
    //             />
    //           </span>
    //         </Popconfirm>
    //       </div>
    //     );
    //   },
    // },
  ];

  console.log(formFields);

  return (
    <>
      {contextHolder}
      <Modal
        title="EDIT DIVISION"
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
          onFinish={(values) => handleSubmit(values)}
          name="divisionEdit"
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
              placeholder="Enter name"
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item label=" ">
            <Button
              className="w-full"
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: '#6E431D', color: '#fff' }}
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
        loading={status === 'loading' || loading}
        pagination={{
          pageSize: recordsPerPage,
          total: totalPages,
          onChange: (pageNum) => {
            fetchDivisions(pageNum);
          },
        }}
        style={{ width: '100%' }}
        rowKey="id"
        columns={columns}
      ></Table>
    </>
  );
};
export default DivisionsTable;
