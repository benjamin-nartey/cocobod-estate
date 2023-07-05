import React from "react";
import Map, { Marker } from "react-map-gl";
import { useState } from "react";
import { useContext } from "react";
import { SearchResultContext } from "../../context/searchResult.context";
import axiosFetch from "../../axios/axios";
import "mapbox-gl/dist/mapbox-gl.css";
import { getCenter } from "geolib";
import { useEffect } from "react";

const defaultViewState = {
  latitude: 0,
  longitude: 0,
  zoom: 6,
};

function MapBox({ searchResult }) {
  // const { searchResult, fxnSetResult } = useContext(SearchResultContext);
  // const [centerLatitude, setCenterLatitude] = useState(null);
  // const [centerLongitude, setCenterLongitude] = useState(null);
  const [center, setCenter] = useState(null);
  console.log("init", searchResult);

  const coordinates = searchResult?.map((result) => ({
    latitude: Number(result?.location?.lat),
    longitude: Number(result?.location?.long),
  }));

  useEffect(() => {
    setCenter(getCenter(coordinates));
  }, [center]);

  console.log("center", center);

  const [viewState, setViewState] = useState({
    latitude: center && center?.latitude,
    longitude: center && center?.longitude,
    zoom: 6,
  });

  console.log({ viewState });

  return (
    <Map
      {...viewState}
      mapLib={import("mapbox-gl")}
      // initialViewState={viewState}
      // viewState={viewState}
      // onMove={(evt) => setViewState(evt.viewState)}
      className="w-full h-full"
      mapStyle="mapbox://styles/brightarhin/clje8v5tp005d01qsaa1ya2u8"
      mapboxAccessToken="pk.eyJ1IjoiYnJpZ2h0YXJoaW4iLCJhIjoiY2w4OHM3Z3dlMDA0YTNubjFjcWZoYjNnOSJ9.mYzqF1JVp18gZ9-ZUqMXZw"
    />
  );
}

export default MapBox;
