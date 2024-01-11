import { Button, Input, Table } from 'antd';
import React, { useState } from 'react';
import { useGetPaginatedData } from '../../Hooks/query/generics';
import { getPagionatedPropertyUnitReferenceList } from '../../http/propertiesMerge';
import state from '../../store/store';
import { capitalize } from '../../utils/typography';
import { useSnapshot } from 'valtio';

import { useParams } from 'react-router-dom';

const PropertyMergeDetail = () => {
  const [pageNum, setPageNum] = useState(1);
  const [searchText, setSearchText] = useState('');
  const { id } = useParams();
  const [paginatedData, props] = useGetPaginatedData(
    'properReferenceList',
    '',
    { pageNum, propertyReferenceCategoryFilter: id },
    getPagionatedPropertyUnitReferenceList
  );

  const data = props.data?.data?.records?.map((rec) => ({
    ...rec,
    key: rec?.id,
  }));
  const columns = [
    {
      title: 'Lot#',
      dataIndex: 'lot',
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return (
          String(record.locationOrTown)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.description)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.lot).toLowerCase().includes(value.toLowerCase()) ||
          String(record.plotSize).toLowerCase().includes(value.toLowerCase()) ||
          String(record.floorArea)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.propertyType.name)
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      },
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Town',
      dataIndex: 'locationOrTown',
      render: (value) => <span>{capitalize(value.toLowerCase())}</span>,
    },
    {
      title: 'Region',
      dataIndex: ['region', 'name'],
      render: (value) => <span>{capitalize(value.toLowerCase())}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      render: (value) => <span>{capitalize(value.toLowerCase())}</span>,
    },
    {
      title: 'Category/Class Asset',
      dataIndex: ['propertyType', 'name'],
      render: (value) => <span>{capitalize(value.toLowerCase())}</span>,
    },
    {
      title: 'Plot Size',
      dataIndex: 'plotSize',
    },
    {
      title: 'Floor Area',
      dataIndex: 'floorArea',
    },
    {
      title: 'Market Value',
      dataIndex: 'marketValue',
    },
    {
      title: 'Current Useful Life',
      dataIndex: 'currentUsefulLife',
    },
  ];

  return (
    <div className="w-[90%] mt-5 mx-auto">
      <h3 className="font-semibold mb-10 text-slate-500">
        {data && data[0]?.propertyReferenceCategory?.name?.toUpperCase()}
      </h3>
      <Input.Search
        placeholder="Search records..."
        onSearch={(value) => setSearchText(value)}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <Table
        columns={columns}
        loading={props?.isLoading || props?.isFetching}
        dataSource={data}
        pagination={{
          pageSize: paginatedData?.pageSize,
          total: paginatedData?.total,
        }}
        onChange={(pagination) => {
          setPageNum(pagination.current);
        }}
      />
    </div>
  );
};

export default PropertyMergeDetail;
