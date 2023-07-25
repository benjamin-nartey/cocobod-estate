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
  const [loading, setLoading] = useState(false);
  const { categoryId } = useParams();
  const location = useLocation();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosFetch("/properties");
      const filter = await response.data.filter((value) => {
        return value.property_type.name
          .toLowerCase()
          .includes(categoryId?.toLowerCase());
      });
      if (location.pathname === "/home") {
        setProperties(response.data);
        setLoading(false);
      } else {
        setProperties(filter);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  return (
    <div className="">
      {!loading ? <GridLayout properties={properties} /> : <ShimmerGrid />}
    </div>
  );
}

export default Properties;
