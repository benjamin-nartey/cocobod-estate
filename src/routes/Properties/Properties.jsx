import { useState, useEffect } from "react";

import { useParams } from "react-router-dom/dist";
import { useLocation } from "react-router-dom/dist";

import axiosFetch from "../../axios/axios";
import GridLayout from "../../components/GridLayout/GridLayout";
import ShimmerGrid from "../../components/ShimmerGrid/ShimmerGrid";

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
        return setProperties(response.data);
      } else {
        return setProperties(filter);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  return (
    <>{!loading ? <GridLayout properties={properties} /> : <ShimmerGrid />}</>
  );
}

export default Properties;
