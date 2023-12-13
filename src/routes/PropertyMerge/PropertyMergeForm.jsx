import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, Select, message } from 'antd';
import React from 'react';
import {
  addPropertyReferenceCategory,
  updatePropertyReferenceCategory,
} from '../../http/propertiesMerge';
import state from '../../store/store';
import { useGetRegions } from '../../Hooks/query/regions';
import { useSnapshot } from 'valtio';
import { CRUDTYPES } from '../../store/modalSlice';
import { useGetPropertyTypes } from '../../Hooks/query/propertyType';

const PropertyCreateForm = ({ move }) => {
  const { data } = useGetPropertyTypes();

  const { mutate, isLoading } = useMutation({
    mutationKey: 'saveProperty',
    mutationFn: (data) => {
      return addPropertyReferenceCategory(data);
    },
    onSuccess: (data) => {
      state.mergeSlice.addedProperty = data?.data;
      message.success('Property added successfully');
      move();
    },
    onError: (e) => {
      message.error(e.response.data.message);
    },
  });

  const { mutate: updateReferenceFn, isLoading: updateLoading } = useMutation({
    mutationKey: 'updatePropertyFn',
    mutationFn: (data) => {
      return updatePropertyReferenceCategory(selectedRecord?.id, { ...data });
    },
    onSuccess: (data) => {
      console.log({ data });
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
          regionId: selectedRecord?.region?.id,
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
            placeholder={'Select Region'}
            options={regions?.data.map((reg) => ({
              label: reg.name,
              value: reg.id,
            }))}
          />
        </Form.Item>
        <Button htmlType="submit" className="w-full" loading={isLoading}>
          <span>
            {crudType === CRUDTYPES.ADD ? `Save & Next` : 'Update & Next'}
          </span>
        </Button>
      </Form>
    </div>
  );
};

export default PropertyCreateForm;
