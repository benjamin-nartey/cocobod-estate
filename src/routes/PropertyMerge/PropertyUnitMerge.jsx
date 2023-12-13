import { Button, Form, Input, Select, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { capitalize } from '../../utils/typography';
import { useSnapshot } from 'valtio';
import state from '../../store/store';
import { useMutation } from '@tanstack/react-query';
import { mergePropertyToPropertyUnit } from '../../http/properties';
import { useNavigate } from 'react-router-dom';
import { useGetPaginatedData } from '../../Hooks/query/generics';
import { getPagionatedPropertyUnitReferenceList } from '../../http/propertiesMerge';
import { CRUDTYPES } from '../../store/modalSlice';

const PropertyUnitMerge = () => {
  const [selectedRowsInTable, setSelectedRowsInTable] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const navigate = useNavigate();

  const snap = useSnapshot(state);

  const { addedProperty } = snap.mergeSlice;

  let data = [];

  const [paginatedData, props] = useGetPaginatedData(
    'properReferenceList',
    '',
    { pageNum, regionFilter: addedProperty?.region?.id },
    getPagionatedPropertyUnitReferenceList
  );

  data = props.data?.data?.records?.map((rec) => ({
    ...rec,
    key: rec?.id,
  }));

  useEffect(() => {
    const records = props.data?.data?.records
      ?.filter((record) => record.propertyReferenceCategory !== null)
      .map((r) => r.id);

    setSelectedRowsInTable(records);
  }, [props.data?.data?.records]);

  const rowSelection = {
    selectedRowKeys: selectedRowsInTable,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowsInTable(selectedRows.map((row) => row.key));
    },
  };

  const { mutate, isLoading } = useMutation({
    mutationKey: 'mergePropertiesToPropertyUnits',
    mutationFn: () => {
      return mergePropertyToPropertyUnit({
        propertyId: addedProperty?.id,
        name: addedProperty?.name,
        regionId: addedProperty?.region?.id,
        propertyReferenceIds: selectedRowsInTable,
        propertyTypeId: addedProperty?.propertyType?.id,
      });
    },
    onSuccess: (result) => {
      message.success('Properties merged successfully');
      navigate('/merge');
    },

    onError: (error) => {
      message.error(error?.response?.data?.message);
    },
  });

  const submitData = () => {
    mutate();
  };

  const columns = [
    {
      title: 'Lot#',
      dataIndex: 'lot',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Location/Town',
      dataIndex: 'locationOrTown',
      render: (value) => <p>{capitalize(value.toLowerCase())}</p>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      render: (value) => <p>{capitalize(value.toLowerCase())}</p>,
    },
    {
      title: 'PlotSize',
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
    <div className="flex flex-col gap-0">
      <Input.Search
        placeholder="Search records..."
        // onSearch={(value) => setSearchText(value)}
        // onChange={(e) => setSearchText(e.target.value)}
      />
      <Table
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: paginatedData?.pageSize,
          total: paginatedData?.total,
        }}
        onChange={(pagination) => setPageNum(pagination.current)}
      />
      <Button className="mt-10" onClick={submitData} loading={isLoading}>
        Submit
      </Button>
    </div>
  );
};

export default PropertyUnitMerge;
