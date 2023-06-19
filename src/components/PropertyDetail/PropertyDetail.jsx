import React, { useContext } from "react";
import { PropertyDataContext } from "../../context/PropertyDataContext/PropertyDataContext";

function PropertyDetail() {
  const { propertyData } = useContext(PropertyDataContext);
  return (
    <div className="w-full h-auto ">
      <div className="flex items-center mb-10 gap-8 text-[#6E431D] text-lg font-semibold w-full bg-[#F4EDE7] sticky top-[7.5rem]">
        <h3>Property Details</h3>
        <div className="line h-6 w-[1px] bg-[#6E431D]"></div>
        <h3>Cocoa Village</h3>
      </div>
      <div className="w-full grid grid-cols-2 gap-4 max-md:flex max-md:flex-col ">
        <div className="description-column">
          <p className="text-sm text-[#6E431D] mb-10">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto,
            totam iure perspiciatis aspernatur a maiores veritatis quos.
            Reiciendis illo quibusdam, ex unde sequi sunt praesentium sed.
            Maiores corporis quam quaerat? Quaerat, odio nesciunt minima iusto
            tempora laborum necessitatibus deserunt culpa labore.
          </p>
          <div className="w-full flex justify-start items-center mb-10">
            <div className="border-solid border-r border-[#6E431D] px-8 grid place-items-center">
              <div>
                <h3 className="text-[15px] text-[#6E431D] font-semibold capitalize">
                  Lease Renewal
                </h3>
                <span className="text-[13px] text-[#6E431D] capitalize">
                  Lease renewal due
                </span>
              </div>
            </div>
            <div className="border-solid border-r border-[#6E431D] px-8 grid place-items-center">
              <div>
                <h3 className="text-[15px] text-[#6E431D] font-semibold capitalize">
                  Current Property Rate
                </h3>
                <span className="text-[13px] text-[#6E431D] capitalize">
                  35% per anum
                </span>
              </div>
            </div>
            <div className="px-8 grid place-items-center">
              <div>
                <h3 className="text-[15px] text-[#6E431D] font-semibold capitalize">
                  Property Type
                </h3>
                <span className="text-[13px] text-[#6E431D] capitalize">
                  Accomodation
                </span>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-start items-center mb-10">
            <div className="border-solid border-r border-[#6E431D] px-8 grid place-items-center">
              <div>
                <h3 className="text-[15px] text-[#6E431D] font-semibold capitalize">
                  Assets
                </h3>
                <span className="text-[13px] text-[#6E431D] capitalize">
                  Lease renewal due
                </span>
              </div>
            </div>
            <div className="border-solid border-r border-[#6E431D] px-8 grid place-items-center">
              <div>
                <h3 className="text-[15px] text-[#6E431D] font-semibold capitalize">
                  Blocks
                </h3>
                <span className="text-2xl text-[#6E431D] capitalize font-normal">
                  350
                </span>
              </div>
            </div>
            <div className="px-8 grid place-items-center">
              <div>
                <h3 className="text-[15px] text-[#6E431D] font-semibold capitalize">
                  Rooms
                </h3>
                <span className="text-2xl text-[#6E431D] capitalize font-normal">
                  500
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="image-column w-full h-full grid place-items-center max-md:p-0">
          <div className="relative w-[25rem] h-[25rem] rounded-md max-md:w-full">
            <img
              className="rounded-md w-full h-full object-cover"
              src={propertyData?.gallery[0].url}
              alt=""
            />
            <div
              style={{ backgroundColor: "rgba(244,237,231,0.85)" }}
              className="w-3/4 rounded-bl-md rounded-tr-md absolute bottom-0 h-10 p-1"
            >
              <div className="w-full h-full p-[1px] flex flex-col items-start justify-center">
                <h5 className="text-[15px] font-semibold text-[#6E431D] capitalize">
                  {propertyData.name.length > 20
                    ? `${propertyData.name.slice(0, 20)}...`
                    : propertyData.name}
                </h5>
                <span className="text-[12px] text-[#B67F4E] font-normal">
                  {propertyData.location.name.length > 20
                    ? `${propertyData.location.name.slice(0, 20)}...`
                    : propertyData.location.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetail;
