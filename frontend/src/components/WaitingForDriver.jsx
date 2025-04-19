import React from 'react'

const WaitingForDriver = (props) => {
  if (!props.ride || !props.ride.captain) {
    return <div>Waiting for ride details...</div>;
  }

  return (
    <div>
      <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
        props.setWaitingForDriver(false)
      }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>

      <div className='flex items-center justify-between'>
        <img className='h-20 ml-10' src={
          props.vehicleType === 'car' ? 
          'https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg' : 
          props.vehicleType === 'moto' ? 
          'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648177797/assets/fc/ddecaa-2eee-48fe-87f0-614aa7cee7d3/original/Uber_Moto_312x208_pixels_Mobile.png' : 
          'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png'
        } alt="" />
        <div className='text-right'>
          <h2 className='text-lg font-medium capitalize'>{props.ride?.captain.fullname?.firstname}</h2>
          <h4 className='text-xl font-semibold -mt-1 -mb-1'>{props.ride?.captain.vehicle.plate}</h4>
          <p className='text-lg text-gray-600'>{props.ride?.captain.vehicle.vehicleType}</p>
          <h1 className='text-lg font-semibold'> <span className='font-bold'>OTP :</span>  {props.ride?.otp}</h1>
        </div>
      </div>

      <div className='flex gap-2 justify-between flex-col items-center'>
        <div className='w-full mt-5'>
          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>{props.ride?.pickup} </h3>
              {/* <p className='text-sm -mt-1 text-gray-600'>gtb nagar</p> */}
            </div>
          </div>
          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>{props.ride?.destination}</h3>
            </div>
          </div>
          <div className='flex items-center gap-5 p-3'>
            <i className="ri-currency-line"></i>
            <div>
              <h3 className='text-lg font-medium'>₹{props.ride?.fare} </h3>
              <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaitingForDriver