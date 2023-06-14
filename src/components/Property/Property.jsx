import React from "react";

function Property({
  property: { id, name, property_type, location, gallery },
}) {
  return (
    <div className="m-2 bg-transparent rounded-md shadow-md w-auto max-[3000px]:h-[12rem] max-[2000px]:h-[12rem] max-[1200px]:h-[12rem] max-[1000px]:h-[12rem] max-[500px]:h-[18rem]">
      <div className="relative cursor-pointer w-full overflow-hidden transition-all duration-500 ease-in-out h-full">
        <img
          className="rounded-md w-full h-full object-cover"
          src={gallery[0].url}
          alt=""
        />
        <div
          style={{ backgroundColor: "rgba(244,237,231,0.85)" }}
          className="w-3/4 rounded-bl-md rounded-tr-md absolute bottom-0 h-10 p-1"
        >
          <div className="w-full h-full p-[1px] flex flex-col items-start justify-center">
            <h5 className="text-[15px] font-semibold text-[#6E431D] capitalize">
              {name}
            </h5>
            <span className="text-[12px] text-[#B67F4E] font-normal">
              {location.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Property;
