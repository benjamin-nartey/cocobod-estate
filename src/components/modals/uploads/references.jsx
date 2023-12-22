import { Button, Form, Modal, Upload, message, notification } from 'antd';

import { UploadOutlined } from '@ant-design/icons';
import state from '../../../store/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useSnapshot } from 'valtio';
import { uploadReferences } from '../../../http/uploads';
import { checkFile } from '../../../utils/common';

const ReferencesUpload = () => {
  const snap = useSnapshot(state);
  const { showReferencesUploadModal } = snap.modalSlice;

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationKey: 'referencesUpload',
    mutationFn: (data) => {
      return uploadReferences(data);
    },
    onSuccess: () => {
      state.modalSlice.toggleshowReferencesUploadModal();
      message.success('Properties uploaded successfully');
    },
    onError: (e) => {
      message.error(e?.response?.data?.message);
    },
  });

  const [form] = Form.useForm();

  const handleFileUpload = (values) => {
    const _values = {
      ...values,
      file: values['file'].file,
    };

    const formData = new FormData();

    formData.append('batch-property-reference', _values.file);

    mutate(formData);
  };

  const props = {
    name: 'file',
    beforeUpload: () => false,
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div>
      <Modal
        open={showReferencesUploadModal}
        footer={false}
        onCancel={() => state.modalSlice.toggleshowReferencesUploadModal()}
        maskClosable={false}
      >
        <div className="pt-9 mx-auto w-[90%]">
          <h2 className="py-4 text-primary text-xl font-semibold text-center">
            Upload Properties from csv
          </h2>
          <Form onFinish={handleFileUpload} form={form}>
            <Form.Item name="file">
              <Upload {...props}>
                <Button
                  type="dashed"
                  style={{ width: '26.5rem', backgroundColor: 'white' }}
                  icon={<UploadOutlined />}
                >
                  Select csv file
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={isLoading}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default ReferencesUpload;
