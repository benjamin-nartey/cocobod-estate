import Loader from "../../components/Loader/Loader";

function LoadingPage() {
  return (
    <div className="w-screen h-screen grid items-center">
      <Loader width="w-20" height="h-20" fillColor="fill-[#6E431D]" />
    </div>
  );
}

export default LoadingPage;
