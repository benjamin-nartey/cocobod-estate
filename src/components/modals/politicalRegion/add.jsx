import { Button, Form, Input, Modal, Select, message } from 'antd';
import React from 'react';
import { useSnapshot } from 'valtio';
import state from '../../../store/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addDistrict, updateDistrict } from '../../../http/district';
import { useGetRegions } from '../../../Hooks/query/regions';
import { CRUDTYPES } from '../../../store/modalSlice';
import {
  addPoliticalRegion,
  updatePoliticalRegion,
} from '../../../http/politicalRegions';

const AddPoliticalRegion = () => {
  const snap = useSnapshot(state);
  const { showPoliticalRegionModal, selectedRecord, crudType } =
    snap.modalSlice;

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationKey: 'addPoliticalRegion',
    mutationFn: (data) => {
      return addPoliticalRegion(data);
    },

    onSuccess: (data) => {
      state.modalSlice.toggleshowPoliticalRegionModal();
      queryClient.invalidateQueries({ queryKey: 'politicalRegions' });
      state.modalSlice.crudType === CRUDTYPES.RESET;
      message.success('Political Region added successfully');
    },
    onError: () => {
      message.error(e.message);
    },
  });
  const { mutate: updatePoliticalRegionFn, isLoading: isLoadingBool } =
    useMutation({
      mutationKey: 'updatePoliticalRegion',
      mutationFn: (data) => {
        return updatePoliticalRegion(selectedRecord?.id, data);
      },

      onSuccess: (data) => {
        state.modalSlice.toggleshowPoliticalRegionModal();
        state.modalSlice.crudType === CRUDTYPES.RESET;
        queryClient.invalidateQueries({ queryKey: 'politicalRegions' });
        message.success('Political Region updated successfully');
      },
      onError: () => {
        message.error(e.message);
      },
    });

  const handleSubmit = (values) => {
    console.log(values);
    crudType === CRUDTYPES.ADD
      ? mutate(values)
      : updatePoliticalRegionFn(values);
  };

  const initialValues =
    crudType === CRUDTYPES.EDIT
      ? {
          name: selectedRecord?.name,
        }
      : {};

  return (
    <div>
      <Modal
        title={
          crudType === CRUDTYPES.ADD
            ? 'ADD POLITICAL REGION'
            : 'UPDATE POLITICAL REGION'
        }
        open={showPoliticalRegionModal}
        onCancel={() => state.modalSlice.toggleshowPoliticalRegionModal()}
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

export default AddPoliticalRegion;
