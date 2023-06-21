import React from "react";
import { useState, useEffect } from "react";
import axiosFetch from "../../axios/axios";
import { useParams } from "react-router-dom/dist";
import MasonryLayout from "../../components/MasonryLayout/MasonryLayout";
import { useLocation } from "react-router-dom/dist";
import GridLayout from "../../components/GridLayout/GridLayout";
import ShimmerGrid from "../../components/ShimmerGrid/ShimmerGrid";

function Properties() {
  const [properties, setProperties] = useState([]);
  const { categoryId } = useParams();
  const location = useLocation();

  const fetchData = async () => {
    try {
      const response = await axiosFetch("/properties");
      const filter = await response.data.filter((value) => {
        return value.property_type.name
          .toLowerCase()
          .includes(categoryId?.toLowerCase());
      });
      if (location.pathname !== "/home") {
        setProperties(filter);
      } else {
        setProperties(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(properties);

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  // if (!properties?.length) return <h2>No properties available</h2>;

  return (
    <div className="">
      {properties.length !== 0 ? <GridLayout properties={properties} /> : <ShimmerGrid />}
    </div>
  );
}

export default Properties;