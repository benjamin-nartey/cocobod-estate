import { useContext } from "react";
import { PropertyPseudoContext } from "../../context/propertyPseudo.context";

const SearchResult = ({ result, setSearchTerm }) => {
  const { handleSetPropertyPseudo } = useContext(PropertyPseudoContext);

  return (
    <div
      onClick={() => {
        handleSetPropertyPseudo(result);
        setSearchTerm("");
      }}
      className="py-[10px] px-[20px] cursor-pointer hover:bg-[#efefef]"
    >
      {result.name}
    </div>
  );
};

export default SearchResult;
