import React from "react";
import { useLocalStorage } from "../../Hooks/useLocalStorage";
import MasonryLayout from "../../components/MasonryLayout/MasonryLayout";

function Gallery() {
  const [propertyData, setPropertyData] = useLocalStorage("propertyData", null);

  return (
    <div className="w-full relative p-2">
      <MasonryLayout>
        {propertyData.gallery.map((property, id) => (
          <div key={id} className="relative cursor-pointer w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out p-2">
            {<img src={property.url} className="w-max h-auto rounded-lg" />}
          </div>
        ))}
      </MasonryLayout>
    </div>
  );
}

export default Gallery;
