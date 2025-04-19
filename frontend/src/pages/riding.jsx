import React from 'react'
import { Link, useLocation } from 'react-router-dom' // Added useLocation
import { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { useNavigate } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'
import axios from 'axios'

const riding = () => {

  const location = useLocation()
  const { ride } = location.state || {} // Retrieve ride data
  const { socket } = useContext(SocketContext)
  const navigate = useNavigate()

  socket.on("ride-ended", () => {
      navigate('/home')
  })
 
  return (
    <div className='h-screen w-screen relative overflow-hidden'>
      <div className=" fixed top-0  z-10 p-4 left-[80%] w-full">
      <Link to='/home' className='top-1 right-1 bg-white h-10 w-10 rounded-full absolute flex items-center justify-center'>
        <i className="text-xl text-medium ri-home-9-fill"></i>
        </Link>
      </div>
        <div className='h-screen w-screen absolute top-0 left-0 z-0'>
                <LiveTracking />
           </div>
        <div className=' flex flex-col justify-end absolute bottom-0 p-3 bg-white w-full'>
        <div className='flex items-center justify-between'>
        <img className='h-16' src={
          ride?.captain.vehicle.vehicleType === 'car' ? 
          'https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg' : 
          ride?.captain.vehicle.vehicleType === 'moto' ? 
          'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648177797/assets/fc/ddecaa-2eee-48fe-87f0-614aa7cee7d3/original/Uber_Moto_312x208_pixels_Mobile.png' : 
          'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png'
        } alt="" />
        <div className=' text-right '>
          <h2 className='text-xl font-medium capitalize'>{ride?.captain.fullname.firstname + " " + ride?.captain.fullname.lastname}</h2>
          <h4 className='text-xl font-semibold -mt-1 -mb-1'> {ride?.captain.vehicle.plate}</h4>
          <p className='text-lg text-gray-600'>{ride?.captain.vehicle.vehicleType}</p>
        </div>
      </div>

      <div className='flex gap-2 justify-between flex-col items-center'>
        <div className='w-full mt-5'>
          
          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>{ride?.destination}</h3>
              {/* <p className='text-sm -mt-1 text-gray-600'>bathinda</p> */}
            </div>
          </div>
          <div className='flex items-center gap-5 p-3'>
            <i className="ri-currency-line"></i>
            <div>
              <h3 className='text-lg font-medium'>₹{ride?.fare}</h3>
              <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
            </div>
          </div>
        </div>
                <Link to='/payment' className='w-full text-center mt-5 bg-green-600 text-white font-semibold text-lg p-2 rounded-lg'>Make a Payement</Link>
            </div>
        </div>
        
    </div>
  )
}

export default riding