import { Button, Form, Input, Modal, Select, message } from 'antd';
import React from 'react';
import { useSnapshot } from 'valtio';
import state from '../../../store/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addDistrict, updateDistrict } from '../../../http/district';
import { useGetRegions } from '../../../Hooks/query/regions';
import { CRUDTYPES } from '../../../store/modalSlice';
import { useGetPoliticalRegions } from '../../../Hooks/query/politicalRegions';
import {
  addPoliticalDistrict,
  updatePoliticalDistrict,
} from '../../../http/politicalDistrict';

const AddPoliticalDistrict = () => {
  const snap = useSnapshot(state);
  const { showPoliticalDistrictModal, selectedRecord, crudType } =
    snap.modalSlice;

  const { data } = useGetPoliticalRegions();

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationKey: 'addPoliticalDistrict',
    mutationFn: (data) => {
      return addPoliticalDistrict(data);
    },

    onSuccess: (data) => {
      state.modalSlice.toggleshowPoliticalDistrictModal();
      queryClient.invalidateQueries({ queryKey: 'politicalDistricts' });
      state.modalSlice.crudType === CRUDTYPES.RESET;
      message.success('Political District added successfully');
    },
    onError: () => {
      message.error(e.message);
    },
  });
  const { mutate: updateDistrictFn, isLoading: isLoadingBool } = useMutation({
    mutationKey: 'updatePoliticalDistrict',
    mutationFn: (data) => {
      return updatePoliticalDistrict(selectedRecord?.id, data);
    },

    onSuccess: (data) => {
      state.modalSlice.toggleshowPoliticalDistrictModal();
      state.modalSlice.crudType === CRUDTYPES.RESET;
      queryClient.invalidateQueries({ queryKey: 'politicalDistrict' });
      message.success('Political District updated successfully');
    },
    onError: () => {
      message.error(e.message);
    },
  });

  const handleSubmit = (values) => {
    crudType === CRUDTYPES.ADD ? mutate(values) : updateDistrictFn(values);
  };

  const initialValues =
    crudType === CRUDTYPES.EDIT
      ? {
          politicalRegionId: selectedRecord?.politicalRegion?.id,
          name: selectedRecord?.name,
        }
      : {};

  return (
    <div>
      <Modal
        title={'ADD POLITICAL DISTRICT'}
        open={showPoliticalDistrictModal}
        onCancel={() => state.modalSlice.toggleshowPoliticalDistrictModal()}
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
              label={'Political Region'}
              name={'politicalRegionId'}
              rules={[{ required: true }]}
            >
              <Select
                options={data?.data.map((dat) => ({
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

export default AddPoliticalDistrict;
