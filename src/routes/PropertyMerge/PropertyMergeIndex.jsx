import React, { useState } from 'react';
import { useGetPaginatedData } from '../../Hooks/query/generics';
import { Button, Input, Popconfirm, Table } from 'antd';
import { getPaginatedPropertyReferenceCategory } from '../../http/propertiesMerge';
import { useNavigate } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { BiEdit } from 'react-icons/bi';
import state from '../../store/store';
import { CRUDTYPES } from '../../store/modalSlice';

const PropertyMergeIndex = () => {
  const [pageNum, setPageNum] = useState(1);

  const [paginatedData, props] = useGetPaginatedData(
    'propertyReferenceCategory',
    '',
    { pageNum },
    getPaginatedPropertyReferenceCategory
  );
  const navigate = useNavigate();
  const _data = props.data?.data?.records?.map((rec) => ({
    ...rec,
    key: rec?.id,
  }));

  const columns = [
    {
      title: 'Property',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: 'Region',
      key: 'region',
      dataIndex: ['region', 'name'],
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      render: (value, record) => {
        return (
          <div className="flex items-center gap-4">
            <BiEdit
              size={22}
              className="cursor-pointer text-gray-600"
              onClick={() => {
                navigate('/merge/create');
                state.modalSlice.crudType = CRUDTYPES.EDIT;
                state.modalSlice.selectedRecord = record;
                //Show only property units page for merge
              }}
            />

            <Popconfirm
              title="Delete"
              description="Are you sure to delete this?. Operation is irreversible"
              onConfirm={() => {}}
              onCancel={() => {}}
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
    <div className="w-[90%] mx-auto mt-4">
      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          onClick={() => {
            state.modalSlice.crudType = CRUDTYPES.ADD;

            navigate('/merge/create');
          }}
          style={{ backgroundColor: '#6E431D', color: '#fff' }}
        >
          Add Property Parent
        </Button>
      </div>
      <Input.Search
        placeholder="Search records..."
        // onSearch={(value) => setSearchText(value)}
        // onChange={(e) => setSearchText(e.target.value)}
      />
      <Table
        dataSource={_data}
        columns={columns}
        pagination={{
          pageSize: paginatedData?.pageSize,
          total: paginatedData?.total,
        }}
        onChange={(pagination) => setPageNum(pagination.current)}
      />
    </div>
  );
};

export default PropertyMergeIndex;
