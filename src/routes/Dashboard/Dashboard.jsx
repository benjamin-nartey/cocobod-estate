import { useEffect, useState } from 'react';
import FloatButtonComponent from '../../components/FloatButtonComponent/FloatButtonComponent';
import { axiosInstance } from '../../axios/axiosInstance';
import { initDB, useIndexedDB } from 'react-indexed-db-hook';
import { BsBuildingFillCheck } from 'react-icons/bs';
import { Spin, message } from 'antd';
import { NavLink } from 'react-router-dom';

import { useGetDashboard } from '../../Hooks/query/dashboard';

import ReportLineChart from '../../components/charts/LineChart/ReportLineChart';
import ReportPieChart from '../../components/charts/PieChart/ReportPieChart';
import nodata from '../../assets/nodata.json';
import Lottie from 'lottie-react';
import { useSnapshot } from 'valtio';
import state from '../../store/store';
import { useLocalStorage } from '../../Hooks/useLocalStorage';
import { initializeConfig } from '../../components/indexedDb/dbConfig';
import { reinitializeIndexedDB } from '../../utils/helper';

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

  const [loading, setLoading] = useState(false);

  const {
    add: addPropertyReferenceCategories,
    clear: clearPropertyReferenceCategories,
  } = useIndexedDB('propertyReferenceCategories');

  const { data: dashboard, isLoading } = useGetDashboard();

  let total = 0;

  if (!isLoading) {
    total = dashboard?.data?.pieChartData?.reduce((acc, item) => {
      return item?.propertyCount + acc;
    }, 0);
  }

  const { add: addPropertyReferences, clear: clearPropertyReference } =
    useIndexedDB('propertyReferences');
  const { add: addDistricts, clear: clearDistricts } =
    useIndexedDB('districts');
  const { add: addPolitcalDistricts, clear: clearPoliticalDistricts } =
    useIndexedDB('politcalDistricts');
  const { add: addPolitcalRegions, clear: clearPoliticalRegions } =
    useIndexedDB('politcalRegions');
  const { add: addLocations, clear: clearLocations } =
    useIndexedDB('locations');
  const { add: addPropertyTypes, clear: clearPropertyTypes } =
    useIndexedDB('propertyTypes');
  const { add: addClientOccupants, clear: clearClientOccupants } =
    useIndexedDB('clientOccupants');

  const { getAll: getAllProperty } = useIndexedDB('property');

  useEffect(() => {
    getAllProperty().then((data) => setAllProperty(data));
  }, []);

  const fetchUserAlocation = async () => {
    try {
      const response = await axiosInstance.get('/allocation/me');

      if (response.status === 200) {
        setAllocationData(response.data.region);
        state.auth.currentUser.deployedRegion = response.data.region;
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

  const handleDownloadAllResources = async () => {
    setLoading(true);

    try {
      const [
        propertyRefereceCategoriesResponse,
        propertyReferencesResponse,
        districtsResponse,
        locationsResponse,
        propertyTypesResponse,
        clientOccupantsResponse,
        politicalDistrictResponse,
        PoliticalRegionResponse,
      ] = await Promise.all([
        axiosInstance.get('/property-reference-categories/all', {
          params: {
            regionFilter: auth.currentUser?.deployedRegion?.id,
          },
        }),

        axiosInstance.get('/property-references/all', {
          params: {
            regionFilter: auth.currentUser?.deployedRegion?.id,
          },
        }),

        axiosInstance.get('/district/all', {
          params: {
            regionFilter: auth.currentUser?.deployedRegion?.id,
          },
        }),

        axiosInstance.get('/location/all', {
          params: {
            regionFilter: auth.currentUser?.deployedRegion?.id,
          },
        }),

        axiosInstance.get('/property-types/all', {
          params: {
            regionFilter: auth.currentUser?.deployedRegion?.id,
          },
        }),

        axiosInstance.get('/client-occupants/all', {
          params: {
            regionFilter: auth.currentUser?.deployedRegion?.id,
          },
        }),

        axiosInstance.get('/political-district/all'),
        axiosInstance.get('/political-region/all'),
      ]);

      await Promise.all([
        clearClientOccupants(),
        clearDistricts(),
        clearLocations(),
        clearPoliticalDistricts(),
        clearPropertyReference(),
        clearPropertyReferenceCategories(),
        clearPoliticalRegions(),
        clearPropertyTypes(),
      ]);

      message.success('Successfully cleared all data');

      await Promise.all([
        Promise.all(
          propertyRefereceCategoriesResponse.data.map(async (property) => {
            await addPropertyReferenceCategories({
              id: property?.id,
              name: property?.name,
              propertyType: property?.propertyType,
              location: property?.location,
              division: property?.division,
            });
          })
        ),

        Promise.all(
          propertyReferencesResponse.data.map(async (references) => {
            await addPropertyReferences({
              id: references?.id,
              locationOrTown: references?.locationOrTown,
              lot: references?.lot,
              marketValue: references?.marketValue,
              currentUsefulLife: references?.currentUsefulLife,
              description: references?.description,
              descriptionPerFixedAssetReport:
                references?.descriptionPerFixedAssetReport,
              plotSize: references?.plotSize || null,
              floorSize: references?.floorSize || null,
              division: references?.division,
              propertyReferenceCategory: references?.propertyReferenceCategory,
              region: references?.region,
              // propertyUnit: references?.propertyUnit,
              propertyType: references?.propertyType,
            });
          })
        ),

        Promise.all(
          districtsResponse.data.map(async (district) => {
            await addDistricts({
              id: district?.id,
              name: district?.name,
              regionId: district?.regionId,
              districtType: district?.districtType,
            });
          })
        ),
        Promise.all(
          politicalDistrictResponse.data.map(async (district) => {
            await addPolitcalDistricts({
              id: district?.id,
              name: district?.name,
              politicalRegion: district?.politicalRegion,
            });
          })
        ),
        Promise.all(
          locationsResponse.data.map(async (location) => {
            await addLocations({
              id: location?.id,
              name: location?.name,
              districtId: location?.districtId,
            });
          })
        ),
        Promise.all(
          propertyTypesResponse.data.map(async (propertyType) => {
            await addPropertyTypes({
              id: propertyType?.id,
              name: propertyType?.name,
              attributes: propertyType?.attributes,
            });
          })
        ),
        Promise.all(
          PoliticalRegionResponse.data.map(async (region) => {
            await addPolitcalRegions({
              id: region?.id,
              name: region?.name,
            });
          })
        ),
        Promise.all(
          clientOccupantsResponse.data.map(async (propertyType) => {
            await addClientOccupants({
              id: propertyType?.id,
              name: propertyType?.name,
              category: propertyType?.category,
              email: propertyType?.email,
              phoneNumber: propertyType?.phoneNumber,
            });
          })
        ),
      ]);
      message.success('All data downloaded and persisted successfully');
      setLoading(false);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  {
    return loading ? (
      <Spin size="large" />
    ) : (
      <section className="w-full flex flex-col gap-8 p-6">
        {allocationData && (
          <FloatButtonComponent handleClick={handleDownloadAllResources} />
        )}
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
                <h2 className="text-[#af5c13] font-semibold">
                  Property/Regions
                </h2>
              </div>
              <div className="p-4">
                <h2 className="text-[#af5c13] font-semibold">
                  Total : {total}
                </h2>
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
  }
};

export default Dashboard;
