import React, { Fragment, useEffect, useState } from 'react';

import {
  Button,
  Modal,
  Input,
  DatePicker,
  message,
  Space,
  Divider,
  Form,
} from 'antd';
import Upload from 'antd/es/upload/Upload';

import {
  MinusCircleFilled,
  MinusCircleOutlined,
  MinusOutlined,
  MinusSquareOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { MdOutlineEmail } from 'react-icons/md';

import CustomSelect from '../../components/CustomSelect/CustomSelect';
import PhotosUploader from '../../components/PhotosUploader/PhotosUploader';

import { axiosInstance } from '../../axios/axiosInstance';
import { useAddPropertyData } from '../../Hooks/useAddFetch';

import { useIndexedDB } from 'react-indexed-db-hook';
import TextArea from 'antd/es/input/TextArea';

const PropertyUnitForm = ({ name }) => {
  const [open, setOpen] = useState(false);
  const [pageNum, setpageNum] = useState(1);
  const [optionsPropertyType, setOptionsPropertyType] = useState([]);
  const [optionsLocation, setOptionsLocation] = useState([]);
  const [optionsDivision, setOptionsDivision] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [propertyResponse, setPropertyResponse] = useState('');
  const [optionsOccupant, setOptionsOccupant] = useState([
    {
      label: 'LBC',
      value: 'LBC',
    },
    {
      label: 'NON LBC',
      value: 'NON LBC',
    },
  ]);

  const form = Form.useFormInstance();
  const propertyUnits = Form.useWatch('propertyUnits', form);

  const [selectedPropType, setSelectedPropType] = useState('');

  const [occupantType, setOccupantType] = useState('');
  const [propType, setPropType] = useState(null);

  const [occupantNames, setOccupantNames] = useState([]);

  const { getAll: getAllClientOccupants } = useIndexedDB('clientOccupants');
  const { getAll: getAllPropertyTypes } = useIndexedDB('propertyTypes');

  const fetchPropertyTypes = async () => {
    getAllPropertyTypes().then((propertyType) => {
      const data = propertyType.map((record) => {
        return {
          label: record?.name,
          value: record?.id,
        };
      });
      setOptionsPropertyType(data);
    });
  };

  useEffect(() => {
    if (selectedPropType) {
      getAllPropertyTypes().then((propertyType) => {
        const s = propertyType.filter(
          (propType) => propType?.id === selectedPropType
        );
        setPropType(s[0].attributes[0]);
      });
    }
  }, []);

  useEffect(() => {
    fetchPropertyTypes();
  }, []);

  const getNamesByTypeOfOccupant = (typeOfOccupant) => {
    getAllClientOccupants().then((occupants) => {
      const getFilteredNames = occupants.filter(
        (occupant) => occupant?.category === typeOfOccupant
      );
      console.log({ getFilteredNames });
      const data = getFilteredNames.map((record) => {
        return {
          label: record?.name,
          value: record?.id,
        };
      });

      setOccupantNames(data);
    });
  };

  useEffect(() => {
    getNamesByTypeOfOccupant(occupantType);
  }, [occupantType]);

  const { mutate } = useAddPropertyData();

  const success = (content) => {
    messageApi.open({
      type: 'success',
      content: content,
    });
  };

  const errorMessage = (content) => {
    messageApi.open({
      type: 'error',
      content: content,
    });
  };

  console.log();

  return (
    <div className="w-full bg-white p-3">
      <>
        <Divider orientation="left">Property Unit Information</Divider>

        <Form.Item name={[name, 'id']}>
          <Input type="hidden" />
        </Form.Item>

        <Form.Item
          label="Description"
          name={[name, 'description']}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input
            readOnly
            type="text"
            placeholder="Enter description"
            prefix={<MdOutlineEmail />}
          />
        </Form.Item>

        <Form.Item
          label="PropertyCode"
          name={[name, 'propertyCode']}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input
            type="text"
            placeholder="Enter property code"
            prefix={<MdOutlineEmail />}
          />
        </Form.Item>

        <Form.Item
          label="Category"
          name={[name, 'propertyTypeId']}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <CustomSelect
            mode="single"
            placeholder="Select category"
            options={optionsPropertyType}
            style={{
              width: '100%',
            }}
            onChange={(e) => setSelectedPropType(e)}
          />
        </Form.Item>

        <>
          {propType === 'plotSize' ? (
            <Form.Item
              label="Plot Size"
              name={[name, 'plotSize']}
              rules={[
                {
                  // required: true,
                },
              ]}
            >
              <Input
                readOnly
                type="text"
                placeholder="Enter Plot Size"
                prefix={<MdOutlineEmail />}
              />
            </Form.Item>
          ) : (
            <Form.Item
              label="Floor Area"
              name={[name, 'floorArea']}
              // rules={[
              //   {
              //     required: true,
              //   },
              // ]}
            >
              <Input
                readOnly
                type="text"
                placeholder=""
                prefix={<MdOutlineEmail />}
              />
            </Form.Item>
          )}
        </>

        <Form.Item
          name={[name, 'condition']}
          label={'Condition'}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <CustomSelect
            mode="single"
            placeholder="Select condition"
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
            style={{
              width: '100%',
            }}
          />
        </Form.Item>

        <Form.Item
          label="Remarks"
          name={[name, 'remarks']}
          // rules={[
          //   {
          //     required: true,
          //   },
          // ]}
        >
          <TextArea
            rows={12}
            placeholder="Enter remarks"
            prefix={<MdOutlineEmail />}
          />
        </Form.Item>

        <Divider orientation="left">Occupancy</Divider>
        <Fragment>
          <Form.List name={[name, 'occupants']}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((key, name) => (
                  <div
                    key={key}
                    className="border-solid border-b border-b-gray-200 pb-8 mb-6 relative w-full"
                  >
                    <Form.Item
                      label="Occupant Type"
                      name={[name, 'occupantType']}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <CustomSelect
                        mode="single"
                        placeholder="Select type of Occupant"
                        options={optionsOccupant}
                        onChange={(e) => setOccupantType(e)}
                        style={{
                          width: '100%',
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Occupant Name"
                      name={[name, 'occupantName']}
                      rules={[
                        {
                          // required: true,
                        },
                      ]}
                    >
                      <CustomSelect
                        mode="single"
                        placeholder="Select name of Occupant"
                        options={occupantNames}
                        style={{
                          width: '100%',
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Tenancy Agreement Start-date"
                      name={[name, 'tenancyAgreeMentStartDate']}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <DatePicker
                        name="tenancyAgreeMentStartDate"
                        // value={tenancyAgreeMentStartDate}
                        // onChange={handleDatePicker}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Tenancy Agreement End-date"
                      name={[name, 'tenancyAgreeMentEndDate']}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <DatePicker
                        name="tenancyAgreeMentEndDate"
                        // value={tenancyAgreeMentEndDate}
                        // onChange={handleDatePicker}
                      />
                    </Form.Item>
                    {fields.length > 0 ? (
                      <button
                        type="button"
                        className="dynamic-delete-button font-semibold bg-[#f0Ebe1] rounded  p-2 w-full"
                        onClick={() => remove(name)}
                      >
                        Remove occupant
                      </button>
                    ) : null}
                  </div>
                ))}

                <div className="h-[70px] w-full flex items-center mb-4 ">
                  <button
                    type="button"
                    className="p-2 bg-[#f0Ebe1] border border-solid  font-semibold cursor-pointer rounded w-full text-center"
                    onClick={() => add()}
                  >
                    Add Occupant
                  </button>
                </div>
              </>
            )}
          </Form.List>
        </Fragment>

        <Divider />

        {/* <Form.Item label=" ">
          <Button
            className="w-full"
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: "#6E431D", color: "#fff" }}
          >
            Submit
          </Button>
        </Form.Item> */}
      </>
    </div>
  );
};
export default PropertyUnitForm;
