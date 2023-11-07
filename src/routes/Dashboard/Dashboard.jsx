import {
  propertiesIcon,
  propertiesThumbnail,
  departmentsIcon,
  departmentThumbnail,
  usersIcon,
  divisionsIcon,
  usersThumbnail,
  divisionsThumbnail,
} from "../../assets/icons/icons";
import { cn } from "../../utils/helper";

const Card = ({ icon, thumbnail, alt, className, title, numberOfItems }) => {
  return (
    <div
      className={cn(
        " flex flex-col justify-between w-full sm:w-full md:w-2/2 lg:w-1/4 xl:w-1/5 mb-4 shadow-md rounded-2xl h-[300px] sm:h-[300px] md:h-[250px] lg:h-[240px] xl:h-[240px] cursor-pointer hover:shadow-xl transition-all ",
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
  return (
    <section className="w-full p-6">
      <div className="flex justify-start items-center w-full flex-wrap gap-10">
        <Card
          title="Properties"
          numberOfItems="21,000"
          icon={propertiesIcon}
          thumbnail={propertiesThumbnail}
          alt="house"
          className="bg-[rgba(160,82,45,.8)]"
        />
        <Card
          title="Departments"
          numberOfItems="300"
          icon={departmentsIcon}
          thumbnail={departmentThumbnail}
          alt="department"
          className="bg-[rgb(204,119,34,.8)]"
        />
        <Card
          title="Divisions"
          numberOfItems="8"
          icon={divisionsIcon}
          thumbnail={divisionsThumbnail}
          alt="divisions"
          className="bg-[rgb(129,65,65,.8)]"
        />
        <Card
          title="Users"
          numberOfItems="12"
          icon={usersIcon}
          thumbnail={usersThumbnail}
          alt="users"
          className="bg-[rgb(192,64,0,.8)]"
        />
      </div>
    </section>
  );
};

export default Dashboard;
