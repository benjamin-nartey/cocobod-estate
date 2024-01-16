import { useEffect, useState } from 'react';
import FloatButtonComponent from '../../components/FloatButtonComponent/FloatButtonComponent';
import { axiosInstance } from '../../axios/axiosInstance';
import { useIndexedDB } from 'react-indexed-db-hook';
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
  const { add: addPolitcalDistricts } = useIndexedDB('politcalDistricts');
  const { add: addPolitcalRegions } = useIndexedDB('politcalRegions');
  const { add: addLocations } = useIndexedDB('locations');
  const { add: addPropertyTypes } = useIndexedDB('propertyTypes');
  const { add: addClientOccupants } = useIndexedDB('clientOccupants');

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
    // console.log(auth.currentUser)?.allocationData.id;
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

      propertyRefereceCategoriesResponse.data.map(async (property) => {
        try {
          await addPropertyReferenceCategories({
            id: property?.id,
            name: property?.name,
            propertyType: property?.propertyType,
            location: property?.location,
            division: property?.division,
          });
        } catch (err) {
          message.error(err.message);
        }
      });

      propertyReferencesResponse.data.map(async (references) => {
        try {
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
        } catch (err) {
          message.error(err.message);
        }
      });

      districtsResponse.data.map(async (district) => {
        try {
          await addDistricts({
            id: district?.id,
            name: district?.name,
            regionId: district?.regionId,
            districtType: district?.districtType,
          });
          message.success(' Districts  downloaded successfully');
        } catch (err) {
          message.error(err.message);
        }
      });

      politicalDistrictResponse.data.map(async (district) => {
        try {
          await addPolitcalDistricts({
            id: district?.id,
            name: district?.name,
            politicalRegion: district?.politicalRegion,
          });
        } catch (err) {
          message.error(err.message);
        }
      });

      PoliticalRegionResponse.data.map(async (region) => {
        try {
          await addPolitcalRegions({
            id: region?.id,
            name: region?.name,
          });
        } catch (err) {
          message.error(err.message);
        }
      });

      locationsResponse.data.map(async (location) => {
        try {
          await addLocations({
            id: location?.id,
            name: location?.name,
            districtId: location?.districtId,
          });
        } catch (err) {
          message.error(err.message);
        }
      });

      propertyTypesResponse.data.map(async (propertyType) => {
        try {
          await addPropertyTypes({
            id: propertyType?.id,
            name: propertyType?.name,
            attributes: propertyType?.attributes,
          });
        } catch (err) {
          message.error(err.message);
        }
      });

      clientOccupantsResponse.data.map(async (propertyType) => {
        try {
          await addClientOccupants({
            id: propertyType?.id,
            name: propertyType?.name,
            category: propertyType?.category,
            email: propertyType?.email,
            phoneNumber: propertyType?.phoneNumber,
          });
        } catch (err) {
          message.error(err.message);
        }
      });

      message.success('PropertyReference Categories downloaded successfully');
      message.success('Property references downloaded successfully');
      message.success('Political Districts downloaded successfully');
      message.success('Politcal regions downloaded successfully');
      message.success('Locations downloaded successfully');
      message.success('Property types downloaded successfully');
      message.success('Client Occupants downloaded successfully');
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // .then(
  //   ([
  //     propertyRefereceCategoriesResponse,
  //     propertyReferencesResponse,
  //     districtsResponse,
  //     locationsResponse,
  //     propertyTypesResponse,
  //     clientOccupantsResponse,
  //     politicalDistrictResponse,
  //     PoliticalRegionResponse,
  //   ]) => {
  //     propertyRefereceCategoriesResponse.data.map((property) => {
  //       addPropertyReferenceCategories({
  //         id: property?.id,
  //         name: property?.name,
  //         propertyType: property?.propertyType,
  //         location: property?.location,
  //         division: property?.division,
  //       })
  //         .then(() =>
  //           message.success(
  //             'propertyReferenceCategories downloaded successfully'
  //           )
  //         )
  //         .catch((err) => message.error(err));
  //     });

  //     propertyReferencesResponse.data.map((references) => {
  //       addPropertyReferences({
  //         id: references?.id,
  //         locationOrTown: references?.locationOrTown,
  //         lot: references?.lot,
  //         marketValue: references?.marketValue,
  //         currentUsefulLife: references?.currentUsefulLife,
  //         description: references?.description,
  //         descriptionPerFixedAssetReport:
  //           references?.descriptionPerFixedAssetReport,
  //         plotSize: references?.plotSize,
  //         floorArea: references?.floorArea,
  //         division: references?.division,
  //         propertyReferenceCategory: references?.propertyReferenceCategory,
  //         region: references?.region,
  //         // propertyUnit: references?.propertyUnit,
  //         propertyType: references?.propertyType,
  //       })
  //         .then(() =>
  //           message.success('propertyReferences downloaded successfully')
  //         )
  //         .catch((error) => message.error(error.message));
  //     });

  //     districtsResponse.data.map((district) => {
  //       addDistricts({
  //         id: district?.id,
  //         name: district?.name,
  //         regionId: district?.regionId,
  //         districtType: district?.districtType,
  //       })
  //         .then(() => message.success('districts downloaded successfully'))
  //         .catch((err) => message.error(err.message));
  //     });

  //     politicalDistrictResponse.data.map((district) => {
  //       addPolitcalDistricts({
  //         id: district?.id,
  //         name: district?.name,
  //         politicalRegion: district?.politicalRegion,
  //       })
  //         .then(() =>
  //           message.success('political districts downloaded successfully')
  //         )
  //         .catch((err) => message.error(err.message));
  //     });

  //     PoliticalRegionResponse.data.map((region) => {
  //       addPolitcalRegions({
  //         id: region?.id,
  //         name: region?.name,
  //       })
  //         .then(() =>
  //           message.success('political region downloaded successfully')
  //         )
  //         .catch((err) => message.error(err.message));
  //     });

  //     locationsResponse.data.map((location) => {
  //       addLocations({
  //         id: location?.id,
  //         name: location?.name,
  //         districtId: location?.districtId,
  //       })
  //         .then(() => message.success('locations downloaded successfully'))
  //         .catch((err) => message.error(err.message));
  //     });

  //     propertyTypesResponse.data.map((propertyType) => {
  //       addPropertyTypes({
  //         id: propertyType?.id,
  //         name: propertyType?.name,
  //         attributes: propertyType?.attributes,
  //       })
  //         .then(() =>
  //           message.success('propertyTypes downloaded successfully')
  //         )
  //         .catch((err) => message.error(err.message));
  //     });

  //     clientOccupantsResponse.data.map((propertyType) => {
  //       addClientOccupants({
  //         id: propertyType?.id,
  //         name: propertyType?.name,
  //         category: propertyType?.category,
  //         email: propertyType?.email,
  //         phoneNumber: propertyType?.phoneNumber,
  //       })
  //         .then(() => {
  //           message.success('clientOccupants downloaded successfully');
  //         })
  //         .catch((err) => message.error(err.message));
  //     });
  //   }
  // )
  // .catch((error) => {
  //   setLoading(false);
  //   message.error('Error downloading Resources ', error);
  // })
  // .finally(() => {
  //   setLoading(false);
  // });

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
