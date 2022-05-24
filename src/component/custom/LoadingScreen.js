import PropTypes from "prop-types"; 

LoadingScreen.propTypes = {
  message: PropTypes.string,
};
export default function LoadingScreen({ message = "loading" }) {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
      
      <div className="">
          <img src = '../../assets/logo.png' width={80} alt = "loading" />
      </div>
      <h2 className="text-center text-white text-xl font-semibold">
        
        {message}
      </h2>
    </div>
  );
}
