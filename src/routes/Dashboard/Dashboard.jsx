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

const Card = ({ icon, thumbnail, alt, className, title, numberOfItems }) => {
  return (
    <div
      className={cn(
        ' flex flex-col justify-between w-full sm:w-full md:w-2/2 lg:w-1/4 xl:w-1/5 mb-4 shadow-md rounded-2xl h-[300px] sm:h-[300px] md:h-[250px] lg:h-[240px] xl:h-[240px] cursor-pointer hover:shadow-xl transition-all ',
        className
      )}
    >
      <div className="w-full flex justify-center items-start bg-transparent h-1/2 rounded-2xl">
        <div className=" flex justify-center items-center w-2/4 h-5/6 bg-[#F4EDE7] bg-opacity-40 backdrop-blur rounded-3xl border border-solid border-white border-opacity-50">
          <img
            className="w-1/3 sm:aspect-video md:aspect-video lg:aspect-square xl:aspect-square object-contain"
            src={icon}
            alt={alt}
          />
        </div>
      </div>
      <div className="w-full flex flex-col justify-between px-4 h-2/5 ">
        <h3 className="font-semibold text-[20px] text-gray-100 ">{title}</h3>
        <div className="flex justify-between items-center py-2">
          <span className="text-base font-medium text-gray-200 ">
            {numberOfItems}
          </span>
          <img className="w-12 h-12" src={thumbnail} alt={alt} />
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  // const [total, setTotal] = useState(0);
  const { data: dashboard, isLoading } = useGetDashboard();

  let total = 0;

  if (!isLoading) {
    total = dashboard?.data?.pieChartData?.reduce((acc, item) => {
      return item?.propertyCount + acc;
    }, 0);
  }

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
