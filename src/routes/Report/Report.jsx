import { Space, Table, Tag, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { HiOutlineFilter } from 'react-icons/hi';
import ReportFilter from '../../components/modals/report/report';
import { useSnapshot } from 'valtio';
import state from '../../store/store';
import { useGetReport } from '../../Hooks/query/report';
import { CONDITIONS } from '../../utils/categories';
import { AiOutlineFileExcel } from 'react-icons/ai';
import { exportToExcel } from '../../utils/helper';

const Report = () => {
  const snap = useSnapshot(state);
  const [pageNum, setPageNum] = useState(1);
  const { showReportModal, reportFilters } = snap.modalSlice;

  const { data: report, refetch, isLoading } = useGetReport(pageNum);

  const columns = [
    {
      title: 'Cocoa Region',
      dataIndex: ['property', 'location', 'district', 'region', 'name'],
      //   width: 200,
    },
    {
      title: 'Location/Town',
      dataIndex: ['property', 'location', 'name'],
    },
    {
      title: 'Landmark',
      dataIndex: ['property', 'landmark'],
    },
    {
      title: 'District',
      dataIndex: ['property', 'location', 'district', 'name'],
    },
    {
      title: 'Description of Property',
      dataIndex: 'description',
    },
    {
      title: 'Plot Size',
      dataIndex: 'plotSize',
    },
    {
      title: 'Floor Area(sq mt)',
      dataIndex: 'floorArea',
    },
    {
      title: 'Condition of Property',
      dataIndex: 'propertyStates',
      render: (value) => {
        return CONDITIONS[value[0]?.condition];
      },
    },
    {
      title: 'Current Occupant(s)',
      dataIndex: 'propertyOccupancies',

      render: (value) => {
        return (
          // <div className="flex gap-2">
          <Space size={[0, 1]} wrap>
            {value?.map((occ) => (
              <Tag>
                <div className="grid grid-cols-2 gap-1">
                  <span className="font-semibold">Name :</span>
                  <span>{occ?.clientOccupant?.name}</span>
                  <span className="font-semibold">
                    Ten. Agrmt. start Date :
                  </span>
                  <span>{new Date(occ?.leaseStartsOn).toDateString()}</span>
                  <span className="font-semibold">Ten. Agrmt. End Date :</span>
                  <span>
                    {occ?.leaseExpiresOn
                      ? new Date(occ?.leaseExpiresOn).toDateString()
                      : ''}
                  </span>
                </div>
              </Tag>
            ))}
          </Space>
          // </div>
        );
      },
    },
    {
      title: 'Ghana Post Address',
      dataIndex: ['property', 'digitalAddress'],
    },
    {
      title: 'Market Value(Previous)',
      dataIndex: ['property', 'propertyValue'],
      render: (propertyValue) => {
        return propertyValue.length > 0
          ? Number(propertyValue[0]?.currentValue).toLocaleString('en-US', {
              style: 'currency',
              currency: 'GHC',
            })
          : '';
      },
    },
    {
      title: 'Market Value(Current)',
      dataIndex: ['property', 'propertyValue'],
      render: (propertyValue) => {
        return propertyValue.length > 0
          ? Number(propertyValue[1]?.currentValue).toLocaleString('en-US', {
              style: 'currency',
              currency: 'GHC',
            })
          : '';
      },
    },
    {
      title: 'Variance(Market Value)',
      dataIndex: ['property', 'propertyValue'],
      render: (propertyValue) => {
        if (propertyValue.length > 0) {
          const variance =
            propertyValue[1]?.currentValue - propertyValue[0]?.currentValue;
          return Number(variance).toLocaleString('en-US', {
            style: 'currency',
            currency: 'GHC',
          });
        }
        return '';
      },
    },
    // {
    //   title: 'Images',
    // },
    {
      title: 'Category/Class Asset',
      dataIndex: ['propertyType', 'name'],
    },
    {
      title: 'Remarks',
    },
    {
      title: 'Current Useful Life',
      dataIndex: 'propertyUnitValue',
      render: (value) => {
        return value[0]?.currentUsefulLife;
      },
    },
  ];

  // const handleExport = () => {
  //   const data = report?.data.records?.map((record) => ({
  //   ...record,
  //   propertyStates :

  //   }));

  //   exportToExcel(
  //     report?.data.records,
  //     columns,
  //     `Report_${new Date().toDateString()}`
  //   );
  // };

  useEffect(() => {
    if (pageNum || reportFilters) {
      refetch();
    }
  }, [pageNum, reportFilters]);

  const _data =
    report &&
    report?.data?.records?.map((r) => ({
      ...r,
      key: r?.id,
    }));

  return (
    <div className="flex flex-col gap-2 w-[90%] mx-auto mt-11">
      <div className="flex justify-between gap-4">
        <h2 className="font-semibold text-gray-600">REPORT</h2>
        <div className="flex gap-4">
          <Tooltip title={'Excel Export'}>
            <AiOutlineFileExcel
              size={30}
              className="text-green-600 cursor-pointer"
              onClick={() => {
                exportToExcel(
                  report?.data.records,
                  columns,
                  `Report_${new Date().toDateString()}`
                );
              }}
            />
          </Tooltip>
          <Tooltip title={'Filter'}>
            <HiOutlineFilter
              className="cursor-pointer text-sky-500"
              size={30}
              // color="#af5c13"
              onClick={() => state.modalSlice.toggleshowReportModal()}
            />
          </Tooltip>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={_data}
        pagination={{
          pageSize: report?.data?.meta?.recordsPerPage,
          total: report?.data?.meta?.totalRecords,
        }}
        onChange={(pagination) => {
          setPageNum(pagination.current);
        }}
        className="scrollbar-hide"
        scroll={{ x: 4000 }}
      />
      {showReportModal && <ReportFilter />}
    </div>
  );
};

export default Report;
