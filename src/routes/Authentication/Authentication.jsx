import React from "react";
import bgImage from "../../assets/bgImage.jpeg";
import logo from "../../assets/logo-cocobod.png";
import LoginForm from "../../components/LoginForm/LoginForm";

function Authentication() {
  return (
    <div className="w-screen h-screen bg-[#6E431D] max-md:overflow-hidden">
      <div className="w-full flex justify-center items-center max-md:flex-col">
        <div
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className="w-[80%] h-screen bg-[#6E431D] grid place-items-center max-md:w-screen max-md:rounded-r-none max-md:h-[85vh] rounded-r-3xl"
        >
          <div className="min-w-[80%] h-4/5 flex justify-between items-center">
            <div className="w-[40rem] h-[25rem] bg-[#F4EDE7] bg-opacity-40 backdrop-blur rounded-xl drop-shadow-lg grid place-items-center translate-y-[-40px] max-md:w-full max-md:bg-transparent max-md:backdrop-blur-0">
              <div className="w-[400px]">
                <div className="logo-container flex flex-col justify-center items-center w-[180px] max-md:absolute max-md:left-[50%] max-md:translate-x-[-50%] max-md:translate-y-[-50%] max-md:top-[8%]">
                  <img
                    src={logo}
                    alt="logo"
                    className="block h-[auto] w-[80px] max-md:w-[60px]"
                  />
                  <span className="block text-base font-semibold text-white mb-8 max-md:font-normal">
                    Ghana Cocoa Board
                  </span>
                </div>
                <div className="flex flex-col max-md:hidden">
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
            <div className="w-[20rem] bg-[#F4EDE7] absolute right-[11%] top-[18%] rounded-xl p-8 grid place-items-center max-md:translate-x-[-50%] max-md:translate-y-[-50%] max-md:left-[50%] max-md:w-screen max-md:bg-transparent max-md:top-[60%]">
              <h2 className="text-base text-[#6E431D] mb-4 max-md:hidden">
                WELCOME TO
              </h2>
              <div className=" logo-box mb-8 flex justify-center items-center gap-2 max-md:hidden">
                <img className="w-[50px] h-auto " src={logo} alt="logo" />
                <div className="line w-[1.5px] h-[30px] bg-[#6E431D]"></div>
                <h4 className="">
                  <span className="block text-[16px] text-[#6E431D] font-semibold">
                    Ghana Cocoa Board
                  </span>
                  <span className="block text-[8px] text-[#6E431D]">
                    Poised to Maintain Premium Quality Cocoa
                  </span>
                </h4>
              </div>
              <h5 className="text-[#B67F4E] text-[14px] mb-4 max-md:hidden">
                Login to proceed to the homepage
              </h5>
              <LoginForm />
            </div>
          </div>
        </div>
        <div className="w-[20%] h-screen bg-[#6E431D] max-md:hidden"></div>
      </div>
    </div>
  );
}

export default Authentication;
