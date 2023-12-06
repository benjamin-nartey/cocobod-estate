import { Button, Form, Modal, Select, message } from 'antd';
import React from 'react';
import { useSnapshot } from 'valtio';
import state from '../../../store/store';
import { useGetAllDeployments } from '../../../Hooks/query/deployment';
import { useGetRegions } from '../../../Hooks/query/regions';
import { useGetEnumeartors } from '../../../Hooks/query/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addAllocation, updateAllocation } from '../../../http/deployment';
import { CRUDTYPES } from '../../../store/modalSlice';

const AddDeploymentModal = () => {
  const snap = useSnapshot(state);
  const {
    showAddDeploymentModal,
    toggleAddDeploymentAddModal,
    crudType,
    selectedRecord,
  } = snap.modalSlice;

  const { data: deployment } = useGetAllDeployments();
  const { data: regions } = useGetRegions();
  const { data: enumerators } = useGetEnumeartors();

  const _data =
    deployment && deployment?.data?.filter((d) => d.completed === false);

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: 'makeAllocation',
    mutationFn: (data) => {
      return addAllocation(data);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: 'allocations' });
      state.modalSlice.crudType = CRUDTYPES.RESET;
      state.modalSlice.toggleAddDeploymentModal();
      message.success('Staff alloocated successfully');
    },

    onError: (err) => {
      message.error(err.response.data.message);
    },
  });
  const { mutate: updateAllocationFn } = useMutation({
    mutationKey: 'updateAllocation',
    mutationFn: (data) => {
      return updateAllocation(selectedRecord?.id, data);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: 'allocations' });
      state.modalSlice.crudType = CRUDTYPES.RESET;
      state.modalSlice.toggleAddDeploymentModal();
      message.success('Staff allocation updated successfully');
    },

    onError: (err) => {
      message.error(err.response.data.message);
    },
  });

  const handleSubmit = (values) => {
    crudType === CRUDTYPES.ADD ? mutate(values) : updateAllocationFn(values);
  };

  const initialValues =
    crudType === CRUDTYPES.EDIT
      ? {
          deploymentId: selectedRecord?.deploymentId,
          regionId: selectedRecord?.region?.id,
          staffId: selectedRecord?.staff?.map((st) => st?.id),
        }
      : {};

  return (
    <div>
      <Modal
        title={'DEPLOY STAFF'}
        open={showAddDeploymentModal}
        onCancel={() => state.modalSlice.toggleAddDeploymentModal()}
        footer={false}
        maskClosable={false}
      >
        <div className="mt-9">
          <Form
            layout="vertical"
            name="deployment"
            onFinish={(values) => {
              handleSubmit(values);
            }}
            initialValues={initialValues}
          >
            <Form.Item
              name="deploymentId"
              label={'Deployment'}
              rules={[{ required: true }]}
            >
              <Select
                disabled={crudType === CRUDTYPES.EDIT}
                showSearch
                optionFilterProp={'label'}
                placeholder={'Select Deployment'}
                options={
                  _data &&
                  _data?.map((dat) => ({
                    label: dat.name,
                    value: dat.id,
                  }))
                }
              />
            </Form.Item>

            <Form.Item
              name={'regionId'}
              label={'Region'}
              rules={[{ required: true }]}
            >
              <Select
                showSearch={true}
                optionFilterProp={'label'}
                options={regions?.data?.map((region) => ({
                  label: region.name,
                  value: region.id,
                }))}
              />
            </Form.Item>
            <Form.Item
              name={'staffId'}
              label={'Staff'}
              rules={[{ required: true }]}
            >
              <Select
                mode="multiple"
                showSearch={true}
                optionFilterProp={'label'}
                options={enumerators?.data.map((en) => ({
                  label: en.name,
                  value: en.staff.id,
                }))}
              />
            </Form.Item>
            <Button
              htmlType="submit"
              style={{
                backgroundColor: '#6E431D',
                color: '#fff',
                width: '100%',
              }}
            >
              Submit
            </Button>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default AddDeploymentModal;
