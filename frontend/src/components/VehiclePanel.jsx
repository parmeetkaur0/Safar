import React from 'react'
import Whitecar from '../assets/WhiteCar.png'

const VehiclePanel = (props) => {
  return (
    <div>
         <h5 className='p-1 w-[93%] text-center absolute top-0 ' onClick={()=>{
                  props.setVehiclePanel(false)
                }}>
                    <i className="text-3xl ri-arrow-down-wide-line"></i>
                </h5>
        
                <h3 className='text-2xl font-bold mt-4 mb-5'>Choose a Vehicle  </h3>
                  <div onClick={()=>{
                    props.setConfirmRidePanel(true)
                    props.selectVehicle('car')
                  }}
                  className='w-full flex items-center p-2 border-2 active:border-black bg-gray-100 rounded-xl mb-2 '>
                    <img className='h-14' src={Whitecar} alt="" />
                    <div className=' ml-2 w-1/2'>
                      <h4 className='text-base font-semibold'> Car <span><i className="ri-user-fill"></i>4</span></h4>
                      <h5 className='font-medium text-sm'>2 mins away</h5>
                      <p className='font-normal text-xs text-gray-600'>Affordable, compact rides</p>
                    </div>
                       <h2 className='text-xl font-semibold'>₹{props.fare.car}</h2>
                  </div>
                 
                  <div  onClick={()=>{
                    props.selectVehicle('moto')
                    props.setConfirmRidePanel(true)
                  }}
                  className='w-full flex items-center p-2 border-2 active:border-black bg-gray-100 rounded-xl mb-2 '>
                    <img className='h-14' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648177797/assets/fc/ddecaa-2eee-48fe-87f0-614aa7cee7d3/original/Uber_Moto_312x208_pixels_Mobile.png" alt="" />
                    <div className=' ml-4 w-1/2'>
                      <h4 className='text-base font-semibold'>Moto <span><i className="ri-user-fill"></i>1</span></h4>
                      <h5 className='font-medium text-sm'>3 mins away</h5>
                      <p className='font-normal text-xs text-gray-600'>Affordable, motorcycle rides</p>
                    </div>
                       <h2 className='text-xl ml-2 font-semibold'>₹{props.fare.moto}</h2>
                  </div>
        
                  <div  onClick={()=>{
                    props.setConfirmRidePanel(true)
                    props.selectVehicle('auto')
                  }}
                  className='w-full flex items-center p-2 border-2 active:border-black bg-gray-100 rounded-xl mb-2 '>
                    <img className='h-14' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png" alt="" />
                    <div className=' ml-4 w-1/2'>
                      <h4 className='text-base font-semibold'>Auto <span><i className="ri-user-fill"></i>3</span></h4>
                      <h5 className='font-medium text-sm'>2 mina away</h5>
                      <p className='font-normal text-xs text-gray-600'>Affordable, Auto rides</p>
                    </div>
                       <h2 className='text-xl ml-2 font-semibold'>₹{props.fare.auto}</h2>
                  </div>
    </div>
  )
}

export default VehiclePanel