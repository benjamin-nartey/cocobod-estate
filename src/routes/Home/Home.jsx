import React from "react";
import { NavLink } from "react-router-dom/dist";

import { categories } from "../../utils/categories";
import { Outlet } from "react-router-dom/dist";

// const isNotActiveStyle = "hover:text-[#6e431d]";
// const isActiveStyle = "text-[#6e431d] font-semibold";

function Home() {
  return (
    <div className="w-full p-5">
      <h4 className="text-lg text-[#6E431D] font-semibold">Properties</h4>
      <div className="flex gap-8 my-5 capitalize text-gray-400 justify-start items-center">
        {categories.map((category) => (
          <NavLink
            className="hover:text-[#6e431d] focus:text-[#6e431d] focus:font-semibold transition-all"
            to={`/home/category/${category.name}`}
          >
            {category.name}
          </NavLink>
        ))}
      </div>
      <div className="w-full ">
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
