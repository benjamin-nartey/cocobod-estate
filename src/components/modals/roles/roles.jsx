import { useSnapshot } from 'valtio';
import state from '../../../store/store';
import { useGetPermissions } from '../../../Hooks/query/roles';
import { Button, Form, Input, Modal, Select, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addRole, updateRole } from '../../../http/roles';
import { CRUDTYPES } from '../../../store/modalSlice';
import { useEffect } from 'react';

const RolesModal = () => {
  const snap = useSnapshot(state);

  const [form] = Form.useForm();

  const { showRolesModal, selectedRecord, crudType } = snap.modalSlice;

  const { data: permissions } = useGetPermissions();

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationKey: 'roles',
    mutationFn: (data) => {
      return addRole(data);
    },

    onSuccess: () => {
      state.modalSlice.toggleshowRolesModal();
      queryClient.invalidateQueries({
        queryKey: 'roles',
      });

      message.success('Role added successfully');
    },
    onError: (err) => {
      message.error(err?.response?.data?.message);
    },
  });
  const { mutate: updateRolesFn, isLoading: updateIsLoading } = useMutation({
    mutationKey: 'roles',
    mutationFn: (data) => {
      return updateRole(selectedRecord?.id, data);
    },

    onSuccess: () => {
      state.modalSlice.toggleshowRolesModal();
      queryClient.invalidateQueries({
        queryKey: 'roles',
      });

      message.success('Role updated successfully');
    },
    onError: (err) => {
      message.error(err?.response?.data?.message);
    },
  });

  const onSubmit = (values) => {
    crudType === CRUDTYPES.ADD ? mutate(values) : updateRolesFn(values);
  };

  useEffect(() => {
    form.setFieldsValue({
      name: selectedRecord?.name,
      permissionIds: selectedRecord?.permissions.map((p) => p?.id),
    });
  }, [selectedRecord]);

  return (
    <div className="max-h-[60%] overflow-scroll">
      <Modal
        title={crudType === CRUDTYPES.ADD ? 'ADD ROLE' : 'EDIT ROLE'}
        open={showRolesModal}
        onCancel={() => state.modalSlice.toggleshowRolesModal()}
        footer={false}
      >
        <Form
          form={form}
          onFinish={(values) => onSubmit(values)}
          name="roles"
          layout="vertical"
          labelAlign="left"
          labelWrap
          colon={false}
          style={{
            maxWidth: 600,
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input name="name" placeholder="Enter role name" />
          </Form.Item>

          <Form.Item
            label="Permissions"
            name="permissionIds"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              mode="multiple"
              optionFilterprop={'label'}
              showSearch
              placeholder="Select permissions"
              options={permissions?.data?.map((p) => ({
                label: p?.name,
                value: p?.id,
              }))}
              style={{
                width: '100%',
              }}
            />
          </Form.Item>

          <Form.Item label=" ">
            <Button
              loading={crudType === CRUDTYPES.ADD ? isLoading : updateIsLoading}
              className="w-full"
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: '#6E431D', color: '#fff' }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RolesModal;
