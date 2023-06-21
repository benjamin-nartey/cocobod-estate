import ImageThumbnailSkeleton from "../Skeleton/ImageThumbnailSkeleton";

function ShimmerGrid() {
  return (
    <div className="w-full grid max-[3000px]:grid-cols-6 max-[2000px]:grid-cols-5 max-[1200px]:grid-cols-3 max-[1000px]:grid-cols-2 max-[500px]:grid-cols-1">
     {
        [1,2,3,4,5,6,7,8,9,10].map((n)=>(
            <ImageThumbnailSkeleton key={n} className="w-max" />
        ))
     }
    </div>
  );
}

export default ShimmerGrid;
