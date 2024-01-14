import { Button, Input, Popconfirm, Table, message } from "antd";
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

const PropertyUpload = () => {
  const { getAll: getAllProperty } = useIndexedDB("property");
  const { deleteRecord: deletePropertyRecord } = useIndexedDB("property");
  const { getAll: getAllLocations } = useIndexedDB("locations");
  const { getAll: getAllPropertyTypes } = useIndexedDB("propertyTypes");
  const [result, setResult] = useState([]);
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [loading, setLoading] = useState(false);
  const { regionId } = useParams();
  const [pageNum, setPageNum] = useState(1);

  const { mutate } = useAddPropertyUploadData();
  const  uploadPhotos  = useAddPropertyPhotos();

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
        console.log({ result });
        setResult(result);
        return result;
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

  const { data, status, error } = useQuery(["property-upload"], () =>
    fetchProperty()
  );

  // const handleUploadAll = () => {
  //   setLoading(true);
  //   Promise.allSettled([
  //     data.map(async (property) => {
  //       const data = {
  //         name: property?.name,
  //         description: property?.description,
  //         propertyCode: property?.propertyCode,
  //         digitalAddress: property?.digitalAddress,
  //         propertyTypeId: property?.propertyTypeId,
  //         locationId: property?.locationId,
  //         propertyReferenceCategoryId: property?.propertyReferenceCategoryId,
  //         lat: property?.lat,
  //         long: property?.long,
  //         landmark: property?.landmark,
  //         politicalDistrictId: property?.politicalDistrictId,
  //         propertyUnits: property?.propertyUnits,
  //       };
  //       return await axiosInstance.post("/properties/field-capture", data);
  //     }),
  //   ])
  //     //   .then((response) =>
  //     //     response.forEach((result) => {
  //     //       if (result.status === "fulfilled") {
  //     //         data.map((property) => {
  //     //           deletePropertyRecord(property.id).then(() =>
  //     //             console.log("deleted")
  //     //           );
  //     //         });
  //     //       } else if (result.status === "rejected") {
  //     //         console.log(result.reason);
  //     //       }
  //     //     })
  //     //   )
  //     //   .catch((error) => message.error(error))
  //     .finally(() => {
  //       setLoading(false);
  //       message.success("Properties uploaded successfully");
  //     });
  // };

  const handleUploadAll = () => {
    try {
      setLoading(true);

      Promise.allSettled([
        data.map(async (property) => {
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
              data.map((property) => {
                if (property.photos.fileList.length > 0) {
                  const formData = new FormData();
                  const photoData = property.photos.fileList.forEach(
                    (photo) => {
                      formData.append("photos", photo.originFileObj);
                    }
                  );
                  uploadPhotos.mutate((result.id, photoData), {
                    onSuccess: () => {
                      message.success("Photos added successfully");
                    },

                    onError: () => {
                      message.error("Error adding photos");
                    },
                  });
                }

                const queryClient = useQueryClient();
                deletePropertyRecord(property.id)
                  .then(() => message.success("Property uploaded successfully"))
                  .then(() => queryClient.invalidateQueries("property-upload"))
                  .then(() => setLoading(false));
              });
            },
          });
        }),
      ]);
    } catch (error) {
      message.error(error);
    } finally {
      setLoading(false);
    }
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
                // state.modalSlice.selectedRecord = record;
                // navigate(`/property-units-main`);
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
        <button
          onClick={handleUploadAll}
          className="px-3 py-1 max-md:bg-white max-md:text-[#6E431D] max-md:hover:bg-white outline-none bg-[#6E431D] text-white rounded mb-2 hover:bg-[#B67F4E] hover:font-black hover:translate-y-[-2px] active:translate-y-[3px] transition-all hover:shadow-md active:shadow-sm"
        >
          {loading ? (
            <Loader width="w-5" height="h-5" fillColor="fill-[#6E431D]" />
          ) : (
            "Upload"
          )}
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
