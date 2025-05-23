import spinner from "../assets/svg/Dual Ball@1x-1.5s-200px-200px.svg";
function Spinner() {
  return (
    <div className="flex justify-center items-center bg-black bg-opacity-50 fixed left-0 right-0 bottom-0 top-0 z-50">
      <div>
        <img src={spinner} alt="Loading..." className="h-24" />
      </div>
    </div>
  );
}

export default Spinner;
