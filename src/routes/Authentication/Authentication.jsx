import React from "react";
import bgImage from "../../assets/bgImage.jpeg";
import logo from "../../assets/logo-cocobod.png";

function Authentication() {
  return (
    <div className="w-screen h-screen bg-[#6E431D]">
      <div className="w-full flex justify-center items-center">
        <div
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            borderRadius: "0 1.5rem 1.5rem 0",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className="w-[80%] h-screen bg-[#6E431D] grid place-items-center"
        >
          <div className="min-w-[80%] h-4/5 flex justify-between items-center ">
            <div className="w-[40rem] h-[25rem] bg-[#F4EDE7] bg-opacity-40 backdrop-blur rounded-xl drop-shadow-lg grid place-items-center translate-y-[-40px]">
              <div className="w-[400px]">
                <div className="logo-container flex flex-col justify-center items-center w-[180px]">
                  <img
                    src={logo}
                    alt="logo"
                    className="block h-[auto] w-[80px]"
                  />
                  <span className="block text-base font-semibold text-white mb-8">
                    Ghana Cocoa Board
                  </span>
                </div>
                <div className="flex flex-col">
                  <h2>
                    <span className="block text-[4.2rem] text-white">
                      Welcome
                    </span>
                    <span className="block text-base tracking-widest font-thin text-white">
                      to the Ghana Cocobod Estate App
                    </span>
                  </h2>
                </div>
              </div>
            </div>
            <div className="w-[20rem] h-[20rem] bg-[#F4EDE7] absolute left-[50%] translate-x-[75%] translate-y-[-50%] top-[40%] rounded-xl"></div>
          </div>
        </div>
        <div className="w-[20%] h-screen bg-[#6E431D]"></div>
      </div>
    </div>
  );
}

export default Authentication;
