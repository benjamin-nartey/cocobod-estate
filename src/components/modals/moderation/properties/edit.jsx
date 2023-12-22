import { Button, Form, Input, Modal, Select, Spin, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import state from '../../../../store/store';
import { useGetAllTowns } from '../../../../Hooks/query/town';
import { useGetPropertyTypes } from '../../../../Hooks/query/propertyType';
import { useGetProperty } from '../../../../Hooks/query/properties';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateProperty,
  uploadPropertyPhotos,
} from '../../../../http/properties';
import Dragger from 'antd/es/upload/Dragger';
import { FileAddOutlined, PlusOutlined } from '@ant-design/icons';

const EditModerationProperties = () => {
  const snap = useSnapshot(state);
  const { data: towns } = useGetAllTowns();
  const { data: propertyTypes } = useGetPropertyTypes();
  const { showEditPropertyModal, selectedRecord } = snap.modalSlice;

  const { data: property, isLoading: propertyLoading } = useGetProperty(
    selectedRecord?.id
  );

  const [form] = Form.useForm();

  const [fileList, setFileList] = useState([]);

  const queryClient = useQueryClient();

  const { mutate: photosUpdate } = useMutation({
    mutationKey: 'updatePropertyPhotos',
    mutationFn: (data) => {
      return uploadPropertyPhotos(selectedRecord?.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllProperties'] });
      state.modalSlice.toggleshowEditPropertyModal();
      message.success('Property updated successfully');
    },
  });

  const { mutate } = useMutation({
    mutationKey: 'updateProperty',
    mutationFn: (data) => {
      return updateProperty(selectedRecord?.id, data);
    },

    onSuccess: (data) => {
      const formData = new FormData();

      const photos = form.getFieldValue('file');

      console.log({ photos });

      photos.fileList.forEach((photo) => {
        formData.append('photos', photo.originFileObj);
      });

      photosUpdate(formData);
    },
    onError: (e) => {
      message.error(error.response.data.message);
    },
  });

  const onSubmit = (values) => {
    delete values.file;

    mutate(values);
  };

  useEffect(() => {
    if (property?.data) {
      form.setFieldsValue(property?.data);
    }
  }, [property?.data]);
  // console.log({ selectedRecord });

  const props = {
    // onRemove: (file) => {
    //   const index = fileList.indexOf(file);
    //   const newFileList = fileList.slice();
    //   newFileList.splice(index, 1);
    //   setFileList(newFileList);
    // },

    beforeUpload: (file) => {
      const isJpgOrPng =
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
        return Upload.LIST_IGNORE;
      }

      return false;

      //   return isJpgOrPng || Upload.LIST_IGNORE;
    },
  };

  return !propertyLoading ? (
    <div>
      <Modal
        title={'EDIT PROPERTY'}
        footer={false}
        open={showEditPropertyModal}
        onCancel={() => {
          state.modalSlice.selectedRecord = null;
          state.modalSlice.toggleshowEditPropertyModal();
        }}
        maskClosable={false}
        className=""
      >
        <div className="mt-6">
          <Form
            form={form}
            name="editProperty"
            // initialValues={property?.data}
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

            <Form.Item name="file">
              <Dragger
                multiple
                accept={'image/png, image/jpeg, image/jpg'}
                listType="picture"
                {...props}
                // onChange={handleChange}
                // fileList={fileList}
              >
                <p className="ant-upload-drag-icon">
                  <PlusOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag image files to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload.
                </p>
              </Dragger>
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
