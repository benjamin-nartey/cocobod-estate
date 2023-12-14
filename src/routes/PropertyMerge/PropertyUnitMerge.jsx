import { Button, Form, Input, Select, Spin, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { capitalize } from '../../utils/typography';
import { useSnapshot } from 'valtio';
import state from '../../store/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mergePropertyToPropertyUnit } from '../../http/properties';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetPaginatedData } from '../../Hooks/query/generics';
import { getPagionatedPropertyUnitReferenceList } from '../../http/propertiesMerge';
import { CRUDTYPES } from '../../store/modalSlice';
import { useGetReferences } from '../../Hooks/query/properties';

const PropertyUnitMerge = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedRowsInTable, setSelectedRowsInTable] = useState([]);

  const snap = useSnapshot(state);

  const { addedProperty } = snap.mergeSlice;
  const { data: references, isLoading: referenceLoading } = useGetReferences({
    regionFilter: addedProperty?.district.region?.id,
  });
  const { crudType } = snap.modalSlice;

  console.log(addedProperty);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!referenceLoading && references?.data?.length) {
      const _data =
        references &&
        references?.data?.map((rec) => ({
          ...rec,
          key: rec?.id,
        }));

      setData(_data);

      console.log({ references: references?.data });

      const records =
        references &&
        references?.data
          ?.filter(
            (record) =>
              record.propertyReferenceCategory?.id === addedProperty?.id
          )

          .map((r) => r.id);

      if (records && crudType === CRUDTYPES.EDIT) {
        setSelectedRowsInTable(records);
      }
    }
  }, [references?.data?.length, referenceLoading]);

  const rowSelection = {
    selectedRowKeys: selectedRowsInTable,
    onChange: (selectedRowKeys, selectedRows) => {
      const changedRows = selectedRows.map((row) => row.key);
      setSelectedRowsInTable(changedRows);
      // setSelectedRowsInTable(selectedRows.map((row) => row.key));
    },
    getCheckboxProps: (record) =>
      crudType === CRUDTYPES.ADD
        ? {
            disabled: record.propertyReferenceCategory !== null,

            // Column configuration not to be checked
            name: record.lot,
          }
        : {
            disabled:
              record.propertyReferenceCategory !== null &&
              record.propertyReferenceCategory?.id !== addedProperty?.id,
          },
  };

  const { mutate, isLoading } = useMutation({
    mutationKey: 'mergePropertiesToPropertyUnits',
    mutationFn: () => {
      return mergePropertyToPropertyUnit({
        propertyId: addedProperty?.id,
        name: addedProperty?.name,
        regionId: addedProperty?.region?.id,
        propertyReferenceIds: Array.from(new Set(selectedRowsInTable)),
        propertyTypeId: addedProperty?.propertyType?.id,
      });
    },
    onSuccess: (result) => {
      message.success('Properties merged successfully');
      // state.mergeSlice.selectedRowsInTable = [];

      setSelectedRowsInTable([]);
      queryClient.invalidateQueries({
        queryKey: ['getPropertyUnitReferences'],
      });
      state.modalSlice.crudType = CRUDTYPES.RESET;
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
      title: 'Category',
      dataIndex: ['propertyType', 'name'],
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

  return !referenceLoading ? (
    <div className="flex flex-col gap-0">
      <Input.Search
        placeholder="Search records..."
        onSearch={(value) => setSearchText(value)}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <Table
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        isLoading={referenceLoading}
        // pagination={{
        //   pageSize: paginatedData?.pageSize,
        //   total: paginatedData?.total,
        // }}
        // onChange={(pagination) => setPageNum(pagination.current)}
        rowClassName={(record) =>
          record.propertyReferenceCategory !== null &&
          record.propertyReferenceCategory?.id !== addedProperty?.id
            ? 'line-through'
            : ''
        }
      />
      <Button className="mt-10 " onClick={submitData} loading={isLoading}>
        Submit
      </Button>
    </div>
  ) : (
    <Spin />
  );
};

export default PropertyUnitMerge;
