import { Button, Input, Popconfirm, Spin, Table, message } from "antd";
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
import Loader from "../../components/Loader/Loader";
// import EditModerationProperties from "../../components/modals/moderation/properties/edit";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  useAddPropertyPhotos,
  useAddPropertyUploadData,
} from "../../Hooks/useAddFetch";
import { LoadingOutlined } from "@ant-design/icons";

const PropertyUpload = () => {
  const { getAll: getAllProperty } = useIndexedDB("property");
  const { deleteRecord: deletePropertyRecord } = useIndexedDB("property");
  const { getAll: getAllLocations } = useIndexedDB("locations");
  const { getAll: getAllPropertyTypes } = useIndexedDB("propertyTypes");
  const [result, setResult] = useState([]);
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [spinning, setSpinning] = useState(false);
  const { regionId } = useParams();
  const [pageNum, setPageNum] = useState(1);
  const [data, setData] = useState(null);

  const navigate = useNavigate();

  const { mutate } = useAddPropertyUploadData();
  // const { mutate: uploadPhotos } = useAddPropertyPhotos();

  // useEffect(() => {
  //   getAllProperty()
  //     .then((result) => {
  //       console.log({ result });
  //       setResult(result);
  //       return result;
  //     })
  //     .then((data) => {
  //       const location = getAllLocations().then((locations) =>
  //         locations.filter((location) => location === data)
  //       );
  //       setLocation(location);
  //       return data;
  //     });
  // }, []);

  const fetchProperty = () => {
    const fetchedData = getAllProperty()
      .then((result) => {
        const data = result.map((r) => ({
          ...r,
          key: r?.id,
        }));
        console.log({ data });
        setData(data);
        return data;
      })
      .then((data) => {
        const location = getAllLocations().then((locations) =>
          locations.filter((location) => location === data)
        );
        setLocation(location);
        return data;
      });
    return fetchedData;
  };

  const {
    data: property,
    status,
    error,
  } = useQuery(["property-upload"], () => fetchProperty());
  const queryClient = useQueryClient();

  const handleUploadAll = () => {
    setSpinning(true);
    if (property.length === 0) {
      setSpinning(false);
      return;
    }

    Promise.allSettled([
      property.map(async (property) => {
        const propertyData = {
          name: property?.name,
          description: property?.description,
          propertyCode: property?.propertyCode,
          digitalAddress: property?.digitalAddress,
          propertyTypeId: property?.propertyTypeId,
          locationId: property?.locationId,
          propertyReferenceCategoryId: property?.propertyReferenceCategoryId,
          lat: property?.lat,
          long: property?.long,
          landmark: property?.landmark,
          politicalDistrictId: property?.politicalDistrictId,
          propertyUnits: property?.propertyUnits,
        };
        mutate(propertyData, {
          onSuccess: (result) => {
            console.log("Result", result?.data?.id);
            data.map((property) => {
              if (property?.photos?.fileList.length > 0) {
                const formData = new FormData();
                console.log(property.photos);

                property.photos.fileList.forEach((photo) => {
                  formData.append("photos", photo.originFileObj);
                });

                console.log(formData);

                axiosInstance
                  .post(`/properties/${result?.data?.id}/photos`, formData)
                  .then((response) => {
                    message.success("Photos added successfully");
                  })
                  .catch((error) => {
                    message.error(error?.response?.data?.message);
                  });

                // uploadPhotos(
                //   { id: result.data.id, data: formData },
                //   {
                //     onSuccess: () => {
                //       message.success('Photos added successfully');
                //     },

                //     onError: () => {
                //       message.error('Error adding photos');
                //     },
                //   }
                // );
              }

              deletePropertyRecord(property.id)
                .then(() => message.success("Property uploaded successfully"))
                .then(() => queryClient.invalidateQueries("property-upload"))
                .then(() => setSpinning(false));
            });
            setSpinning(false);
          },
          onError: (err) => {
            data.map((property) => console.log(property.photos));
            message.error(err.response?.data?.message);
            setSpinning(false);
          },
        });
      }),
    ]);
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
      dataIndex: ["name"],
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
            <BiEdit
              size={22}
              className="cursor-pointer text-gray-600"
              onClick={() => {
                navigate(`/property-upload/${value}`);
              }}
            />
          </div>
        );
      },
    },
  ];
  return (
    <div className="w-[90%] mx-auto mt-8 flex flex-col  gap-3">
      {spinning && (
        <div className="w-screen h-screen fixed left-0 top-0 z-[99999] bg-[rgba(0,0,0,0.4)] grid place-items-center">
          <Spin
            indicator={
              <LoadingOutlined style={{ fontSize: 48, color: "#6E431D" }} />
            }
            size="large"
            spinning={spinning}
            fullscreen
          />
        </div>
      )}
      <div className="flex justify-between">
        <h3 className="font-semibold text-slate-500">PROPERTIES</h3>
        <button
          onClick={handleUploadAll}
          className="px-3 py-1 max-md:bg-white max-md:text-[#6E431D] max-md:hover:bg-white outline-none bg-[#6E431D] text-white rounded mb-2 hover:bg-[#B67F4E] hover:font-black hover:translate-y-[-2px] active:translate-y-[3px] transition-all hover:shadow-md active:shadow-sm"
        >
          Upload
        </button>
      </div>
      <div className="flex flex-col">
        <Input.Search placeholder="Search records..." />
        <Table
          loading={status === "loading"}
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
export default PropertyUpload;
