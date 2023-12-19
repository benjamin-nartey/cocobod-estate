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
import CustomSelect from "../../components/CustomSelect/CustomSelect";

// import EditModerationProperties from "../../components/modals/moderation/properties/edit";

const Capture = () => {
  const [searchText, setSearchText] = useState("");

  const [data, setData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [districts, setDistricts] = useState([]);
  const navigate = useNavigate();

  const { getAll: getAllPropertyReferenceCategories } = useIndexedDB(
    "propertyReferenceCategories"
  );

  const { getAll: getAllDistricts } = useIndexedDB("districts");

  const { handleSetPropertyPseudo } = useContext(PropertyPseudoContext);

  const handleChange = (districtType) => {
    let _data = tempData;
    const filteredData = _data.filter(
      (result) => result.district.name === districtType
    );

    setData(filteredData);
  };

  useEffect(() => {
    getAllPropertyReferenceCategories().then((allPropertyReferenceCategory) => {
      setData(allPropertyReferenceCategory);
      setTempData(allPropertyReferenceCategory);
    });

    getAllDistricts().then((allDistricts) => {
      const data = allDistricts.map((district) => {
        return {
          text: district?.name,
          value: district?.name,
        };
      });
      setDistricts(data);
    });
  }, []);
  console.log({ data });
  console.log({ districts });

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
    },
    {
      title: "Region",
      dataIndex: ["district", "region", "name"],
    },
    {
      title: "District",
      dataIndex: ["district", "name"],
      // filters: districts,
      // onFilter: (_, record) => record.district.name.includes(districtType),
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
                // handleSetPropertyPseudo(record);
                navigate(`property-detail-capture/${JSON.stringify(record)}`);
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
        <CustomSelect
          mode="single"
          placeholder="Select district"
          options={districts}
          style={{
            width: "100%",
          }}
          onChange={(e) => handleChange(e)}
        />
        <Table
          rowKey={"id"}
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
