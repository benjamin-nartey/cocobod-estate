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
            <div className="w-[20rem] bg-[#F4EDE7] absolute left-[50%] translate-x-[75%] translate-y-[-50%] top-[40%] rounded-xl p-8 grid place-items-center">
              <h2 className="text-base text-[#6E431D] mb-4">WELCOME TO</h2>
              <div className=" logo-box mb-8 flex justify-center items-center gap-2">
                <img className="w-[50px] h-auto " src={logo} alt="logo" />
                <div className="line w-[2px] h-[30px] bg-[#6E431D]"></div>
                <h4 className="">
                  <span className="block text-[16px] text-[#6E431D] font-semibold">
                    Ghana Cocoa Board
                  </span>
                  <span className="block text-[8px] text-[#6E431D]">
                    Poised to Maintain Premium Quality Cocoa
                  </span>
                </h4>
              </div>
              <h5 className="text-[#B67F4E] text-[14px] mb-4">
                Login to proceed to the homepage
              </h5>
              <input
                type="text"
                name="email"
                placeholder="Enter Email"
                className="w-full h-[35px] pl-2 bg-transparent border-b-[1px] border-solid border-[#6E431D] focus:outline-none focus:border-b-[2px] mb-4"
              />
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                className="w-full h-[35px] pl-2 bg-transparent border-b-[1px] border-solid border-[#6E431D] focus:outline-none focus:border-b-[2px] mb-4"
              />
              <button className="w-full h-[35px] outline-none bg-[#6E431D] text-white rounded mb-2">
                Login
              </button>
              <div className="w-full">
                <span className="text-xs font-thin text-[#B67F4E] cursor-pointer">
                  Forgot password? reset
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[20%] h-screen bg-[#6E431D]"></div>
      </div>
    </div>
  );
}

export default Authentication;
