import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Form, Input, Select, message } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  addPropertyReferenceCategory,
  updatePropertyReferenceCategory,
} from '../../http/propertiesMerge';
import state from '../../store/store';
import { useGetRegions } from '../../Hooks/query/regions';
import { useSnapshot } from 'valtio';
import { CRUDTYPES } from '../../store/modalSlice';
import { useGetPropertyTypes } from '../../Hooks/query/propertyType';
import { getDistrictsByRegionId } from '../../http/district';
import { useGetLocationByDisrictId } from '../../Hooks/query/locations';
import { capitalize } from '../../utils/typography';

const PropertyCreateForm = ({ move }) => {
  const { data } = useGetPropertyTypes();
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);

  const { mutate, isLoading } = useMutation({
    mutationKey: 'saveProperty',
    mutationFn: (data) => {
      return addPropertyReferenceCategory(data);
    },
    onSuccess: (data) => {
      state.mergeSlice.addedProperty = data?.data;
      message.success('Property Pending Merge');
      move();
    },
    onError: (e) => {
      message.error(e.response.data.message);
    },
  });

  const {
    data: district,
    refetch: fetchDistricts,
    isLoading: DistrictLoading,
  } = useQuery({
    queryKey: ['getDistrictByRegionId'],
    queryFn: () => {
      return getDistrictsByRegionId(selectedRegionId);
    },
    enabled: false,
  });

  const {
    data: towns,
    refetch: fetchTownsByDistrictId,
    isLoading: isLoadingTowns,
  } = useGetLocationByDisrictId(selectedDistrictId);

  useEffect(() => {
    fetchTownsByDistrictId();
  }, [selectedDistrictId]);

  useEffect(() => {
    fetchDistricts();
  }, [selectedRegionId]);

  const { mutate: updateReferenceFn, isLoading: updateLoading } = useMutation({
    mutationKey: 'updatePropertyFn',
    mutationFn: (data) => {
      return updatePropertyReferenceCategory(selectedRecord?.id, { ...data });
    },
    onSuccess: (data) => {
      state.mergeSlice.addedProperty = data?.data;

      message.success('Property Pending Merge');
      move();
    },
    onError: (e) => {
      message.error(e.response.data.message);
    },
  });

  const { data: regions } = useGetRegions();

  const onSubmit = (values) => {
    crudType === CRUDTYPES.ADD ? mutate(values) : updateReferenceFn(values);
  };

  const snap = useSnapshot(state);
  const { selectedRecord, crudType } = snap.modalSlice;

  console.log(selectedRecord);

  const initialValues =
    crudType === CRUDTYPES.EDIT
      ? {
          name: selectedRecord?.name,
          regionId: selectedRecord?.location?.district?.region?.id,
          districtId: selectedRecord?.location?.district?.id,
          locationId: selectedRecord?.location?.id,
          propertyTypeId: selectedRecord?.propertyType?.id,
        }
      : {};

  return (
    <div>
      <Form
        name="property-create-form"
        layout="vertical"
        onFinish={(values) => onSubmit(values)}
        initialValues={initialValues}
      >
        <Form.Item label={'Name'} name={'name'} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name={'propertyTypeId'}
          label={'Category'}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            placeholder={'Select category'}
            showSearch
            optionFilterProp="label"
            options={data?.data.map((dat) => ({
              label: dat?.name,
              value: dat?.id,
            }))}
          />
        </Form.Item>
        <Form.Item
          name={'regionId'}
          label={'Region'}
          rules={[{ required: true }]}
        >
          <Select
            showSearch
            optionFilterProp="label"
            placeholder={'Select Region'}
            onChange={(value) => setSelectedRegionId(value)}
            options={regions?.data.map((reg) => ({
              label: reg.name,
              value: reg.id,
            }))}
          />
        </Form.Item>
        <Form.Item
          name={'districtId'}
          label={'District'}
          rules={[{ required: true }]}
        >
          <Select
            showSearch
            optionFilterProp="label"
            loading={DistrictLoading}
            onChange={(value) => setSelectedDistrictId(value)}
            placeholder={'Select District'}
            options={district?.data.map((dist) => ({
              label: dist && capitalize(dist?.name.toLowerCase()),
              value: dist.id,
            }))}
          />
        </Form.Item>
        <Form.Item
          name={'locationId'}
          label={'Location/Town'}
          rules={[{ required: true }]}
        >
          <Select
            showSearch
            optionFilterProp="label"
            loading={isLoadingTowns}
            placeholder={'Select Location/Town'}
            options={towns?.data.map((town) => ({
              label: town && capitalize(town?.name.toLowerCase()),
              value: town.id,
            }))}
          />
        </Form.Item>
        <Button
          htmlType="submit"
          className="w-full"
          loading={crudType === CRUDTYPES.EDIT ? updateLoading : isLoading}
        >
          <span>
            {crudType === CRUDTYPES.ADD ? `Save & Next` : 'Update & Next'}
          </span>
        </Button>
      </Form>
    </div>
  );
};

export default PropertyCreateForm;
