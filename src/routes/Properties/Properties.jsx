import React from "react";
import { useState, useEffect } from "react";
import axiosFetch from "../../axios/axios";
import { useParams } from "react-router-dom/dist";
import MasonryLayout from "../../components/MasonryLayout/MasonryLayout";
import { useLocation } from "react-router-dom/dist";
import GridLayout from "../../components/GridLayout/GridLayout";
import ShimmerGrid from "../../components/ShimmerGrid/ShimmerGrid";
import { useQuery } from "@tanstack/react-query";

function Properties() {
  const [properties, setProperties] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
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
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // const fetchProperties = async () => {
  //   const response = await axiosFetch("/properties");
  //   return response.data;
  // };

  // const { status, error, data } = useQuery({
  //   queryKey: ["properties"],
  //   queryFn: fetchProperties,
  // });

  // if (data) {
  //   const filter = data.filter((value) => {
  //     return value.property_type.name
  //       .toLowerCase()
  //       .includes(categoryId?.toLocaleLowerCase());
  //   });
  //   setFilteredList(filter);
  //   if (location.pathname === "/home") {
  //     setProperties(data);
  //   } else {
  //     setProperties(filteredList);
  //   }
  // }

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  return (
    <>{!loading ? <GridLayout properties={properties} /> : <ShimmerGrid />}</>
  );
}

export default Properties;
