import { Button, Form, Input, Modal, Select, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import state from '../../../store/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CRUDTYPES } from '../../../store/modalSlice';
import { addLocation, updateLocation } from '../../../http/location';
import { useGetDistricts } from '../../../Hooks/query/district';
import {
  useGetDistrictByRegionId,
  useGetRegions,
} from '../../../Hooks/query/regions';

const AddLocation = () => {
  const snap = useSnapshot(state);
  const [selectedRegionId, setSelectedRegionId] = useState('');
  const [selectedDistrictId, setSelectedDistrictId] = useState('');
  const { showLocationModal, selectedRecord, crudType } = snap.modalSlice;

  const { data: regions } = useGetRegions();

  const { data: district, refetch: fetchDistricts } =
    useGetDistrictByRegionId(selectedRegionId);

  useEffect(() => {
    fetchDistricts();
  }, [selectedRegionId]);

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationKey: 'addLocation',
    mutationFn: (data) => {
      return addLocation(data);
    },

    onSuccess: (data) => {
      state.modalSlice.toggleshowLocationModal();
      queryClient.invalidateQueries({ queryKey: 'location' });
      state.modalSlice.crudType === CRUDTYPES.RESET;
      message.success('Location added successfully');
    },
    onError: () => {
      message.error(e.message);
    },
  });
  const { mutate: updateLocationFn, isLoading: isLoadingBool } = useMutation({
    mutationKey: 'updateLocation',
    mutationFn: (data) => {
      return updateLocation(selectedRecord?.id, data);
    },

    onSuccess: (data) => {
      state.modalSlice.toggleshowLocationModal();
      state.modalSlice.crudType === CRUDTYPES.RESET;
      queryClient.invalidateQueries({ queryKey: 'location' });
      message.success('Location updated successfully');
    },
    onError: () => {
      message.error(e.message);
    },
  });

  const handleSubmit = (values) => {
    crudType === CRUDTYPES.ADD ? mutate(values) : updateLocationFn(values);
  };

  const initialValues =
    crudType === CRUDTYPES.EDIT
      ? {
          regionId: selectedRecord?.district?.regionId,
          districtId: selectedRecord?.district?.id,
          name: selectedRecord?.name,
        }
      : {};

  return (
    <div>
      <Modal
        title={'ADD TOWN'}
        open={showLocationModal}
        onCancel={() => state.modalSlice.toggleshowLocationModal()}
        footer={false}
        maskClosable={false}
      >
        <div className="mt-9">
          <Form
            layout="vertical"
            onFinish={(values) => handleSubmit(values)}
            name="add-district-form"
            initialValues={initialValues}
          >
            <Form.Item
              label={'Region'}
              name={'regionId'}
              rules={[{ required: true }]}
            >
              <Select
                onChange={(value) => setSelectedRegionId(value)}
                options={regions?.data.map((dat) => ({
                  label: dat.name,
                  value: dat.id,
                }))}
              />
            </Form.Item>
            <Form.Item
              label={'District'}
              name={'districtId'}
              rules={[{ required: true }]}
            >
              <Select
                onChange={(value) => setSelectedDistrictId(value)}
                options={district?.data.map((dat) => ({
                  label: dat.name,
                  value: dat.id,
                }))}
              />
            </Form.Item>
            <Form.Item
              name={'name'}
              label={'Name'}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Button htmlType="submit" className="w-full" loading={isLoading}>
              Submit
            </Button>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default AddLocation;
