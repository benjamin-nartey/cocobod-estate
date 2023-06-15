import React, { useContext } from "react";
import { PropertyDataContext } from "../../context/PropertyDataContext/PropertyDataContext";

function PropertyDetail() {
  const { propertyData } = useContext(PropertyDataContext);
  return (
    <div className="w-full h-max grid grid-cols-2 gap-4 max-sm:flex max-sm:flex-col ">
      <div className="description-column">
        <div className="flex items-center mb-4 gap-8 text-[#6E431D] text-lg font-semibold">
          <h3>Property Details</h3>
          <div className="line h-6 w-[1px] bg-[#6E431D]"></div>
          <h3>Cocoa Village</h3>
        </div>
        <p className="text-sm text-[#6E431D]">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto, totam
          iure perspiciatis aspernatur a maiores veritatis quos. Reiciendis illo
          quibusdam, ex unde sequi sunt praesentium sed. Maiores corporis quam
          quaerat? Quaerat, odio nesciunt minima iusto tempora laborum
          necessitatibus deserunt culpa labore.
        </p>
        <div className="w-full flex justify-evenly items-center"></div>
      </div>
      <div className="image-column w-full h-full grid place-items-center p-10 max-sm:p-0">
        <div className="relative w-[25rem] h-[25rem] bg-red-700 rounded-md max-sm:w-full">
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
  );
}

export default PropertyDetail;
