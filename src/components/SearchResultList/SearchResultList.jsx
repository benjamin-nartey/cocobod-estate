import SearchResult from "../SearchResult/SearchResult";

const SearchResultList = ({
  resultList,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="results-list w-full bg-white shadow-md flex flex-col rounded-sm mt-[0.5rem] max-h-[300px] overflow-y-scroll no-scrollbar">
      {resultList
        .filter((list) => {
          if (searchTerm === "") {
            return "";
          } else if (
            list.name.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            return list;
          }
        })
        .map((result, idx) => (
          <SearchResult
            key={idx}
            result={result}
        
            setSearchTerm={setSearchTerm}
          />
        ))}
    </div>
  );
};

export default SearchResultList;
