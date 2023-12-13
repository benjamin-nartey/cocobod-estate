import { Input, Popconfirm, Table } from 'antd';
import React, { useState } from 'react';
import { BiEdit } from 'react-icons/bi';
import { useGetPaginatedData } from '../../Hooks/query/generics';
import { getPaginatedProperties } from '../../http/properties';
import { HiEye } from 'react-icons/hi';
import { useNavigate, useParams } from 'react-router-dom';
import { capitalize } from '../../utils/typography';
import state from '../../store/store';
import { useSnapshot } from 'valtio';
import EditModerationProperties from '../../components/modals/moderation/properties/edit';

const PropertiesMain = () => {
  const { regionId } = useParams();
  const [pageNum, setPageNum] = useState(1);
  const [paginatedData, props] = useGetPaginatedData(
    'getAllProperties',
    '',
    { pageNum, statusFilter: 'ACTIVE' },
    getPaginatedProperties //TODO change url
  );

  console.log(props.data?.data?.records);

  const navigate = useNavigate();

  const _data = props.data?.data?.records?.map((rec) => ({
    ...rec,
    key: rec?.id,
  }));

  const snap = useSnapshot(state);
  const { showEditPropertyModal } = snap.modalSlice;
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Property Description',
      dataIndex: 'description',
      render: (value) => {
        return <p>{capitalize(value.toLowerCase())}</p>;
      },
    },

    {
      title: 'Town',
      dataIndex: ['location', 'name'],
    },
    {
      title: 'Property Type',
      dataIndex: ['propertyType', 'name'],
    },

    {
      title: 'Digital Address',
      dataIndex: 'digitalAddress',
    },
    {
      title: 'Property Code',
      dataIndex: 'propertyCode',
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      render: (value, record) => {
        return (
          <div className="flex items-center gap-4">
            <HiEye
              className="text-blue-500 cursor-pointer"
              size={22}
              onClick={() => {
                state.modalSlice.selectedRecord = record;
                navigate(`/property-units-main`);
              }}
            />
            <BiEdit
              size={22}
              className="cursor-pointer text-gray-600"
              onClick={() => {
                state.modalSlice.selectedRecord = record;
                state.modalSlice.toggleshowEditPropertyModal();
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-[90%] mx-auto mt-8 flex flex-col  gap-3">
      <h3 className="font-semibold text-slate-500">PROPERTIES</h3>
      <div className="flex flex-col">
        <Input.Search placeholder="Search records..." />
        <Table
          loading={props?.isLoading}
          columns={columns}
          dataSource={_data}
          pagination={{
            pageSize: paginatedData.pageSize,
            total: paginatedData.total,
          }}
          onChange={(pagination) => {
            setPageNum(pagination.current);
          }}
        />
      </div>
      {showEditPropertyModal && <EditModerationProperties />}
    </div>
  );
};

export default PropertiesMain;
