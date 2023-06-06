import React from "react";
import { NavLink } from "react-router-dom/dist";

import { categories } from "../../utils/categories";
import { Outlet } from "react-router-dom/dist";

function Home() {
  return (
    <div className="w-full p-5">
      <h4 className="text-lg text-[#6E431D] font-semibold">Properties</h4>
      <div className="flex gap-8 my-5 capitalize text-gray-400 justify-start items-center">
        {categories.map((category) => (
          <NavLink
            className="hover:text-[#6E431D] "
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
