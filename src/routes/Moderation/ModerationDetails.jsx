import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetPropertyUnitsForProperty } from '../../Hooks/query/properties';
import {
  Button,
  Divider,
  Form,
  Input,
  Select,
  Spin,
  Tooltip,
  message,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import { useMutation } from '@tanstack/react-query';
import { approveModeration } from '../../http/moderation';
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi';
import { useSnapshot } from 'valtio';
import state from '../../store/store';
import ConditionsModal from '../../components/modals/conditions/conditions';

const ModerationDetails = () => {
  const { propertyUnitId } = useParams();
  const [form] = Form.useForm();
  const snap = useSnapshot(state);
  const { showConditionsModal } = snap.modalSlice;

  const navigate = useNavigate();

  const { data, isLoading } = useGetPropertyUnitsForProperty(propertyUnitId);

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

  const { mutate, isLoading: submitLoading } = useMutation({
    mutationKey: 'approveModeration',
    mutationFn: (data) => {
      return approveModeration(propertyUnitId, data);
    },

    onSuccess: (data) => {
      message.success('Property Capture approved successfully');
      navigate(-1);
    },
    onError: (error) => {
      message.error(error?.response?.data?.message);
    },
  });

  const onSubmit = (values) => {
    const mutationValues = {
      propertyCode: values.propertyCode,
      description: values.description,
      plotSize: values.plotSize,
      floorArea: values.floorArea,
      propertyOccupants: values?.propertyOccupancies.map((occ) => ({
        id: occ?.id,
        // leaseStartsOn: occ['leaseStartsOn']
        //   ? occ['leaseStartsOn'].toISOString()
        //   : undefined,
        // leaseExpiresOn: occ['leaseExpiresOn']
        //   ? occ['leaseExpiresOn'].toISOString()
        //   : undefined,
        clientOccupant: {
          name: occ?.name,
          email: occ?.email,
        },
      })),
      propertyUnitState: {
        id: data?.data?.propertyStates[0]?.id,
        condition: values?.condition,
        remarks: values?.remarks,
      },
    };

    mutate(mutationValues);
  };

  return isLoading ? (
    <div className="translate-x-[50%] translate-y-[50%]">
      <Spin size="large" />
    </div>
  ) : (
    <div className=" w-[60%] mx-auto m-9 mb-9 bg-white py-8 px-11">
      <Form
        name="propertyUnitForm"
        form={form}
        layout="vertical"
        onFinish={(values) => onSubmit(values)}
      >
        <Divider>
          <span className="text-[#af5c13]">Property Info</span>
        </Divider>
        <Form.Item
          name={'propertyCode'}
          label={'PropertyCode'}
          // initialValue={data?.data?.propertyCode}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={'description'}
          label={'Property Description'}
          initialValue={data?.data?.description}
        >
          <TextArea rows={10} />
        </Form.Item>
        <Form.Item
          name={'plotSize'}
          label={'Plot Size'}
          // initialValue={data?.data?.plotSize}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={'floorArea'}
          label={'Floor Area'}
          // initialValue={data?.data?.floorArea}
        >
          <Input />
        </Form.Item>
        <Divider>
          <span className="text-[#af5c13]">Property State</span>
        </Divider>
        <div className="flex items-center  gap-3">
          <Form.Item
            name={'condition'}
            label={'Condition'}
            initialValue={data?.data?.propertyStates[0]?.condition}
            style={{
              width: '100%',
            }}
          >
            <Select
              // showSearch
              // optionFilterProp="label"
              options={[
                {
                  label: 'Very Good',
                  value: 'VERY_GOOD',
                },
                {
                  label: 'Good',
                  value: 'GOOD',
                },

                {
                  label: 'Fair',
                  value: 'FAIR',
                },

                {
                  label: 'Poor/Dilapidated',
                  value: 'POOR',
                },
                {
                  label: 'Write Off',
                  value: 'WRITE_OFF',
                },
              ]}
            />
          </Form.Item>
          <HiOutlineQuestionMarkCircle
            onClick={() => state.modalSlice.toggleshowConditionsModal()}
            size={22}
            className=" cursor-pointer"
          />
        </div>

        <Form.Item
          name={'remarks'}
          label={'Remarks'}
          // initialValue={data?.data?.propertyStates[0]?.remarks}
        >
          <TextArea rows={10} disabled />
        </Form.Item>
        <Form.Item name={'moderationRemarks'} label={'Moderators Remark'}>
          <TextArea rows={10} />
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
                    <Input style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    label={'Email'}
                    name={[name, 'email']}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label={'Phone Number'}
                    name={[name, 'phoneNumber']}
                  >
                    <Input />
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

                  <Tooltip title={'Remove Occupancy'}>
                    <div className="flex justify-center">
                      <MinusCircleOutlined
                        size={64}
                        onClick={() => remove(name)}
                        className="text-xl text-center"
                      />
                    </div>
                  </Tooltip>
                </div>
              ))}
            </>
          )}
        </Form.List>

        <Button htmlType="submit" className="w-full" loading={submitLoading}>
          Approve
        </Button>
      </Form>

      {showConditionsModal && <ConditionsModal />}
    </div>
  );
};

export default ModerationDetails;
