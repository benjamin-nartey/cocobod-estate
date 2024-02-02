import { Button, Input, Table } from 'antd';
import React, { useState } from 'react';
import { useGetPaginatedData } from '../../Hooks/query/generics';
import { getPagionatedPropertyUnitReferenceList } from '../../http/propertiesMerge';
import state from '../../store/store';
import { capitalize } from '../../utils/typography';
import { useSnapshot } from 'valtio';

import UploadCSV from '../../components/modals/uploads/uploadCsv';
import { useGetUnMergedReferences } from '../../Hooks/query/properties';

const PropertyReferences = () => {
  const {
    data: unMergedReferences,
    isLoading,
    isFetching,
  } = useGetUnMergedReferences({
    propertyUnitRelationStatusFilter: 'unlinked',
  });

  const [searchText, setSearchText] = useState('');

  const snap = useSnapshot(state);
  const { showUploadModal } = snap.modalSlice;

  const data = unMergedReferences?.data?.map((ref) => ({
    ...ref,
    key: ref?.id,
  }));

  const columns = [
    {
      title: 'lot',
      width: '7%',
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
    },
    {
      title: 'Town',
      dataIndex: 'locationOrTown',
      render: (value) => (
        <span>{value && capitalize(value?.toLowerCase())}</span>
      ),
    },
    {
      title: 'Region',
      dataIndex: ['region', 'name'],
      render: (value) => (
        <span>{value && capitalize(value?.toLowerCase())}</span>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      render: (value) => (
        <span>{value && capitalize(value?.toLowerCase())}</span>
      ),
    },
    {
      title: 'Category/Class Asset',
      dataIndex: ['propertyType', 'name'],
      render: (value) => (
        <span>{value && capitalize(value?.toLowerCase())}</span>
      ),
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
      <Input.Search
        placeholder="Search records..."
        onSearch={(value) => setSearchText(value)}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <Table
        columns={columns}
        loading={isLoading || isFetching}
        dataSource={data}
      />
    </div>
  );
};

export default PropertyReferences;
