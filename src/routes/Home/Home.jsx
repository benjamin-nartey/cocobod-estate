import { NavLink } from 'react-router-dom/dist';
import { Outlet } from 'react-router-dom/dist';

import { useGetPropertyTypes } from '../../Hooks/query/propertyType';

function Home() {
  const { data: propertyTypes } = useGetPropertyTypes();

  return (
    <>
      <nav className="sticky top-[18vh] z-10 bg-[#F4EDE7] px-6 py-3 w-full">
        <h4 className="text-lg text-[#6E431D] font-semibold">Properties</h4>
        <div className="flex flex-wrap gap-8 my-5 capitalize text-gray-400 justify-start items-center">
          {propertyTypes?.data.map((category) => (
            <NavLink
              key={category?.id}
              className="hover:text-[#6e431d] focus:text-[#6e431d] focus:font-semibold transition-all"
              to={`/home/category/${category.id}`}
            >
              {category.name}
            </NavLink>
          ))}
        </div>
      </nav>
      <section className="w-full p-5">
        <div className="w-full ">
          <Outlet />
        </div>
      </section>
    </>
  );
}

export default Home;
