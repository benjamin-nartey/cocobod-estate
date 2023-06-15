import { data } from "autoprefixer";
import { createContext, useEffect, useState } from "react";
import { useCallback } from "react";

export const PropertyDataContext = createContext({
  propertyData: null,
  setPropertyData: () => null,
});

export const PropertyDataProvider = ({ children }) => {
  const [propertyData, setPropertyData] = useState(null);

  //   const fxnSetProperttData = useCallback((data) => {
  //     setPropertyData(data);
  //   },[]);

  const fxnSetProperttData = (data) => {
    setPropertyData(data);
  };

  useEffect(() => {
    fxnSetProperttData();
  }, []);

  const value = {
    propertyData,
    fxnSetProperttData,
  };
  return (
    <PropertyDataContext.Provider value={value}>
      {children}
    </PropertyDataContext.Provider>
  );
};
