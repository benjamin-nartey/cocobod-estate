import React from 'react';
import { useGetRegions } from '../../Hooks/query/regions';
import { useNavigate } from 'react-router-dom';
import { useGetRegionalPropertiesCount } from '../../Hooks/query/moderation';
import waitingAnimation from '../../assets/waiting.json';
import Lottie from 'lottie-react';

const ModerationDashboard = () => {
  const { data: regionalPropertyCount, isLoading } =
    useGetRegionalPropertiesCount();
  console.log(regionalPropertyCount?.data);
  const navigate = useNavigate();

  return regionalPropertyCount?.data.length && !isLoading ? (
    <div>
      <div
        className="grid  grid-cols-3  gap-6 w-[80%] mx-auto mt-7 mb-10"
        style={{ gridTemplateRows: '150px', gridAutoRows: '150px' }}
      >
        {regionalPropertyCount?.data.map((dat) => (
          <div
            key={dat?.id}
            className="w-full h-full  border border-l-gray-300 border-r-gray-300 border-t-gray-300 rounded-md flex items-center cursor-pointer justify-center group hover:bg-[#c9976c] hover:text-white border-b-8 border-[#B67F4E]"
            onClick={() => navigate(`properties/${dat?.region?.id}`)}
          >
            <div className="flex justify-center items-center flex-col group-hover:text-white ">
              <span className="text-xl font-semibold  text-slate-500 group-hover:text-white ">
                {dat?.region?.name}
              </span>
              <span className="text text-8xl text-slate-500 group-hover:text-white">
                {dat?.propertyCount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : !isLoading && regionalPropertyCount?.data.length == 0 ? (
    <div className="flex flex-col gap-y-6 justify-center items-center translate-y-[50%]">
      <Lottie animationData={waitingAnimation} style={{ width: '20%' }} />
      <p className="text-slate-500 font-semibold">No Pending Approvals</p>
    </div>
  ) : null;
};

export default ModerationDashboard;
