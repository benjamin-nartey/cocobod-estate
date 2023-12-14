import { Button, Input, Table } from 'antd';
import React, { useState } from 'react';
import { useGetPaginatedData } from '../../Hooks/query/generics';
import { getPagionatedPropertyUnitReferenceList } from '../../http/propertiesMerge';
import state from '../../store/store';
import { capitalize } from '../../utils/typography';
import { useSnapshot } from 'valtio';
import ReferencesUpload from '../../components/modals/uploads/references';
import { useGetReferences } from '../../Hooks/query/properties';

const columns = [
  {
    title: 'lot',
    dataIndex: 'lot',
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

const PropertyReferences = () => {
  const [pageNum, setPageNum] = useState(1);
  const [paginatedData, props] = useGetPaginatedData(
    'properReferenceList',
    '',
    { pageNum },
    getPagionatedPropertyUnitReferenceList
  );

  const snap = useSnapshot(state);
  const { showReferencesUploadModal } = snap.modalSlice;

  const data = props.data?.data?.records?.map((rec) => ({
    ...rec,
    key: rec?.id,
  }));

  return (
    <div className="w-[90%] mt-5 mx-auto">
      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          onClick={() => {
            state.modalSlice.toggleshowReferencesUploadModal();
          }}
          style={{ backgroundColor: '#6E431D', color: '#fff' }}
        >
          Upload Properties
        </Button>
      </div>
      <Input.Search
        placeholder="Search records..."
        // onSearch={(value) => setSearchText(value)}
        // onChange={(e) => setSearchText(e.target.value)}
      />
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: paginatedData?.pageSize,
          total: paginatedData?.total,
        }}
        onChange={(pagination) => {
          setPageNum(pagination.current);
        }}
      />
      {showReferencesUploadModal && <ReferencesUpload />}
    </div>
  );
};

export default PropertyReferences;
