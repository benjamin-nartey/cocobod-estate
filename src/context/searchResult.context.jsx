import axiosFetch from "../axios/axios";
import { createContext, useState, useEffect } from "react";

export const SearchResultContext = createContext({
  searchResult: [],
  setSearchResult: () => [],
});

export const SearchResultProvider = ({ children }) => {
  const [searchResult, setSearchResult] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axiosFetch("/properties");
      const results = await response.data;
      if (results) setSearchResult(results);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const value = { searchResult, setSearchResult };

  return (
    <SearchResultContext.Provider value={value}>
      {children}
    </SearchResultContext.Provider>
  );
};
