import { createContext, useEffect, useState } from 'react';
import { useGetAllProperties } from '../Hooks/query/properties';

export const SearchResultContext = createContext({
  searchResult: [],
  setSearchResult: () => [],
});

export const SearchResultProvider = ({ children }) => {
  const [searchResult, setSearchResult] = useState([]);

  const { data: properties } = useGetAllProperties();

  useEffect(() => {
    if (properties?.data) {
      setSearchResult(properties?.data);
    }
  }, [properties?.data]);

  const value = { searchResult, setSearchResult };

  return (
    <SearchResultContext.Provider value={value}>
      {children}
    </SearchResultContext.Provider>
  );
};
