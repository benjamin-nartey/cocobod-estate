import { Button, Input, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useGetPaginatedData } from '../../Hooks/query/generics';
import { getPagionatedPropertyUnitReferenceList } from '../../http/propertiesMerge';
import state from '../../store/store';
import { capitalize } from '../../utils/typography';
import { useSnapshot } from 'valtio';

import { useGetReferences } from '../../Hooks/query/properties';
import UploadCSV from '../../components/modals/uploads/uploadCsv';
import { searchResource } from '../../http/search';
import * as debounce from 'lodash.debounce';

const PropertyReferences = () => {
  const [pageNum, setPageNum] = useState(1);
  const [paginatedData, props] = useGetPaginatedData(
    'properReferenceList',
    '',
    { pageNum },
    getPagionatedPropertyUnitReferenceList
  );

  const snap = useSnapshot(state);
  const { showUploadModal } = snap.modalSlice;

  const [_data, setData] = useState(null);
  const [pageInfo, setPageInfo] = useState({ pageSize: 0, total: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      props.data?.data?.records?.length ||
      paginatedData?.pageSize ||
      paginatedData?.total
    ) {
      setData(
        props.data?.data?.records?.map((rec) => ({
          ...rec,
          key: rec?.id,
        }))
      );
      setPageInfo({
        pageSize: paginatedData?.pageSize,
        total: paginatedData?.total,
      });
    }
  }, [
    props.data?.data?.records?.length,
    paginatedData?.pageSize,
    paginatedData?.total,
  ]);

  const handleSearch = useCallback(
    debounce(async (text) => {
      const result = await searchResource('/property-references', text);
      setData(
        result?.data?.records?.map((rec) => ({
          ...rec,
          key: rec?.id,
        }))
      );
      setPageInfo({
        pageSize: result?.data?.recordsPerPage,
        total: result?.data?.totalRecords,
      });
      setLoading(false);
    }, 1000),
    []
  );

  const handleChange = (e) => {
    const { value } = e.target;

    setLoading(true);
    handleSearch(value);
  };

  const columns = [
    {
      title: 'lot',
      width: '7%',
      dataIndex: 'lot',
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
      <Input.Search placeholder="Search records..." onChange={handleChange} />
      <Table
        columns={columns}
        loading={props?.isLoading || props?.isFetching || loading}
        dataSource={_data}
        pagination={{
          pageSize: pageInfo?.pageSize,
          total: pageInfo?.total,
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
