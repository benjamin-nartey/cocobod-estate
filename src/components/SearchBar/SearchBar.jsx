import { BiSearch } from "react-icons/bi";
import { useState } from "react";
import axios from "axios";

const SearchBar = () => {
  const [input, setInput] = useState("");
  const [page, setPage] = useState(1);
  const refreshToken = JSON.parse(localStorage.getItem("refreshToken"));
  const api = axios.create({
    baseURL: "http://192.168.0.178:3000/api/v1/",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  const fetchData = (value) => {
    api.get("/property-reference-categories", {
      params: {
        pageNum: pageNum,
        search: value,
      },
    });
  };
  return (
    <div className="input-wrapper bg-white w-full rounded-[10px] h-[2.5rem] shadow-md py-[0] px-[15px] flex items-center ">
      <BiSearch id="search-icon" />
      <input
        className="bg-transparent border-none h-full w-full ml-[5px] focus:border-none focus:outline-none"
        type="text"
        value={input}
        placeholder="Type to search..."
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
