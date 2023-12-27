import { useEffect, useState } from "react";
import FloatButtonComponent from "../../components/FloatButtonComponent/FloatButtonComponent";
import { axiosInstance } from "../../axios/axiosInstance";
import { useIndexedDB } from "react-indexed-db-hook";
import { BsBuildingFillCheck } from "react-icons/bs";
import { message } from "antd";
import { NavLink } from "react-router-dom";

import { useGetDashboard } from "../../Hooks/query/dashboard";
import {
  propertiesIcon,
  propertiesThumbnail,
  departmentsIcon,
  departmentThumbnail,
  usersIcon,
  divisionsIcon,
  usersThumbnail,
  divisionsThumbnail,
  rolesIcon,
  rolesThumbnail,
} from "../../assets/icons/icons";
import ReportLineChart from "../../components/charts/LineChart/ReportLineChart";
import ReportPieChart from "../../components/charts/PieChart/ReportPieChart";
import { cn } from "../../utils/helper";
import nodata from "../../assets/nodata.json";
import Lottie from "lottie-react";
import { useSnapshot } from "valtio";
import state from "../../store/store";

const Card = ({ allProperty }) => {
  return (
    <div className="p-6 bg-white rounded-sm cursor-pointer ">
      <div className="flex items-center gap-4">
        <div className="rounded-full p-4 border">
          <BsBuildingFillCheck size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-4xl">{allProperty?.length}</span>
          <p className="text-sm">Properties</p>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [allProperty, setAllProperty] = useState([]);

  const [allocationData, setAllocationData] = useState(null);

  const { add: addPropertyReferenceCategories } = useIndexedDB(
    "propertyReferenceCategories"
  );

  const { data: dashboard, isLoading } = useGetDashboard();

  let total = 0;

  if (!isLoading) {
    total = dashboard?.data?.pieChartData?.reduce((acc, item) => {
      return item?.propertyCount + acc;
    }, 0);
  }

  const { add: addPropertyReferences } = useIndexedDB("propertyReferences");
  const { add: addDistricts } = useIndexedDB("districts");
  const { add: addPolitcalDistricts } = useIndexedDB("politcalDistricts");
  const { add: addPolitcalRegions } = useIndexedDB("politcalRegions");
  const { add: addLocations } = useIndexedDB("locations");
  const { add: addPropertyTypes } = useIndexedDB("propertyTypes");
  const { add: addClientOccupants } = useIndexedDB("clientOccupants");

  const { getAll: getAllProperty } = useIndexedDB("property");

  useEffect(() => {
    getAllProperty().then((data) => setAllProperty(data));
  }, []);

  const fetchUserAlocation = async () => {
    try {
      const response = await axiosInstance.get("/allocation/me");
      console.log({ response });
      console.log(response.data.region.id);

      if (response.status === 200) {
        setAllocationData(response.data.region);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const snap = useSnapshot(state);
  const auth = snap.auth;

  useEffect(() => {
    fetchUserAlocation();
  }, []);
  console.log({ allocationData });

  const handleDownloadAllResources = async () => {
    // console.log(auth.currentUser)?.allocationData.id;
    await Promise.all([
      axiosInstance.get("/property-reference-categories/all", {
        params: {
          regionFilter: auth.currentUser?.allocationData?.id,
        },
      }),

      axiosInstance.get("/property-references/all", {
        params: {
          regionFilter: auth.currentUser?.allocationData?.id,
        },
      }),

      axiosInstance.get("/district/all", {
        params: {
          regionFilter: auth.currentUser?.allocationData?.id,
        },
      }),

      axiosInstance.get("/location/all", {
        params: {
          regionFilter: allocationData?.region?.id,
        },
      }),

      axiosInstance.get("/property-types/all", {
        params: {
          regionFilter: allocationData?.region?.id,
        },
      }),

      axiosInstance.get("/client-occupants/all", {
        params: {
          regionFilter: allocationData?.region?.id,
        },
      }),

      axiosInstance.get("/political-district/all"),
      axiosInstance.get("/political-region/all"),
    ])
      .then(
        ([
          propertyRefereceCategoriesResponse,
          propertyReferencesResponse,
          districtsResponse,
          locationsResponse,
          propertyTypesResponse,
          clientOccupantsResponse,
          politicalDistrictResponse,
          PoliticalRegionResponse,
        ]) => {
          propertyRefereceCategoriesResponse.data.map((property) => {
            addPropertyReferenceCategories({
              id: property?.id,
              name: property?.name,
              propertyType: property?.propertyType,
              district: property?.district,
            }).then(() =>
              console.log("propertyReferenceCategories downloaded successfully")
            );
          });

          propertyReferencesResponse.data.map((references) => {
            addPropertyReferences({
              id: references?.id,
              locationOrTown: references?.locationOrTown,
              lot: references?.lot,
              marketValue: references?.marketValue,
              currentUsefulLife: references?.currentUsefulLife,
              description: references?.description,
              descriptionPerFixedAssetReport:
                references?.descriptionPerFixedAssetReport,
              plotSize: references?.plotSize,
              floorArea: references?.floorArea,
              division: references?.division,
              propertyReferenceCategory: references?.propertyReferenceCategory,
              region: references?.region,
              // propertyUnit: references?.propertyUnit,
              propertyType: references?.propertyType,
            }).then(() =>
              console.log("propertyReferences downloaded successfully")
            );
          });

          districtsResponse.data.map((district) => {
            addDistricts({
              id: district?.id,
              name: district?.name,
              regionId: district?.regionId,
              districtType: district?.districtType,
            }).then(() => console.log("districts downloaded successfully"));
          });

          politicalDistrictResponse.data.map((district) => {
            addPolitcalDistricts({
              id: district?.id,
              name: district?.name,
              politicalRegion: district?.politicalRegion,
            }).then(() =>
              console.log("political districts downloaded successfully")
            );
          });

          PoliticalRegionResponse.data.map((region) => {
            addPolitcalRegions({
              id: region?.id,
              name: region?.name,
            }).then(() =>
              console.log("political region downloaded successfully")
            );
          });

          locationsResponse.data.map((location) => {
            addLocations({
              id: location?.id,
              name: location?.name,
              districtId: location?.districtId,
            }).then(() => console.log("locations downloaded successfully"));
          });

          propertyTypesResponse.data.map((propertyType) => {
            addPropertyTypes({
              id: propertyType?.id,
              name: propertyType?.name,
              attributes: propertyType?.attributes,
            }).then(() => console.log("propertyTypes downloaded successfully"));
          });

          clientOccupantsResponse.data.map((propertyType) => {
            addClientOccupants({
              id: propertyType?.id,
              name: propertyType?.name,
              category: propertyType?.category,
              email: propertyType?.email,
              phoneNumber: propertyType?.phoneNumber,
            }).then(() => {
              console.log("clientOccupants downloaded successfully");
              message.success("Resources downloaded successfully");
            });
          });
        }
      )
      .catch((error) => {
        console.error("Error downloading Resources ", error);
      });
  };

  const cardItems = [
    {
      name: "Properties",
      value: allProperty.length,
      icon: <BsBuildingFillCheck size={20} />,
      link: "/properties",
    },
    {
      name: "Users",
      value: 0,
      icon: <BsBuildingFillCheck size={20} />,
      link: "/users",
    },
    {
      name: "Users",
      value: 0,
      icon: <BsBuildingFillCheck size={20} />,
      link: "/users",
    },
  ];

  return (
    <section className="w-full flex flex-col gap-8 p-6">
      <FloatButtonComponent handleClick={handleDownloadAllResources} />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-auto">
        <NavLink to="/property-upload">
          <Card allProperty={allProperty} />
        </NavLink>
        {/* <Card allProperty={allProperty} />
        <Card allProperty={allProperty} /> */}
      </div>
      <div className=" grid grid-cols-2 w-full gap-10 max-md:flex max-md:flex-col">
        <div className="bg-white">
          <div className="flex justify-between">
            <div className="p-4">
              <h2 className="text-[#af5c13] font-semibold">Property/Regions</h2>
            </div>
            <div className="p-4">
              <h2 className="text-[#af5c13] font-semibold">Total : {total}</h2>
            </div>
          </div>
          <div className="h-[30rem] w-full">
            {dashboard?.data?.pieChartData.length ? (
              <ReportPieChart data={dashboard?.data?.pieChartData} />
            ) : (
              <div className="flex items-center justify-center pt- pt-28">
                <Lottie animationData={nodata} />
              </div>
            )}
          </div>
        </div>

        <div className="bg-white ">
          <div className="p-4">
            <h2 className="text-[#af5c13] font-semibold">
              Property/PropertyType
            </h2>
          </div>
          <div className="h-[30rem] p-4">
            <ReportLineChart data={dashboard?.data?.lineChartData} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
