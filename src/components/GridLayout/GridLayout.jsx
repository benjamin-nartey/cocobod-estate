import React from "react";
import Property from "../Property/Property";

function GridLayout({properties}) {
  return (
    <div className="w-full grid max-[3000px]:grid-cols-6 max-[2000px]:grid-cols-5 max-[1200px]:grid-cols-3 max-[1000px]:grid-cols-2 max-[500px]:grid-cols-1">
        {properties?.map((property, id)=>(
              <Property key={id} property={property} className="w-max" /> 
        ))}
    </div>
  );
}

export default GridLayout;
