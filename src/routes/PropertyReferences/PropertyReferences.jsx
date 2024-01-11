import { Button, Input, Table } from 'antd';
import React, { useState } from 'react';
import { useGetPaginatedData } from '../../Hooks/query/generics';
import { getPagionatedPropertyUnitReferenceList } from '../../http/propertiesMerge';
import state from '../../store/store';
import { capitalize } from '../../utils/typography';
import { useSnapshot } from 'valtio';

import { useGetReferences } from '../../Hooks/query/properties';
import UploadCSV from '../../components/modals/uploads/uploadCsv';

const PropertyReferences = () => {
  const [pageNum, setPageNum] = useState(1);
  const [paginatedData, props] = useGetPaginatedData(
    'properReferenceList',
    '',
    { pageNum },
    getPagionatedPropertyUnitReferenceList
  );

  const [searchText, setSearchText] = useState('');

  const snap = useSnapshot(state);
  const { showUploadModal } = snap.modalSlice;

  const data = props.data?.data?.records?.map((rec) => ({
    ...rec,
    key: rec?.id,
  }));

  const columns = [
    {
      title: 'lot',
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
      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          onClick={() => {
            state.modalSlice.toggleshowUploadModal();
          }}
          style={{ backgroundColor: '#6E431D', color: '#fff' }}
        >
          Upload Properties
        </Button>
      </div>
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
      {showUploadModal && (
        <UploadCSV
          fieldName={'batch-property-reference'}
          uploadUrl={'/property-references/batch-upload'}
          queryKey={'properReferenceList'}
        />
      )}
    </div>
  );
};

export default PropertyReferences;
