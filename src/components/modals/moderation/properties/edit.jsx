import { Form } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React from 'react';

const EditModerationProperties = () => {
  return (
    <div>
      <Modal>
        <Form>
          <Form.Item name={'name'} label={'Name'}>
            <Input />
          </Form.Item>
          <Form.Item name={'description'} label={'Name'}>
            <TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EditModerationProperties;
