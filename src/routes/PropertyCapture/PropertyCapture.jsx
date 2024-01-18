import { useEffect, useState, useContext } from "react";
import PropertyForm from "../../components/PropertyForm/PropertyForm";
import SearchBar from "../../components/SearchBar/SearchBar";
import SearchResultList from "../../components/SearchResultList/SearchResultList";
import { useIndexedDB } from "react-indexed-db-hook";
import { useParams } from "react-router";
import { PropertyPseudoContext } from "../../context/propertyPseudo.context";

const PropertyCapture = () => {
  const { id } = useParams();

  return (
    <>
      <div className="p-6 grid place-items-center">
        <div className="w-[600px] max-md:w-full bg-white">
          <PropertyForm id={id} />
        </div>
      </div>
    </>
  );
};

export default PropertyCapture;
