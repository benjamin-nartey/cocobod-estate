import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Spin,
  Tooltip,
  message,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useSnapshot } from 'valtio';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useMutation } from '@tanstack/react-query';

import { HiQuestionMarkCircle } from 'react-icons/hi';
import state from '../../../store/store';
import { useGetPropertyUnitsForProperty } from '../../../Hooks/query/properties';

const PropertyUnitModal = () => {
  const snap = useSnapshot(state);
  const { selectedRecord, showPropertyUnitModal } = snap.modalSlice;

  const { propertyUnitId } = useParams();
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const { data, isLoading } = useGetPropertyUnitsForProperty(
    selectedRecord?.id
  );

  const initValues = data?.data?.propertyOccupancies?.map((occ) => ({
    id: occ?.id,
    name: occ?.clientOccupant?.name,
    email: occ?.clientOccupant?.email,
    phoneNumber: occ?.clientOccupant?.phoneNumber,
    category: occ?.clientOccupant?.category,
    // leaseStartsOn: dayjs(occ?.leaseStartsOn),
    // leaseExpiresOn: occ?.leaseExpiresOn ? dayjs(occ?.leaseExpiresOn) : '',
  }));

  useEffect(() => {
    if (data?.data && !isLoading) {
      form.setFieldValue('propertyCode', data?.data.propertyCode);
      form.setFieldValue('description', data?.data?.description);
      form.setFieldValue('plotSize', data?.data?.plotSize);
      form.setFieldValue('floorArea', data?.data?.floorArea);
      form.setFieldValue('condition', data?.data?.propertyStates[0]?.condition);
      form.setFieldValue('remarks', data?.data?.propertyStates[0]?.remarks);
      form.setFieldValue('propertyOccupancies', initValues);
    }
  }, [data?.data, isLoading]);

  return isLoading ? (
    <div className="translate-x-[50%] translate-y-[50%]">
      <Spin size="large" />
    </div>
  ) : (
    <div className=" w-[40%] mx-auto m-9 mb-9 bg-white py-8 px-11 ">
      <Modal
        open={showPropertyUnitModal}
        footer={false}
        onCancel={() => state.modalSlice.toggleshowPropertyUnitModal()}
      >
        <div className="max-h-[80vh] overflow-y-auto mt-10">
          <Form name="propertyUnitForm" form={form} layout="vertical">
            <Divider>
              <span className="text-[#af5c13]">Property Info</span>
            </Divider>
            <Form.Item
              name={'propertyCode'}
              label={'PropertyCode'}
              // initialValue={data?.data?.propertyCode}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name={'description'}
              label={'Property Description'}
              initialValue={data?.data?.description}
            >
              <TextArea rows={10} disabled />
            </Form.Item>
            <Form.Item
              name={'plotSize'}
              label={'Plot Size'}
              // initialValue={data?.data?.plotSize}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name={'floorArea'}
              label={'Floor Area'}

              // initialValue={data?.data?.floorArea}
            >
              <Input disabled />
            </Form.Item>
            <Divider>
              <span className="text-[#af5c13]">Property State</span>
            </Divider>

            <Form.Item
              name={'condition'}
              label={'Condition'}
              // initialValue={data?.data?.propertyStates[0]?.condition}
            >
              <Select
                disabled
                options={[
                  {
                    label: 'NEW',
                    value: 'NEW',
                  },
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
                    label: 'FAIR',
                    value: 'FAIR',
                  },
                  {
                    label: 'FAIRLY POOR',
                    value: 'FAIRLY_POOR',
                  },
                  {
                    label: 'POOR',
                    value: 'POOR',
                  },
                  {
                    label: 'VERY POOR',
                    value: 'VERY_POOR',
                  },
                  {
                    label: 'DILAPIDATED',
                    value: 'DILAPIDATED',
                  },
                  {
                    label: 'RESIDUAL/DANGEROUS',
                    value: 'RESIDUAL_DANGEROUS',
                  },
                ]}
              />
            </Form.Item>

            <Form.Item
              name={'remarks'}
              label={'Remarks'}

              // initialValue={data?.data?.propertyStates[0]?.remarks}
            >
              <TextArea rows={10} disabled />
            </Form.Item>
            <Form.Item name={'moderationRemarks'} label={'Moderators Remark'}>
              <TextArea rows={10} disabled />
            </Form.Item>

            <Divider>
              <span className="text-[#af5c13]">Occupancy</span>
            </Divider>

            <Form.List name="propertyOccupancies">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div
                      key={key}
                      className="flex flex-col gap-6 p-[2rem] border border-dashed border-gray-300 mb-10"
                    >
                      <Form.Item {...restField} name={[name, 'id']}>
                        <Input type="hidden" />
                      </Form.Item>

                      <Form.Item
                        label={'Occupant Name'}
                        {...restField}
                        name={[name, 'name']}
                        rules={[
                          {
                            required: true,
                            message: 'Name required',
                          },
                        ]}
                      >
                        <Input style={{ width: '100%' }} disabled />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        label={'Email'}
                        name={[name, 'email']}
                      >
                        <Input disabled />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        label={'Phone Number'}
                        name={[name, 'phoneNumber']}
                      >
                        <Input disabled />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        label={'Category'}
                        name={[name, 'category']}
                        rules={[
                          {
                            required: true,
                            message: 'Category required',
                          },
                        ]}
                      >
                        <Select
                          disabled
                          options={[
                            {
                              label: 'LBC',
                              value: 'LBC',
                            },
                            {
                              label: 'NON LBC',
                              value: 'NON_LBC',
                            },
                          ]}
                        />
                      </Form.Item>
                    </div>
                  ))}
                </>
              )}
            </Form.List>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default PropertyUnitModal;
