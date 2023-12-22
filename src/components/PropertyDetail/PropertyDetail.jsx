import { useEffect, useRef, useState, useContext } from 'react';

import { NavLink, useParams } from 'react-router-dom';

import { MdChevronRight, MdChevronLeft, MdLocationOff } from 'react-icons/md';

import { useLocalStorage } from '../../Hooks/useLocalStorage';
import { SearchResultContext } from '../../context/searchResult.context';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useGetProperty } from '../../Hooks/query/properties';
// import { useGetPropertyUnits } from '../../Hooks/query/propertyUnits';
import { useGetPropertyUnitsForProperty } from '../../Hooks/query/properties';

function PropertyDetail() {
  const sliderRef = useRef();
  // const [propertyData, setPropertyData] = useLocalStorage('propertyData', null);
  const [endOfScroll, setEndOfScroll] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const { setSearchResult } = useContext(SearchResultContext);

  const { propId } = useParams();

  const { data: property } = useGetProperty(propId);

  const propertyId = property?.data?.id;

  const { data: propertyUnits } = useGetPropertyUnitsForProperty(
    {
      propertyFilter: propertyId,
    },
    {
      enabled: !!propertyId,
    }
  );

  const onScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, offsetWidth } = sliderRef.current;
      if (
        Number(scrollLeft) === Number(scrollWidth - offsetWidth) ||
        Number(scrollLeft + 1) === Number(scrollWidth - offsetWidth) ||
        Number(scrollLeft - 1) === Number(scrollWidth - offsetWidth)
      ) {
        setEndOfScroll(true);
      } else {
        setEndOfScroll(false);
      }
    }
  };

  const showAllGallery = () => {
    if (property?.data?.photos?.length > 15 && endOfScroll === true) {
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

  // console.log(first)

  return (
    <div className="w-full h-auto ">
      <div className="flex py-3 items-center mb-10 gap-8 text-[#6E431D] text-lg font-semibold w-full bg-[#F4EDE7] sticky top-[18vh] z-10">
        <h3>Property Details</h3>
        <div className="line h-6 w-[1px] bg-[#6E431D]"></div>
        <h3>{property?.data?.name}</h3>
      </div>
      <div className="w-full grid grid-cols-2 gap-4 max-md:flex max-md:flex-col ">
        <div className="description-column">
          <p className="text-sm text-[#6E431D] mb-10">
            {property?.data?.description ? (
              property?.data?.description
            ) : (
              <span className="">Property has no description yet</span>
            )}
          </p>
          <div className="w-full flex justify-start items-center mb-10">
            <div className="border-solid border-r border-[#6E431D] pr-8 grid place-items-center">
              <div className="">
                <h3 className="text-[15px] text-[#6E431D] font-semibold capitalize">
                  Digital Address
                </h3>
                <span className="text-[13px] text-[#6E431D] capitalize">
                  {property?.data?.digitalAddres ? (
                    property?.data?.digitalAddress
                  ) : (
                    <span>&nbsp;</span>
                  )}
                </span>
              </div>
            </div>
            <div className="border-solid border-r border-[#6E431D] px-8 grid place-items-center">
              <div>
                <h3 className="text-[15px] text-[#6E431D] font-semibold capitalize">
                  Property Code
                </h3>
                <span className="text-[13px] text-[#6E431D] capitalize">
                  {property?.data?.propertyCode ? (
                    property?.data?.propertyCode
                  ) : (
                    <span>&nbsp;</span>
                  )}
                </span>
              </div>
            </div>
            <div className="px-8 grid place-items-center">
              <div>
                <h3 className="text-[15px] text-[#6E431D] font-semibold capitalize">
                  Property Type
                </h3>
                <span className="text-[13px] text-[#6E431D] capitalize">
                  {property?.data?.propertyType?.name ? (
                    property?.data?.propertyType?.name
                  ) : (
                    <span>&nbsp;</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-start items-center mb-10">
            <div className="border-solid border-r border-[#6E431D] pr-8 grid place-items-center">
              <div>
                <h3 className="text-[15px] text-[#6E431D] font-semibold capitalize">
                  LandMark
                </h3>
                <span className="text-[13px] text-[#6E431D] capitalize">
                  {property?.data?.landmark ? (
                    property?.data?.landmark
                  ) : (
                    <span>&nbsp;</span>
                  )}
                </span>
              </div>
            </div>
            <div className="border-solid border-r border-[#6E431D] px-8 grid place-items-center">
              <div>
                <h3 className="text-[15px] text-[#6E431D] font-semibold capitalize">
                  PropertyUnits
                </h3>
                <span className="flex justify-center text-2xl text-center text-[#6E431D] capitalize font-normal">
                  {propertyUnits?.data?.length ? (
                    propertyUnits?.data?.length
                  ) : (
                    <span>0</span>
                  )}
                </span>
              </div>
            </div>
            <div className="px-8 grid place-items-center">
              <div>
                <h3 className="text-[15px] text-[#6E431D] font-semibold capitalize">
                  Town
                </h3>
                <span className="text-[15px] text-[#6E431D] capitalize font-normal">
                  {property?.data?.location?.name ? (
                    property?.data?.location?.name
                  ) : (
                    <span>&nbsp;</span>
                  )}
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
                {property?.data?.photos?.length > 15
                  ? property?.data?.photos?.slice(0, 15)?.map((photo, id) => (
                      <LazyLoadImage
                        effect="blur"
                        className=" w-[6rem] h-[6rem] inline-block rounded-2xl p-1  cursor-pointer hover:scale-105 ease-in-out duration-300 object-cover"
                        src={photo.url}
                        alt="image"
                        key={id}
                        // height="90px"
                        // width="100px"
                      />
                    ))
                  : property?.data?.photos.map((photo, id) => (
                      <LazyLoadImage
                        effect="blur"
                        className="w-[6rem] h-[6rem] inline-block p-1 rounded-2xl cursor-pointer hover:scale-105 ease-in-out duration-300 object-cover "
                        src={photo.url}
                        alt="image"
                        key={id}
                        // height="90px"
                        // width="100px"
                      />
                    ))}
              </div>
              {showAll ? (
                <div
                  style={{
                    backgroundImage: `url(${
                      property?.data?.photos[
                        Math.floor(
                          Math.random() * property?.data?.photos.length
                        )
                      ].url
                    })`,
                  }}
                  className="w-[100px] h-[90px] rounded-2xl cursor-pointer absolute bg-cover right-0 hover:scale-105 ease-in-out duration-300 z-10"
                >
                  <NavLink className="outline-none" to="/gallery">
                    <div
                      style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
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
              src={property?.data?.photos[0]?.url}
              alt="property-image"
              height="100%"
              width="100%"
            />
            <div
              style={{ backgroundColor: 'rgba(244,237,231,0.85)' }}
              className="w-3/4 rounded-tr-2xl absolute bottom-0 h-12 p-1"
            >
              <div className="w-full h-full p-[1px] flex flex-col items-start justify-center">
                <h5 className="text-[15px] font-semibold text-[#6E431D] capitalize">
                  {property?.data?.name.length > 20
                    ? `${property?.data?.name.slice(0, 20)}...`
                    : property?.data?.name}
                </h5>
                <span className="text-[12px] text-[#B67F4E] font-normal">
                  {property?.data?.location?.name.length > 20
                    ? `${property?.data?.location?.name.slice(0, 20)}...`
                    : property?.data?.location?.name}
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
          <div className="w-[18rem] h-[6rem] hover:shadow-lg border-solid border-2 border-white rounded-2xl">
            {property?.data?.long && property?.data.lat ? (
              <NavLink
                onClick={() => setSearchResult([property?.data])}
                to="/map"
              >
                <img
                  className="inline-block w-full h-full object-cover rounded-2xl"
                  src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${Number(
                    property?.data?.long
                  )},${Number(
                    property?.data?.lat
                  )},6,0/300x200@2x?access_token=${
                    import.meta.env.VITE_MAPBOX_API_ACCESS_TOKEN
                  }`}
                  alt=""
                />
              </NavLink>
            ) : (
              <div className=" flex  flex-col justify-center items-center gap-2 translate-y-[20%]">
                <MdLocationOff className=" text-[#6E431D]" size={32} />
                <span className=" text-xs font-semibold text-[#6E431D] ">
                  No Location Information
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetail;
