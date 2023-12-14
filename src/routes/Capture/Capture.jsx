import { Button, Input, Popconfirm, Table } from "antd";
import React, { useEffect, useState, useContext } from "react";
import { PropertyPseudoContext } from "../../context/propertyPseudo.context";

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

const Capture = () => {
  const [searchText, setSearchText] = useState("");

  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const { getAll: getAllPropertyReferenceCategories } = useIndexedDB(
    "propertyReferenceCategories"
  );
  const { handleSetPropertyPseudo } = useContext(PropertyPseudoContext);

  useEffect(() => {
    getAllPropertyReferenceCategories().then((allPropertyReferenceCategory) => {
      setData(allPropertyReferenceCategory);
    });

    // getAllpropertyReferences().then((references) => {
    //   setPropertyReferences(references);
    // });
    console.log({ data });
    // console.log(propertyReferences);
  }, []);

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

  const snap = useSnapshot(state);
  // const { showEditPropertyModal } = snap.modalSlice;
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return (
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.region.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.propertyType.name)
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Region",
      dataIndex: ["district", "region", "name"],
    },

    {
      title: "Property Type",
      dataIndex: ["propertyType", "name"],
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
                handleSetPropertyPseudo(record);
                navigate(`/property-capture`);
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
      </div>

      <div className="flex flex-col">
        <Input.Search
          placeholder="Search records..."
          onSearch={(value) => setSearchText(value)}
          onChange={(e) => setSearchText(e.target.value)}
        />
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
export default Capture;
