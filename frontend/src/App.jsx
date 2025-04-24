import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Start from './pages/Start'
import CaptainRegister from './pages/CaptainRegister'
import CaptainLogin from './pages/CaptainLogin'
import UserRegister from './pages/userRegister'
import UserLogin from './pages/userLogin'
import Home from './pages/home'
import UserProtectWrapper from './components/UserProtectWrapper'
import UserLogout from './pages/UserLogout'
import CaptainHome from './pages/CaptainHome'
import CaptainLogout from './pages/CaptainLogout'
import CaptainProtectWrapper from './components/CaptainProtectWrapper'
import Riding from './pages/riding'
import CaptainRiding from './pages/CaptainRiding'
import Payment from './pages/Payment'

const App = () => {
  return (
    <div className="w-[375px] mx-auto bg-gradient-to-r from-gray-100 to-blue-100 rounded-md shadow-lg min-h-screen border">
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/captainRegister" element={<CaptainRegister />} />
        <Route path="/captainLogin" element={<CaptainLogin />} />
        <Route path="/userRegister" element={<UserRegister />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path='/riding' element={<Riding />} />
        <Route path='/captainRiding' element={<CaptainRiding />} />
        <Route path='/payment' element={<Payment />} />
        <Route path="/home" element={
            <Home/> }/>
        <Route path='/userLogout' element={
          <UserProtectWrapper>
            <UserLogout />
          </UserProtectWrapper>
          } />
        <Route path='captainHome' element={
          <CaptainProtectWrapper>
              <CaptainHome/>
          </CaptainProtectWrapper>
        } />
        <Route path='captainLogout' element={
          <CaptainProtectWrapper>
              <CaptainLogout/>
          </CaptainProtectWrapper>
        } />
      </Routes>
    </div>
  )
}

export default App
