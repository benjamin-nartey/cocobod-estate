import { Input, Table } from 'antd';
import React, { useState } from 'react';
import { HiOutlineEye } from 'react-icons/hi';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetPaginatedData } from '../../Hooks/query/generics';
import { getModerationPopertyUnitList } from '../../http/moderation';
import state from '../../store/store';

const ModerationPopertyUnitList = () => {
  const { propertyId } = useParams();
  const [pageNum, setPageNum] = useState(1);
  const navigate = useNavigate();

  const [paginatedData, props] = useGetPaginatedData(
    'moderationPopertyUnitList',
    propertyId,
    { pageNum },
    getModerationPopertyUnitList
  );

  const _data = props.data?.data?.records?.map((rec) => ({
    ...rec,
    key: rec?.id,
  }));

  const columns = [
    {
      title: 'Property Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      render: (value, record) => {
        return (
          <HiOutlineEye
            size={22}
            className="text-sky-400 cursor-pointer"
            onClick={() => {
              state.modalSlice.selectedRecord = record;
              navigate(`/moderation/properties/review/${value}`);
            }}
          />
        );
      },
    },
  ];

  return (
    <div className="w-[90%] mx-auto mt-8 flex flex-col  gap-3">
      <h3 className="font-semibold text-slate-500">PROPERTY UNITS</h3>
      <div className="flex flex-col">
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
          onChange={(pagination) => {
            setPageNum(pagination.current);
          }}
          loading={props?.isLoading || props?.isFetching}
        />
      </div>
    </div>
  );
};

export default ModerationPopertyUnitList;
