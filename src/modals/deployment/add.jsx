import { Button, Form, Modal, Select } from 'antd';
import React from 'react';
import { useSnapshot } from 'valtio';
import state from '../../store/store';

const AddDeploymentModal = () => {
  const snap = useSnapshot(state);
  const { showAddDeploymentModal, toggleAddDeploymentAddModal } =
    snap.modalSlice;

  console.log(showAddDeploymentModal);

  return (
    <div>
      <Modal
        title={'DEPLOY STAFF'}
        open={showAddDeploymentModal}
        onCancel={() => state.modalSlice.toggleAddDeploymentModal()}
        footer={false}
      >
        <div className="mt-9">
          <Form layout="vertical" name="deployment">
            <Form.Item
              name={'region'}
              label={'Region'}
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  {
                    label: 'Greater Accra',
                    value: 1,
                  },
                  {
                    label: 'Volta',
                    value: 2,
                  },
                  {
                    label: 'Bono',
                    value: 3,
                  },
                  {
                    label: 'Ahafo',
                    value: 4,
                  },
                  {
                    label: 'North East',
                    value: 5,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              name={'staff'}
              label={'Staff'}
              rules={[{ required: true }]}
            >
              <Select options={[]} mode="multiple" />
            </Form.Item>
            <Button
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
