import { useEffect, useState } from 'react';
import FloatButtonComponent from '../../components/FloatButtonComponent/FloatButtonComponent';
import { axiosInstance } from '../../axios/axiosInstance';
import { useIndexedDB } from 'react-indexed-db-hook';
import { BsBuildingFillCheck } from 'react-icons/bs';
import { message } from 'antd';
import { useState } from 'react';
import { useGetDashboard } from '../../Hooks/query/dashboard';
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
} from '../../assets/icons/icons';
import ReportLineChart from '../../components/charts/LineChart/ReportLineChart';
import ReportPieChart from '../../components/charts/PieChart/ReportPieChart';
import { cn } from '../../utils/helper';
import nodata from '../../assets/nodata.json';
import Lottie from 'lottie-react';

const Card = ({ allProperty }) => {
  return (
    <div className="p-6 bg-white rounded-sm cursor-pointer ">
      <div className="flex items-center gap-4">
        <div className="rounded-full p-4 border">
          <BsBuildingFillCheck size={20} />

          <div className="w-full flex justify-center items-start bg-transparent h-1/2 rounded-2xl">
            <div className=" flex justify-center items-center w-2/4 h-5/6 bg-[#F4EDE7] bg-opacity-40 backdrop-blur rounded-3xl border border-solid border-white border-opacity-50">
              <img
                className="w-1/3 sm:aspect-video md:aspect-video lg:aspect-square xl:aspect-square object-contain"
                src={icon}
                alt={alt}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-4xl">{allProperty?.length}</span>
              <p className="text-sm">Properties</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [allProperty, setAllProperty] = useState([]);

  const { add: addPropertyReferenceCategories } = useIndexedDB(
    'propertyReferenceCategories'
  );

  const { data: dashboard, isLoading } = useGetDashboard();

  let total = 0;

  if (!isLoading) {
    total = dashboard?.data?.pieChartData?.reduce((acc, item) => {
      return item?.propertyCount + acc;
    }, 0);
  }

  const { add: addPropertyReferences } = useIndexedDB('propertyReferences');
  const { add: addDistricts } = useIndexedDB('districts');
  const { add: addLocations } = useIndexedDB('locations');
  const { add: addPropertyTypes } = useIndexedDB('propertyTypes');
  const { add: addClientOccupants } = useIndexedDB('clientOccupants');

  const { getAll: getAllProperty } = useIndexedDB('property');

  useEffect(() => {
    getAllProperty().then((data) => setAllProperty(data));
  }, []);

  const handleDownloadAllResources = async () => {
    await Promise.all([
      axiosInstance.get('/property-reference-categories/all'),

      axiosInstance.get('/property-references/all'),

      axiosInstance.get('/district/all'),

      axiosInstance.get('/location/all'),

      axiosInstance.get('/property-types/all'),
      axiosInstance.get('/client-occupants/all'),
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
              console.log('propertyReferenceCategories downloaded successfully')
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
              console.log('propertyReferences downloaded successfully')
            );
          });

          districtsResponse.data.map((district) => {
            addDistricts({
              id: district?.id,
              name: district?.name,
              regionId: district?.regionId,
              districtType: district?.districtType,
            }).then(() => console.log('districts downloaded successfully'));
          });

          locationsResponse.data.map((location) => {
            addLocations({
              id: location?.id,
              name: location?.name,
              districtId: location?.districtId,
            }).then(() => console.log('locations downloaded successfully'));
          });

          propertyTypesResponse.data.map((propertyType) => {
            addPropertyTypes({
              id: propertyType?.id,
              name: propertyType?.name,
              attributes: propertyType?.attributes,
            }).then(() => console.log('propertyTypes downloaded successfully'));
          });

          clientOccupantsResponse.data.map((propertyType) => {
            addClientOccupants({
              id: propertyType?.id,
              name: propertyType?.name,
              category: propertyType?.category,
              email: propertyType?.email,
              phoneNumber: propertyType?.phoneNumber,
            }).then(() => {
              console.log('clientOccupants downloaded successfully');
              message.success('Resources downloaded successfully');
            });
          });
        }
      )
      .catch((error) => {
        console.error('Error downloading Resources ', error);
      });
  };

  // return (
  //   <section className="w-full p-6">
  //     <FloatButtonComponent handleClick={handleDownloadAllResources} />
  //     <div className="w-full grid max-[3000px]:grid-cols-4 max-[2000px]:grid-cols-3 max-[1200px]:grid-cols-3 max-[1000px]:grid-cols-2 max-[500px]:grid-cols-1 gap-8  h-auto p-3 ">
  //       <Card allProperty={allProperty} />

  return (
    <section className="w-full p-6">
      <div className=" grid grid-cols-2 w-full gap-10">
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
