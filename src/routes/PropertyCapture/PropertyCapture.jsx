import { useEffect, useState, useContext } from "react";
import PropertyForm from "../../components/PropertyForm/PropertyForm";
import SearchBar from "../../components/SearchBar/SearchBar";
import SearchResultList from "../../components/SearchResultList/SearchResultList.JSX";
import { useIndexedDB } from "react-indexed-db-hook";
import { useParams } from "react-router";
import { PropertyPseudoContext } from "../../context/propertyPseudo.context";

const PropertyCapture = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyReferenceCategories, setPropertyReferenceCategories] =
    useState([]);

  const { setPropertyPseudo } = useContext(PropertyPseudoContext);

  const { records } = useParams();
  useEffect(() => {
    setPropertyPseudo(JSON.parse(records));
  }, [records]);

  // const [propertyReferences, setPropertyReferences] = useState([]);

  const { getAll: getAllPropertyReferenceCategories } = useIndexedDB(
    "propertyReferenceCategories"
  );

  // const { getAll: getAllpropertyReferences } =
  //   useIndexedDB("propertyReferences");

  useEffect(() => {
    getAllPropertyReferenceCategories().then((allPropertyReferenceCategory) => {
      setPropertyReferenceCategories(allPropertyReferenceCategory);
    });

    // getAllpropertyReferences().then((references) => {
    //   setPropertyReferences(references);
    // });
    console.log({ propertyReferenceCategories });
    // console.log(propertyReferences);
  }, []);

  return (
    <>
      {/* <div className="  w-[100%] z-[10] translate-y-[-3rem] sticky top-[22vh] grid place-items-center px-2 ">
        <div className="searchbar-container w-[70%] max-md:w-full m-auto flex flex-col items-center ">
          <SearchBar setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
          <SearchResultList
            resultList={propertyReferenceCategories}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
      </div> */}

      <div className="p-6 grid place-items-center">
        <div className="w-[600px] max-md:w-full bg-white">
          <PropertyForm />
        </div>
      </div>
    </>
  );
};

export default PropertyCapture;
