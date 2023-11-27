import { NavLink } from "react-router-dom/dist";

import { useLocalStorage } from "../../Hooks/useLocalStorage";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

function Property({ property }) {
  const [propertyData, setPropertyData] = useLocalStorage("propertyData", null);

  return (
    <NavLink
      to={`/property-detail/${property.name}`}
      onClick={() => setPropertyData(property)}
      className="m-2 bg-transparent rounded-md shadow-md w-auto max-[3000px]:h-[12rem] max-[2000px]:h-[12rem] max-[1200px]:h-[12rem] max-[1000px]:h-[12rem] max-[500px]:h-[18rem]"
    >
      <div className="relative cursor-pointer w-full overflow-hidden transition-all duration-500 ease-in-out h-full">
        <LazyLoadImage
          effect="blur"
          className="rounded-md w-full h-full object-cover"
          src={property.gallery[0].url}
          alt="property-image"
          height="100%"
          width="100%"
        />
        <div
          style={{ backgroundColor: "rgba(244,237,231,0.85)" }}
          className="w-3/4 rounded-bl-md rounded-tr-md absolute bottom-0 h-10 p-1"
        >
          <div className="w-full h-full p-[1px] flex flex-col items-start justify-center">
            <h5 className="text-[15px] font-semibold text-[#6E431D] capitalize">
              {property.name.length > 15
                ? `${property.name.slice(0, 15)}...`
                : property.name}
            </h5>
            <span className="text-[12px] text-[#B67F4E] font-normal">
              {property.location.name.length > 15
                ? `${property.location.name.slice(0, 15)}...`
                : property.location.name}
            </span>
          </div>
        </div>
      </div>
    </NavLink>
  );
}

export default Property;
