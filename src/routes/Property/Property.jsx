import { Button, Input, Popconfirm, Table } from "antd";
import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
// import { useGetPaginatedData } from "../../Hooks/query/generics";
// import { getPaginatedProperties } from "../../http/properties";
import { HiEye } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
// import { capitalize } from "../../utils/typography";
import state from "../../store/store";
import { useSnapshot } from "valtio";
import { useIndexedDB } from "react-indexed-db-hook";
import { axiosInstance } from "../../axios/axiosInstance";

// import EditModerationProperties from "../../components/modals/moderation/properties/edit";

const Property = () => {
  const { getAll: getAllProperty } = useIndexedDB("property");
  const [data, setData] = useState([]);

  const { regionId } = useParams();
  const [pageNum, setPageNum] = useState(1);
  // const [paginatedData, props] = useGetPaginatedData(
  //   "getAllProperties",
  //   "",
  //   { pageNum, statusFilter: "ACTIVE" },
  //   getPaginatedProperties //TODO change url
  // );
  // console.log(props.data?.data?.records);
  // const navigate = useNavigate();

  useEffect(() => {
    getAllProperty().then((result) => {
      console.log({ result });
      setData(result);
    });
  }, []);

  const handleUploadAll = () => {
    Promise.allSettled([
      data.map(async (property) => {
        const data = {
          name: property?.name,
          description: property?.description,
          propertyCode: property?.propertyCode,
          digitalAddress: property?.digitalAddress,
          propertyTypeId: property?.propertyTypeId,
          locationId: property?.locationId,
          propertyReferenceCategoryId: property?.propertyReferenceCategoryId,
          arcGisLink: property?.arcGisUrl,
          lat: property?.lat,
          long: property?.long,
          landmark: property?.landmark,
          propertyUnits: property?.propertyUnits,
        };
        return await axiosInstance.post("/properties/field-capture", data);
      }),
    ])
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  };

  const snap = useSnapshot(state);
  // const { showEditPropertyModal } = snap.modalSlice;
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Property Description",
      dataIndex: "description",
      render: (value) => {
        return <p>{value.toLowerCase()}</p>;
      },
    },
    {
      title: "Town",
      dataIndex: ["location", "name"],
    },
    {
      title: "Property Type",
      dataIndex: ["propertyType", "name"],
    },
    {
      title: "Digital Address",
      dataIndex: "digitalAddress",
    },
    {
      title: "Property Code",
      dataIndex: "propertyCode",
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (value, record) => {
        return (
          <div className="flex items-center gap-4">
            <HiEye
              className="text-blue-500 cursor-pointer"
              size={22}
              onClick={() => {
                state.modalSlice.selectedRecord = record;
                navigate(`/property-units-main`);
              }}
            />
            <BiEdit
              size={22}
              className="cursor-pointer text-gray-600"
              onClick={() => {
                state.modalSlice.selectedRecord = record;
                state.modalSlice.toggleshowEditPropertyModal();
              }}
            />
          </div>
        );
      },
    },
  ];
  return (
    <div className="w-[90%] mx-auto mt-8 flex flex-col  gap-3">
      <div className="flex justify-between">
        <h3 className="font-semibold text-slate-500">PROPERTIES</h3>
        <Button onClick={handleUploadAll}>Upload</Button>
      </div>

      <div className="flex flex-col">
        <Input.Search placeholder="Search records..." />
        <Table
          // loading={props?.isLoading}
          columns={columns}
          dataSource={data}
          // pagination={{
          //   pageSize: paginatedData.pageSize,
          //   total: paginatedData.total,
          // }}
          // onChange={(pagination) => {
          //   setPageNum(pagination.current);
          // }}
        />
      </div>
      {/* {showEditPropertyModal && <EditModerationProperties />} */}
    </div>
  );
};
export default Property;
