import { useState } from 'react';

import { Button, Modal, Form, Input, Table, message, Popconfirm } from 'antd';

import { UserOutlined } from '@ant-design/icons';
import { DeleteOutlined } from '@ant-design/icons';
import { BiEdit } from 'react-icons/bi';

import CustomSelect from '../CustomSelect/CustomSelect';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { axiosInstance } from '../../axios/axiosInstance';
import { useGetPaginatedDistricts } from '../../Hooks/query/district';
import { deleteRegion } from '../../http/regions';

const AreasTable = () => {
  const [pageNum, setPageNum] = useState(1);
  const [open, setOpen] = useState(false);
  const [recordsPerPage, setRecordsPerPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [formFields, setformFields] = useState({
    name: '',
    category: '',
    areaId: '',
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: 'deleteRegion',
    mutationFn: (id) => {
      return deleteRegion(id);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: 'district' });
      message.success('Region deleted successfully');
    },

    onError: (error) => {
      message.error(error.response.data.message);
    },
  });

  const confirm = (id) => {
    mutate(id);
  };
  const cancel = (e) => {};

  const { name, areaId } = formFields;

  const showModal = () => {
    setOpen(true);
  };

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

  const fetchRegions = async (pageNum) => {
    try {
      const response = await axiosInstance.get('/region', {
        params: {
          pageNum: pageNum,
        },
      });

      if (response) {
        setTotalPages(response.data.meta.totalRecords);
        setRecordsPerPage(response.data.meta.recordsPerPage);

        return response?.data;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const { data, status, error, isLoading, isFetching } = useQuery(
    ['regions', pageNum],
    () => fetchRegions(pageNum)
  );

  if (status === 'error') {
    console.log(error);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.patch(`/regions/${areaId}`, {
        name,
      });

      if (response) {
        success('Region updated successfully');

        clearInput();
        handleCancel();
      }
    } catch (error) {
      errorMessage('Error updating region');
      throw new Error(`Error updating region ${error}`);
    }
  };

  function clearInput() {
    setformFields({ name: '', category: '', areaId: '' });
    form.resetFields();
  }

  const columns = [
    {
      title: 'Area Name',
      dataIndex: 'name',
      key: 'name',
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
      title: 'Action',
      dataIndex: 'id',
      key: 'action',
      render: (value) => {
        return (
          <div className="flex items-center  gap-4">
            <button
              onClick={(e) => {
                setformFields({
                  ...formFields,
                  name: value?.name,
                  areaId: value?.id,
                });

                showModal();
              }}
            >
              <BiEdit size={22} className="cursor-pointer text-gray-600" />
            </button>
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              onConfirm={() => confirm(value)}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <span className="grid place-items-center">
                <DeleteOutlined
                  style={{
                    fontSize: '18px',
                    color: ' #FF6A74',
                    cursor: 'pointer',
                  }}
                />
              </span>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

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
            flex: '110px',
          }}
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
              defaultValue={name}
              onChange={(e) =>
                setformFields({ ...formFields, name: e.target.value })
              }
              placeholder="Enter Area name"
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
        loading={isLoading || isFetching}
        pagination={{
          pageSize: recordsPerPage,
          total: totalPages,
        }}
        style={{ width: '100%' }}
        rowKey="id"
        onChange={(pagination) => {
          setPageNum(pagination.current);
        }}
        columns={columns}
      ></Table>
    </>
  );
};
export default AreasTable;
