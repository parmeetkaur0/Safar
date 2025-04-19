import React from 'react'
import logo from '../assets/logo.png';
import { HiArrowRight } from 'react-icons/hi';
import bgImage from '../assets/Airport-Fall.webp';
import { Link } from 'react-router-dom';
const start = () => {
  return (
    <div>
      <div className="bg-cover bg-right-top h-screen w-full flex justify-between flex-col "
        style={{ backgroundImage: `url(${bgImage})`  }}
      >
          <img className='w-24 m-5' src={logo} alt="" />
        <div className='bg-slate-100 py-3 px-3 '>
          <h2 className='text-2xl text-center font-bold'>Get started with Safar </h2>
          <Link to='/login' className='bg-black mt-5 flex items-center justify-center rounded text-white w-full py-3'>Continue <HiArrowRight className="" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default start