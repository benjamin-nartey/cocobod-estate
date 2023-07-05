import { createContext, useState, useEffect } from "react";

export const SearchResultContext = createContext({
  searchResult: [],
  setSearchResult: () => [],
});

export const SearchResultProvider = ({ children }) => {
  const [searchResult, setSearchResult] = useState(null);

  const fxnSetResult = (data) => {
    setSearchResult(data);
  };

  useEffect(() => {
    fxnSetResult();
  }, [searchResult]);

  const value = { searchResult, setSearchResult ,fxnSetResult };

  return (
    <SearchResultContext.Provider value={value}>
      {children}
    </SearchResultContext.Provider>
  );
};
