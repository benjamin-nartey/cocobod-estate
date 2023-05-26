import React from "react";
import bgImage from "../../assets/bgImage.jpeg";

function Authentication() {
  return (
    <div className="w-screen h-screen bg-[#6E431D]">
      <div className="w-full flex justify-center items-center">
        <div
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            borderRadius: "0 1.5rem 1.5rem 0",
          }}
          className="w-[80%] h-screen bg-[#6E431D] bg-center grid place-items-center"
        >
          <div className="min-w-[80%] h-4/5 flex justify-between items-center ">
              <div className="w-[40rem] h-[25rem] bg-[#F4EDE7] bg-opacity-40 backdrop-blur rounded-xl drop-shadow-lg"></div>
              <div className="w-[20rem] h-[20rem] bg-[#F4EDE7] absolute left-[50%] translate-x-[75%] translate-y-[-50%] top-[40%] rounded-xl"></div>
          </div>
        </div>
        <div className="w-[20%] h-screen bg-[#6E431D]"></div>
      </div>
    </div>
  );
}

export default Authentication;
