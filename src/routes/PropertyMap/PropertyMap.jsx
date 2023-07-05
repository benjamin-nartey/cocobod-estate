import React from "react";
import MapBox from "../../components/MapBox/MapBox";
import axiosFetch from "../../axios/axios";
import { useState } from "react";
import { useEffect } from "react";

function PropertyMap() {
  const [searchResult, setSearchResult] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axiosFetch("/properties");
      const results = await response.data;
      console.log("results", results);
      if (results) setSearchResult(results);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log("searchResult", searchResult);

  return (
    <div className="inline-flex w-full h-[82vh] overflow-hidden">
      <MapBox searchResult={searchResult} />
    </div>
  );
}

export default PropertyMap;
