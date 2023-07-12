import React from "react";
import Map, { Marker, Popup } from "react-map-gl";
import { useState } from "react";
import { useContext } from "react";
import { SearchResultContext } from "../../context/searchResult.context";
import axiosFetch from "../../axios/axios";
import "mapbox-gl/dist/mapbox-gl.css";
import { getCenter } from "geolib";
import { useEffect } from "react";
import { MdLocationPin } from "react-icons/md";
import { useLocalStorage } from "../../Hooks/useLocalStorage";
import { NavLink } from "react-router-dom";

function MapBox({ searchResult }) {
  // const { searchResult, fxnSetResult } = useContext(SearchResultContext);
  // const [centerLatitude, setCenterLatitude] = useState(null);
  // const [centerLongitude, setCenterLongitude] = useState(null);
  const [propertyData, setPropertyData] = useLocalStorage("propertyData", null);
  const [center, setCenter] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState({});
  const [animateBounce, setAnimateBounce] = useState(-1);
  const [sl, setSl] = useState(false);

  // console.log('init', searchResult);

  useEffect(() => {
    const coordinates = searchResult?.map((result) => ({
      latitude: parseFloat(result?.location?.lat),
      longitude: parseFloat(result?.location?.long),
    }));

    setCenter(getCenter(coordinates));
  }, [searchResult]);

  console.log("center", center);

  const [viewState, setViewState] = useState({
    latitude: center && center?.latitude,
    longitude: center && center?.longitude,
    zoom: 6,
  });

  useEffect(() => {
    setViewState({
      latitude: center && center?.latitude,
      longitude: center && center?.longitude,
      zoom: 6,
    });
  }, [center]);

  useEffect(() => {
    if (Object.keys(selectedLocation).length > 0) {
      setSl(true);
    }
    console.log("ssss", selectedLocation);
  }, [selectedLocation]);

  console.log({ viewState });

  const handleBounce = (idx, status) => {};

  return (
    <Map
      {...viewState}
      mapLib={import("mapbox-gl")}
      // initialViewState={viewState}
      // viewState={viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      className="w-full h-full"
      mapStyle="mapbox://styles/brightarhin/clje8v5tp005d01qsaa1ya2u8"
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_API_ACCESS_TOKEN}
    >
      {searchResult &&
        searchResult.map((result, idx) => (
          <div key={result.location.long}>
            <Marker
              longitude={parseFloat(result?.location?.long)}
              latitude={parseFloat(result?.location?.lat)}
              offsetLeft={-20}
              offsetRight={-10}
              onClick={() => setAnimateBounce(idx)}
            >
              <p
                role="image"
                onClick={() => {
                  setSelectedLocation(result);
                  console.log({ selectedLocation });
                }}
                className={`${
                  animateBounce === idx && "animate-bounce"
                } text-xl cursor-pointer`}
              >
                <MdLocationPin color="red" size={25} />
              </p>
            </Marker>

            {sl ? (
              <Popup
               offset={20}
                onClose={() => {
                  setSelectedLocation({});
                  setSl(false);
                }}
                closeOnClick={true}
                latitude={parseFloat(selectedLocation?.location?.lat) || 0}
                longitude={parseFloat(selectedLocation?.location?.long) || 0}
              >
                <div className="min-w-[200px]">
                  <div className="flex justify-between items-center">
                    <div className="inline-block">
                      <span className="font-semibold">Long:</span>
                      {` ${selectedLocation?.location?.long.toFixed(4)}`}
                    </div>
                    <div className="inline-block">
                      <span className="font-semibold">Lat:</span>
                      {` ${selectedLocation?.location?.lat.toFixed(4)}`}
                    </div>
                  </div>
                  <h4 className="capitalize font-semibold text-base">
                    {selectedLocation?.name}
                  </h4>
                  <div className="flex justify-between items-center">
                    <h5 className="capitalize text-sm">{`(${selectedLocation.location.name})`}</h5>
                    <NavLink
                      className="outline-none text-blue-400 hover:underline"
                      to={`/property-detail/${selectedLocation.name}`}
                      onClick={() => setPropertyData(selectedLocation)}
                    >
                      View Property
                    </NavLink>
                  </div>
                </div>
              </Popup>
            ) : (
              false
            )}
          </div>
        ))}
    </Map>
  );
}

export default MapBox;
