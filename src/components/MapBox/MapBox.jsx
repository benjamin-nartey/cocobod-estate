import React from "react";
import { Map } from "react-map-gl";
import { useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

function MapBox() {
  const [viewState, setViewState] = useState({
    longitude: -100,
    latitude: 40,
    zoom: 3.5,
  });

  return (
    <Map
      mapLib={import("mapbox-gl")}
      {...viewState}
      onMove={(nextViewState) => setViewState(nextViewState.viewState)}
      className="w-full h-full"
      mapStyle="mapbox://styles/brightarhin/clje8v5tp005d01qsaa1ya2u8"
      mapboxAccessToken="pk.eyJ1IjoiYnJpZ2h0YXJoaW4iLCJhIjoiY2w4OHM3Z3dlMDA0YTNubjFjcWZoYjNnOSJ9.mYzqF1JVp18gZ9-ZUqMXZw"
    />
  );
}

export default MapBox;
