import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import FinishRide from "../components/FinishRide";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import logo from "../assets/logo.png";
import RideTracking from "../components/RideTracking";
import LiveTracking from "../components/LiveTracking";

const CaptainRiding = () => {
  const location = useLocation();
  const ride = location.state?.ride; // Get ride details from navigation state

  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);

  useGSAP(
    function () {
      if (finishRidePanel) {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [finishRidePanel]
  );

  return (
    <div className="h-screen relative flex flex-col justify-end">
      <div className="fixed top-0 flex p-4 items-center justify-between w-full">
        <img className="w-28" src={logo} alt="Logo" />
        <Link to="/captainLogin" className="bg-white h-10 w-10 rounded-full flex items-center justify-center">
          <i className="text-xl text-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      {/* Pass pickup and destination names to RideTracking */}
      <div className="h-full">
        {ride ? (
          // <RideTracking pickup={ride.pickup} destination={ride.destination} />
          <LiveTracking/>
        ) : (
          <p className="text-center mt-10">No ride details available</p>
        )}
      </div>

      <div className="h-1/5 p-6 flex items-center justify-between relative bg-yellow-400 pt-10"
        onClick={() => setFinishRidePanel(true)}>
        <h5 className="p-1 text-center w-[90%] absolute top-0">
          <i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i>
        </h5>
        <h4 className="text-xl font-semibold">{ride ? `${ride.distance} KM away` : "No distance available"}</h4>
        <button className="bg-green-600 text-white font-semibold p-3 px-10 rounded-lg">
          Complete Ride
        </button>
      </div>

      <div ref={finishRidePanelRef} className="fixed w-full z-[500] bottom-0 translate-y-full bg-white px-3 py-10 pt-12">
        <FinishRide setFinishRidePanel={setFinishRidePanel} ride={ride} />
      </div>
    </div>
  );
};

export default CaptainRiding;
