import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetPropertyUnitsForProperty } from '../../Hooks/query/properties';
import { Button, DatePicker, Divider, Form, Input, Select, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';

const ModerationDetails = () => {
  const { propertyUnitId } = useParams();

  const { data, isLoading } = useGetPropertyUnitsForProperty(propertyUnitId);

  return (
    <div className=" w-[60%] mx-auto m-9 mb-9">
      <Form name="propertyUnitForm" layout="vertical">
        <Divider>
          <span className="text-sky-600">Property Info</span>
        </Divider>
        <Form.Item name={'propertyCode'} label={'PropertyCode'}>
          <Input />
        </Form.Item>
        <Form.Item name={'description'} label={'Property Description'}>
          <TextArea rows={10} />
        </Form.Item>
        <Form.Item name={'plotSize'} label={'Plot Size'}>
          <Input />
        </Form.Item>
        <Form.Item name={'floorArea'} label={'Floor Area'}>
          <Input />
        </Form.Item>
        <Divider>
          {' '}
          <span className="text-sky-600">Property State</span>
        </Divider>
        <Form.Item name={'condition'} label={'Condition'}>
          <Select
            options={[
              {
                label: 'VERY GOOD',
                value: 'VERY_GOOD',
              },
              {
                label: 'GOOD',
                value: 'GOOD',
              },
              {
                label: 'FAIRLY GOOD',
                value: 'FAIRLY_GOOD',
              },
              {
                label: 'POOR',
                value: 'POOR',
              },
            ]}
          />
        </Form.Item>
        <Form.Item name={'remarks'} label={'Remarks'}>
          <TextArea rows={10} />
        </Form.Item>

        <Divider>
          <span className="text-sky-600">Occupancy</span>
        </Divider>
        {[1, 2, 3, 4].map((item) => (
          <div className="border border-gray-300 p-3 mb-8">
            <Form.Item name={'name'} label={'Occupant Name'}>
              <Input />
            </Form.Item>
            <Form.Item name={'staffNumber'} label={'Staff Number'}>
              <Input />
            </Form.Item>
            <Form.Item name={'category'} label={'Category'}>
              <Select
                options={[
                  {
                    label: 'LBC',
                    value: 'LBC',
                  },
                  {
                    label: 'LBC',
                    value: 'NON_LBC',
                  },
                ]}
              />
            </Form.Item>
            <Form.Item name={'email'} label={'Email'}>
              <Input />
            </Form.Item>
            <Form.Item name={'email'} label={'Phone Number'}>
              <Input />
            </Form.Item>
            <Form.Item
              name={'leaseStartsOn'}
              label={'Tenancy Agreement Start Date'}
            >
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item
              name={'leaseExpiresOn'}
              label={'Tenancy Agreement End Date'}
            >
              <DatePicker className="w-full" />
            </Form.Item>
          </div>
        ))}

        <Button htmlType="submit" className="w-full">
          Approve
        </Button>
      </Form>
    </div>
  );
};

export default ModerationDetails;
