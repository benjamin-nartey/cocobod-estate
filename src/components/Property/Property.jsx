import React from "react";

function Property({
  property: { id, name, property_type, location, gallery },
}) {
  return (
    <div className="m-2 bg-transparent rounded-md shadow-md">
      <div className="relative cursor-zoom-in w-auto overflow-hidden transition-all duration-500 ease-in-out">
        <img className="rounded-md w-full" src={gallery[0].url} alt="" />
      </div>
    </div>
  );
}

export default Property;
