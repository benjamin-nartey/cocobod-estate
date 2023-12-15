import { Button, Form, Input, Modal, Select, Spin, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React from 'react';
import { useSnapshot } from 'valtio';
import state from '../../../../store/store';
import { useGetAllTowns } from '../../../../Hooks/query/town';
import { useGetPropertyTypes } from '../../../../Hooks/query/propertyType';
import { useGetProperty } from '../../../../Hooks/query/properties';
import { useMutation } from '@tanstack/react-query';
import { updateProperty } from '../../../../http/properties';

const EditModerationProperties = () => {
  const snap = useSnapshot(state);
  const { data: towns } = useGetAllTowns();
  const { data: propertyTypes } = useGetPropertyTypes();
  const { showEditPropertyModal, selectedRecord } = snap.modalSlice;

  const { data: property, isLoading: propertyLoading } = useGetProperty(
    selectedRecord?.id
  );

  const { mutate } = useMutation({
    mutationKey: 'updateProperty',
    mutationFn: (data) => {
      return updateProperty(selectedRecord?.id, data);
    },

    onSuccess: (data) => {
      state.modalSlice.toggleshowEditPropertyModal();
      message.success('Property updated successfully');
    },
    onError: (e) => {
      message.error(error.response.data.message);
    },
  });

  const onSubmit = (values) => {
    mutate(values);
  };

  // console.log({ selectedRecord });

  return !propertyLoading ? (
    <div>
      <Modal
        title={'EDIT PROPERTY'}
        footer={false}
        open={showEditPropertyModal}
        onCancel={() => state.modalSlice.toggleshowEditPropertyModal()}
        maskClosable={false}
      >
        <div className="mt-6">
          <Form
            name="editProperty"
            initialValues={property?.data}
            layout="vertical"
            onFinish={(values) => onSubmit(values)}
          >
            <Form.Item
              name={'name'}
              label={'Name'}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={'description'}
              label={'Description'}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <TextArea />
            </Form.Item>
            <Form.Item name={'digitalAddress'} label={'Digital Address'}>
              <Input />
            </Form.Item>
            <Form.Item
              initialValue={property?.data?.propertyType?.id}
              name={'propertyTypeId'}
              label={'PropertyType'}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                options={propertyTypes?.data?.map((pType) => ({
                  label: pType?.name,
                  value: pType?.id,
                }))}
              />
            </Form.Item>
            <Form.Item
              initialValue={property?.data?.location?.id}
              name={'locationId'}
              label={'Town'}
              rules={[{ required: true }]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                options={towns?.data.map((town) => ({
                  label: town?.name,
                  value: town?.id,
                }))}
              />
            </Form.Item>
            <div className="flex">
              <Form.Item name={'lat'} label={'Latitude'}>
                <Input />
              </Form.Item>
              <Form.Item name={'long'} label={'Longitude'}>
                <Input />
              </Form.Item>
            </div>
            <Form.Item name={'landmark'} label={'Landmark'}>
              <Input />
            </Form.Item>
            <Button htmlType="submit" className="w-full">
              Update
            </Button>
          </Form>
        </div>
      </Modal>
    </div>
  ) : (
    <Spin size="large" />
  );
};

export default EditModerationProperties;
