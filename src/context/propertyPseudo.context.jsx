import { useState, createContext, useEffect } from "react";

export const PropertyPseudoContext = createContext({
  propertyPseudo: null,
  setPropertyPseudo: () => null,
  handleSetPropertyPseudo: () => null,
});

export const PropertyPseudoProvider = ({ children }) => {
  const [propertyPseudo, setPropertyPseudo] = useState(null);

  const handleSetPropertyPseudo = (state) => {
    // setPropertyPseudo(null);
    setPropertyPseudo(state);
  };

  const value = { propertyPseudo, handleSetPropertyPseudo, setPropertyPseudo };
  return (
    <PropertyPseudoContext.Provider value={value}>
      {children}
    </PropertyPseudoContext.Provider>
  );
};
