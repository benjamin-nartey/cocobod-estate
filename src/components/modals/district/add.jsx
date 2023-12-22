import { Button, Form, Input, Modal, Select, message } from 'antd';
import React from 'react';
import { useSnapshot } from 'valtio';
import state from '../../../store/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addDistrict, updateDistrict } from '../../../http/district';
import { useGetRegions } from '../../../Hooks/query/regions';
import { CRUDTYPES } from '../../../store/modalSlice';

const AddDistrict = () => {
  const snap = useSnapshot(state);
  const { showAddDistrictModal, selectedRecord, crudType } = snap.modalSlice;

  const { data } = useGetRegions();

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationKey: 'addDistrict',
    mutationFn: (data) => {
      return addDistrict(data);
    },

    onSuccess: (data) => {
      state.modalSlice.toggleShowAddDistrictModal();
      queryClient.invalidateQueries({ queryKey: 'district' });
      state.modalSlice.crudType === CRUDTYPES.RESET;
      message.success('District added successfully');
    },
    onError: () => {
      message.error(e.message);
    },
  });
  const { mutate: updateDistrictFn, isLoading: isLoadingBool } = useMutation({
    mutationKey: 'updateDistrict',
    mutationFn: (data) => {
      return updateDistrict(selectedRecord?.id, data);
    },

    onSuccess: (data) => {
      state.modalSlice.toggleShowAddDistrictModal();
      state.modalSlice.crudType === CRUDTYPES.RESET;
      queryClient.invalidateQueries({ queryKey: 'district' });
      message.success('District updated successfully');
    },
    onError: () => {
      message.error(e.message);
    },
  });

  const handleSubmit = (values) => {
    console.log(values);
    crudType === CRUDTYPES.ADD ? mutate(values) : updateDistrictFn(values);
  };

  const initialValues =
    crudType === CRUDTYPES.EDIT
      ? {
          regionId: selectedRecord?.region?.id,
          name: selectedRecord?.name,
        }
      : {};

  return (
    <div>
      <Modal
        title={'ADD DISTRICT'}
        open={showAddDistrictModal}
        onCancel={() => state.modalSlice.toggleShowAddDistrictModal()}
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

export default AddDistrict;
