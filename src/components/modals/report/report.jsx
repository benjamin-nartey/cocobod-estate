import { Button, Form, Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  useGetDistrictByRegionId,
  useGetRegions,
} from '../../../Hooks/query/regions';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getDistrictsByRegionId } from '../../../http/district';
import { useGetPropertyTypes } from '../../../Hooks/query/propertyType';
import { useSnapshot } from 'valtio';
import state from '../../../store/store';
import { getTownByDistrictId } from '../../../http/town';
import { useGetPaginatedData } from '../../../Hooks/query/generics';
import { getReport } from '../../../http/report';
import { useGetReport } from '../../../Hooks/query/report';
import { useGetTownByDistrictId } from '../../../Hooks/query/district';
import { capitalize } from '../../../utils/typography';

const ReportFilter = () => {
  const [form] = Form.useForm();
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const { data: regions } = useGetRegions();
  const snap = useSnapshot(state);
  const { showReportModal, reportFilters, pageNum } = snap.modalSlice;

  const { data: district, refetch: fetchDistricts } =
    useGetDistrictByRegionId(selectedRegionId);

  const { data: towns, refetch: fetchTowns } =
    useGetTownByDistrictId(selectedDistrictId);

  useEffect(() => {
    fetchDistricts();
  }, [selectedRegionId]);

  useEffect(() => {
    fetchTowns();
  }, [selectedDistrictId]);

  const { refetch } = useGetReport(pageNum);
  const { data: propertyTypes } = useGetPropertyTypes();

  const handleFilterSubmit = (values) => {
    state.modalSlice.reportFilters = values;
    state.modalSlice.toggleshowReportModal();
  };

  useEffect(() => {
    if (state.modalSlice.reportFilters) {
      refetch();
    }
  }, [state.modalSlice.reportFilters]);

  return (
    <div>
      <Modal
        title={'REPORT FILTER'}
        footer={false}
        open={showReportModal}
        onCancel={() => state.modalSlice.toggleshowReportModal()}
        maskClosable={false}
      >
        <div className="mt-8">
          <Form
            layout={'vertical'}
            form={form}
            // initialValues={state.modalSlice?.reportFilters}
            onFinish={(values) => handleFilterSubmit(values)}
          >
            <Form.Item name={'regionFilter'} label={'Region'}>
              <Select
                onChange={(value) => {
                  setSelectedRegionId(value);
                  // fetchDistricts();
                }}
                options={regions?.data?.map((reg) => ({
                  label: reg && capitalize(reg?.name.toLowerCase()),
                  value: reg?.id,
                }))}
              />
            </Form.Item>
            <Form.Item name={'districtFilter'} label={'District'}>
              <Select
                optionFilterProp="label"
                showSearch
                options={district?.data?.map((dis) => ({
                  label: dis && capitalize(dis?.name.toLowerCase()),
                  value: dis?.id,
                }))}
                onChange={(value) => {
                  setSelectedDistrictId(value);
                  // fetchTowns();
                }}
              />
            </Form.Item>
            <Form.Item name={'locationFilter'} label={'Town'}>
              <Select
                optionFilterProp="label"
                showSearch
                options={towns?.data?.map((town) => ({
                  label: town && capitalize(town?.name.toLowerCase()),
                  value: town?.id,
                }))}
              />
            </Form.Item>
            <Form.Item
              name={'propertyConditionFilter'}
              label={'Property Condition'}
            >
              <Select
                optionFilterProp="label"
                showSearch
                options={[
                  {
                    label: 'New',
                    value: 'NEW',
                  },
                  {
                    label: 'Very Good',
                    value: 'VERY_GOOD',
                  },
                  {
                    label: 'Good',
                    value: 'GOOD',
                  },
                  {
                    label: 'Fairly Good',
                    value: 'FAIRLY_GOOD',
                  },
                  {
                    label: 'Fair',
                    value: 'FAIR',
                  },
                  {
                    label: 'Fairly Poor',
                    value: 'FAIRLY_POOR',
                  },
                  {
                    label: 'Poor',
                    value: 'POOR',
                  },
                  {
                    label: 'Very Poor',
                    value: 'VERY_POOR',
                  },
                  {
                    label: 'Dilapidated',
                    value: 'DILAPIDATED',
                  },
                  {
                    label: 'Residual/Dangerous',
                    value: 'RESIDUAL_DANGEROUS',
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              name={'propertyTypeFilter'}
              label={'Category/Class Asset'}
            >
              <Select
                optionFilterProp="label"
                showSearch
                options={propertyTypes?.data?.map((pt) => ({
                  label: pt && capitalize(pt.name.toLowerCase()),
                  value: pt?.id,
                }))}
              />
            </Form.Item>
            <Button htmlType="submit" className="w-full">
              Submit
            </Button>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default ReportFilter;
