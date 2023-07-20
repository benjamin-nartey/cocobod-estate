import React from "react";
import { NavLink } from "react-router-dom/dist";
import useRefresh from "../../Hooks/useRefresh";

import { categories } from "../../utils/categories";
import { Outlet } from "react-router-dom/dist";

// const isNotActiveStyle = "hover:text-[#6e431d]";
// const isActiveStyle = "text-[#6e431d] font-semibold";

function Home() {
    const refresh = useRefresh() 
  return (
    <div className="w-full p-5">
      <div className="sticky top-[18vh] z-10 bg-[#F4EDE7] py-3 w-full">
        <h4 className="text-lg text-[#6E431D] font-semibold">Properties</h4>
        <div className="flex flex-wrap gap-8 my-5 capitalize text-gray-400 justify-start items-center">
          {categories.map((category, id) => (
            <NavLink
              key={id}
              className="hover:text-[#6e431d] focus:text-[#6e431d] focus:font-semibold transition-all"
              to={`/home/category/${category.name}`}
            >
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
      <button onClick={()=>refresh()}>Refresh</button>
      <div className="w-full ">
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
