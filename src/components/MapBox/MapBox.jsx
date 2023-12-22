import React, { useRef, useState, useContext, useEffect } from 'react';

import { NavLink } from 'react-router-dom';

import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getCenter } from 'geolib';

import { MdLocationPin } from 'react-icons/md';

import { SearchResultContext } from '../../context/searchResult.context';

import { useLocalStorage } from '../../Hooks/useLocalStorage';

function MapBox({}) {
  const { searchResult } = useContext(SearchResultContext);
  // const [propertyData, setPropertyData] = useLocalStorage('propertyData', null);
  const [center, setCenter] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState({});
  const [animateBounce, setAnimateBounce] = useState(-1);
  const [sl, setSl] = useState(false);
  const markerRef = useRef();

  const handleClickOutsideMarker = (e) => {
    if (!markerRef?.current?.contains(e.target)) {
      setAnimateBounce(-1);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutsideMarker, true);
  }, []);

  useEffect(() => {
    const coordinates = searchResult?.map((result) => ({
      latitude: parseFloat(result?.lat),
      longitude: parseFloat(result?.long),
    }));

    setCenter(getCenter(coordinates));
  }, [searchResult]);

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
  }, [selectedLocation]);

  return (
    <Map
      {...viewState}
      mapLib={import('mapbox-gl')}
      onMove={(evt) => setViewState(evt.viewState)}
      className="w-full h-full"
      mapStyle="mapbox://styles/brightarhin/clje8v5tp005d01qsaa1ya2u8"
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_API_ACCESS_TOKEN}
    >
      {searchResult &&
        searchResult.map((result, idx) => (
          <div key={result?.long}>
            <Marker
              longitude={Number(result?.long)}
              latitude={Number(result?.lat)}
              offsetLeft={-20}
              offsetRight={-10}
              onClick={() => setAnimateBounce(idx)}
            >
              <p
                ref={markerRef}
                role="image"
                onClick={() => {
                  setSelectedLocation(result);
                }}
                className={`${
                  animateBounce === idx && 'animate-bounce'
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
                latitude={Number(selectedLocation?.lat) || 0}
                longitude={Number(selectedLocation?.long) || 0}
              >
                <div className="min-w-[200px]">
                  <div className="flex justify-between items-center">
                    <div className="inline-block">
                      <span className="font-semibold">Long:</span>
                      {` ${parseFloat(selectedLocation?.long)?.toFixed(4)}`}
                    </div>
                    <div className="inline-block">
                      <span className="font-semibold">Lat:</span>
                      {` ${parseFloat(selectedLocation?.lat)?.toFixed(4)}`}
                    </div>
                  </div>
                  <h4 className="capitalize font-semibold text-base">
                    {selectedLocation?.name}
                  </h4>
                  <div className="flex justify-between items-center">
                    <h5 className="capitalize text-sm">{`(${selectedLocation.location.name})`}</h5>
                    <NavLink
                      className="outline-none text-blue-400 hover:underline"
                      to={`/property-detail/${selectedLocation?.id}`}
                      // onClick={() => setPropertyData(selectedLocation)}
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
