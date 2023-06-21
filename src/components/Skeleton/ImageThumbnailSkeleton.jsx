import React from "react";
import SkeletonElement from "./SkeletonElement";
import Shimmer from "./Shimmer";
// import "./SkeletonElement.style.css";

function ImageThumbnailSkeleton() {
  return (
    <div className="skeleton-wrapper">
        <Shimmer/>
     <div className="w-[11rem] max-sm:w-[300px]">
     <SkeletonElement type= 'image'/>
     </div>
    </div>
  );
}

export default ImageThumbnailSkeleton;
