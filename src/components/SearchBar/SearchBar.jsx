import { BiSearch } from "react-icons/bi";

const SearchBar = ({ setSearchTerm, searchTerm }) => {
  return (
    <div className="input-wrapper bg-white w-full rounded-sm h-[2.5rem] py-[0] px-[15px] flex items-center ">
      <BiSearch id="search-icon" />
      <input
        className="bg-transparent border-none h-full w-full ml-[5px] focus:border-none focus:outline-none placeholder:text-[14px]"
        type="text"
        value={searchTerm}
        placeholder="Type to search..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
