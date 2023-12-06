import PropertyForm from "../../components/PropertyForm/PropertyForm";
import SearchBar from "../../components/SearchBar/SearchBar";
import SearchResultList from "../../components/SearchResultList/SearchResultList.JSX";

const PropertyCapture = () => {
  return (
    <>
      <div className="  w-[100%] z-[10] translate-y-[-21%] sticky top-[12%] grid place-items-center p-3 bg-transparent">
        <div className="searchbar-container w-[70%] max-md:w-full m-auto flex flex-col items-center ">
          <SearchBar />
          <SearchResultList />
        </div>
      </div>

      <div className="p-6 grid place-items-center">
        <div className="w-[600px] max-md:w-full bg-white">
          <PropertyForm />
        </div>
      </div>
    </>
  );
};

export default PropertyCapture;
