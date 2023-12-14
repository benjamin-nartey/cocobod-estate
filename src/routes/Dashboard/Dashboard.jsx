import { useEffect, useState } from "react";
import FloatButtonComponent from "../../components/FloatButtonComponent/FloatButtonComponent";
import { axiosInstance } from "../../axios/axiosInstance";
import { useIndexedDB } from "react-indexed-db-hook";
import { BsBuildingFillCheck } from "react-icons/bs";
import { message } from "antd";
import Link from "antd/es/typography/Link";
import { NavLink } from "react-router-dom";
import { useLocalStorage } from "../../Hooks/useLocalStorage";

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
  const [currentUserState, setCurrentUserState] = useState("currentUserState");
  const [allocationData, setAllocationData] = useState(null);

  const { add: addPropertyReferenceCategories } = useIndexedDB(
    "propertyReferenceCategories"
  );

  const { add: addPropertyReferences } = useIndexedDB("propertyReferences");
  const { add: addDistricts } = useIndexedDB("districts");
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

  useEffect(() => {
    fetchUserAlocation();
  }, []);
  console.log({ allocationData });

  const handleDownloadAllResources = async () => {
    console.log(allocationData?.region?.id);
    await Promise.all([
      axiosInstance.get("/property-reference-categories/all", {
        params: {
          regionFilter: allocationData?.region?.id,
        },
      }),

      axiosInstance.get("/property-references/all", {
        params: {
          regionFilter: allocationData?.region?.id,
        },
      }),

      axiosInstance.get("/district/all", {
        params: {
          regionFilter: allocationData?.region?.id,
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
    ])
      .then(
        ([
          propertyRefereceCategoriesResponse,
          propertyReferencesResponse,
          districtsResponse,
          locationsResponse,
          propertyTypesResponse,
          clientOccupantsResponse,
        ]) => {
          propertyRefereceCategoriesResponse.data.map((property) => {
            addPropertyReferenceCategories({
              id: property?.id,
              name: property?.name,
              propertyType: property?.propertyType,
              region: property?.region,
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
              plotSize: references?.plotSize,
              floorArea: references?.floorArea,
              division: references?.division,
              propertyReferenceCategory: references?.propertyReferenceCategory,
              region: references?.region,
              propertyUnit: references?.propertyUnit,
              propertyUnitType: references?.propertyUnitType,
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

  return (
    <section className="w-full p-6">
      <FloatButtonComponent handleClick={handleDownloadAllResources} />
      <div className="w-full grid max-[3000px]:grid-cols-4 max-[2000px]:grid-cols-3 max-[1200px]:grid-cols-3 max-[1000px]:grid-cols-2 max-[500px]:grid-cols-1 gap-8  h-auto p-3 ">
        <NavLink to="/properties">
          <Card allProperty={allProperty} />
        </NavLink>
      </div>
    </section>
  );
};

export default Dashboard;
