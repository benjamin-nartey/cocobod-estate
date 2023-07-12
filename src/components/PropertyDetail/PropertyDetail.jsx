import { useLocalStorage } from "../../Hooks/useLocalStorage";
import { useEffect, useRef, useState } from "react";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { NavLink } from "react-router-dom";

function PropertyDetail() {
  const sliderRef = useRef();
  const [propertyData, setPropertyData] = useLocalStorage("propertyData", null);
  const [endOfScroll, setEndOfScroll] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const onScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, offsetWidth } = sliderRef.current;
      if (
        Number(scrollLeft) === Number(scrollWidth - offsetWidth) ||
        Number(scrollLeft + 1) === Number(scrollWidth - offsetWidth) ||
        Number(scrollLeft - 1) === Number(scrollWidth - offsetWidth)
      ) {
        setEndOfScroll(true);
        console.log("You have reached the end of line");
      } else {
        setEndOfScroll(false);
      }
    }
  };

  const showAllGallery = () => {
    if (propertyData.gallery.length > 15 && endOfScroll === true) {
      setShowAll(true);
    } else {
      setShowAll(false);
    }
  };

  useEffect(() => {
    showAllGallery();
  }, [endOfScroll]);

  const slideLeft = () => {
    let slider = sliderRef.current;
    slider.scrollLeft = slider.scrollLeft - 200;
  };

  const slideRight = () => {
    let slider = sliderRef.current;
    slider.scrollLeft = slider.scrollLeft + 200;
  };

  return (
    <div className="w-full h-auto ">
      <div className="flex py-3 items-center mb-10 gap-8 text-[#6E431D] text-lg font-semibold w-full bg-[#F4EDE7] sticky top-[18vh] z-10">
        <h3>Property Details</h3>
        <div className="line h-6 w-[1px] bg-[#6E431D]"></div>
        <h3>{propertyData?.name}</h3>
      </div>
      <div className="w-full grid grid-cols-2 gap-4 max-md:flex max-md:flex-col ">
        <div className="description-column">
          <p className="text-sm text-[#6E431D] mb-10">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto,
            totam iure perspiciatis aspernatur a maiores veritatis quos.
            Reiciendis illo quibusdam, ex unde sequi sunt praesentium sed.
            Maiores corporis quam quaerat? Quaerat, odio nesciunt minima iusto
            tempora laborum necessitatibus deserunt culpa labore.
          </p>
          <div className="w-full flex justify-start items-center mb-10">
            <div className="border-solid border-r border-[#6E431D] pr-8 grid place-items-center">
              <div>
                <h3 className="text-[15px] text-[#6E431D] font-semibold capitalize">
                  Lease Renewal
                </h3>
                <span className="text-[13px] text-[#6E431D] capitalize">
                  Lease renewal due
                </span>
              </div>
            </div>
            <div className="border-solid border-r border-[#6E431D] px-8 grid place-items-center">
              <div>
                <h3 className="text-[15px] text-[#6E431D] font-semibold capitalize">
                  Current Property Rate
                </h3>
                <span className="text-[13px] text-[#6E431D] capitalize">
                  35% per anum
                </span>
              </div>
            </div>
            <div className="px-8 grid place-items-center">
              <div>
                <h3 className="text-[15px] text-[#6E431D] font-semibold capitalize">
                  Property Type
                </h3>
                <span className="text-[13px] text-[#6E431D] capitalize">
                  Accomodation
                </span>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-start items-center mb-10">
            <div className="border-solid border-r border-[#6E431D] pr-8 grid place-items-center">
              <div>
                <h3 className="text-[15px] text-[#6E431D] font-semibold capitalize">
                  Assets
                </h3>
                <span className="text-[13px] text-[#6E431D] capitalize">
                  Lease renewal due
                </span>
              </div>
            </div>
            <div className="border-solid border-r border-[#6E431D] px-8 grid place-items-center">
              <div>
                <h3 className="text-[15px] text-[#6E431D] font-semibold capitalize">
                  Blocks
                </h3>
                <span className="text-2xl text-[#6E431D] capitalize font-normal">
                  350
                </span>
              </div>
            </div>
            <div className="px-8 grid place-items-center">
              <div>
                <h3 className="text-[15px] text-[#6E431D] font-semibold capitalize">
                  Rooms
                </h3>
                <span className="text-2xl text-[#6E431D] capitalize font-normal">
                  500
                </span>
              </div>
            </div>
          </div>

          <div className="w-full">
            <h3 className="text-[15px] text-[#6E431D] font-semibold capitalize mb-3">
              Photos
            </h3>
            <div className="relative flex items-center">
              <MdChevronLeft
                onClick={slideLeft}
                className="text-[#6E431D] opacity-50 cursor-pointer hover:opacity-100"
                size={30}
              />
              <div
                className="w-full overflow-x-scroll scroll-smooth whitespace-nowrap overflow-y-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                ref={sliderRef}
                id="slider"
                onScroll={onScroll}
              >
                {propertyData.gallery.length > 15
                  ? propertyData.gallery
                      .slice(0, 15)
                      .map((photo, id) => (
                        <LazyLoadImage
                          effect="blur"
                          className="w-[100px] h-[90px] inline-block p-1 rounded-2xl cursor-pointer hover:scale-105 ease-in-out duration-300"
                          src={photo.url}
                          alt="image"
                          key={id}
                          height="90px"
                          width="100px"
                        />
                      ))
                  : propertyData.gallery.map((photo, id) => (
                      <LazyLoadImage
                        effect="blur"
                        className="w-[100px] h-[90px] inline-block p-1 rounded-2xl cursor-pointer hover:scale-105 ease-in-out duration-300"
                        src={photo.url}
                        alt="image"
                        key={id}
                        height="90px"
                        width="100px"
                      />
                    ))}
              </div>
              {showAll ? (
                <div
                  style={{
                    backgroundImage: `url(${
                      propertyData.gallery[
                        Math.floor(Math.random() * propertyData.gallery.length)
                      ].url
                    })`,
                  }}
                  className="w-[100px] h-[90px] rounded-2xl cursor-pointer absolute bg-cover right-0 hover:scale-105 ease-in-out duration-300 z-10"
                >
                  <NavLink className="outline-none" to="/gallery">
                    <div
                      style={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                      className="w-full h-full rounded-2xl grid place-items-center backdrop-blur font-semibold"
                    >
                      Show All
                    </div>
                  </NavLink>
                </div>
              ) : (
                <MdChevronRight
                  onClick={slideRight}
                  className="text-[#6E431D] opacity-50 cursor-pointer hover:opacity-100"
                  size={30}
                />
              )}
            </div>
          </div>
        </div>
        <div className="image-column w-full h-full grid place-items-center max-md:p-0">
          <div className="relative w-[28rem] h-[25rem] max-md:w-full">
            <LazyLoadImage
              effect="blur"
              className="rounded-2xl h-full w-full object-cover"
              src={propertyData?.gallery[0].url}
              alt="property-image"
              height="100%"
              width="100%"
            />
            <div
              style={{ backgroundColor: "rgba(244,237,231,0.85)" }}
              className="w-3/4 rounded-tr-2xl absolute bottom-0 h-12 p-1"
            >
              <div className="w-full h-full p-[1px] flex flex-col items-start justify-center">
                <h5 className="text-[15px] font-semibold text-[#6E431D] capitalize">
                  {propertyData?.name.length > 20
                    ? `${propertyData?.name.slice(0, 20)}...`
                    : propertyData?.name}
                </h5>
                <span className="text-[12px] text-[#B67F4E] font-normal">
                  {propertyData?.location?.name.length > 20
                    ? `${propertyData?.location?.name.slice(0, 20)}...`
                    : propertyData?.location?.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/2 mt-40 max-sm:w-full">
        <div className="flex items-center justify-between">
          <p className="w-[15rem] text-[9px] text-[#6E431D]">
            Cocoa House, 41 Kwame Nkrumah Avenue. P.O. Box 933, Accra Telephone:
            0302661877 . 0302667416 Email Us: civilworks@cocobod.gh
          </p>
          <div className="w-[18rem] h-[6rem] bg-blue-300 border-solid border-2 border-white rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetail;
