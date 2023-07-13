import React from "react";
import MapBox from "../../components/MapBox/MapBox";
import { useState } from "react";
import { useEffect } from "react";

function PropertyMap() {
  return (
    <div className="inline-flex w-full h-[82vh] overflow-hidden">
      <MapBox />
    </div>
  );
}

export default PropertyMap;
