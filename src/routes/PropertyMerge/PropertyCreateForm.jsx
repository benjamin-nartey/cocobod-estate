import { Button, Form, Input } from 'antd';
import React from 'react';

const PropertyCreateForm = () => {
  return (
    <div>
      <Form name="property-create-form">
        <Form.Item label={'Name'} name={'name'}>
          <Input />
        </Form.Item>
        <Button htmlType="submit">Submit</Button>
      </Form>
    </div>
  );
};

export default PropertyCreateForm;
