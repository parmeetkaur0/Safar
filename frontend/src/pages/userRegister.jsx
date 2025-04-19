import React, {useState , useContext} from 'react'
import logo from '../assets/logo.png'
import axios from 'axios'
import { Link , useNavigate} from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'

const userRegister = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const[ email, setEmail ] = useState('');
  const[ password, setPassword ] = useState('');
  const[userData , setUserData] = useState({});
  const {user, setUser} = useContext(UserDataContext)


  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    const newUser = {
      fullname:{
        firstname,
        lastname
       },
       email,
       password
    }
  const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)

  if(response.status === 201){
    const data = response.data
    setUser(data.user)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('token', data.token)
    navigate('/home')
  }

  setFirstname('')
  setLastname('')
  setEmail('')
  setPassword('')
  }

  return (
    <div className='px-7 py-4 h-screen flex flex-col justify-between'>
    <div>
        <img className='w-20 my-5' src={logo} alt="" /> 
      <form onSubmit={(e) => {
        submitHandler(e)
      }}>
        <h3 className='text-lg font-medium mb-2'>Enter your Fullname</h3>
        <div className='flex gap-4' >
        <input
          required
          value={firstname}
          onChange={(e) => {
            setFirstname(e.target.value)
          }}
          className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-1/2 text-lg placeholder:text-base'
          type="text"
          placeholder='firstname'
        />
         <input
          value={lastname}
          onChange={(e) => {
           setLastname(e.target.value)
          }}
          className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-1/2 text-lg placeholder:text-base'
          type="text"
          placeholder='lastname'
        />
        </div>
        <h3 className='text-lg font-medium mb-2'>Enter your email</h3>
        <input
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
          }}
          className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
          type="email"
          placeholder='email@example.com'
        />

        <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

        <input
          className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
          required type="password"
          placeholder='password'
        />

        <button
          className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
        >Register</button>

      </form>
      <p className='text-center'>Already have a account? <Link to='/login' className='text-blue-600'>Login</Link></p>
    </div>
    <div>
    <p className='text-[12px] text-gray-500 '>By proceeding, you consent to get calls, WhatsApp or SMS/RCS messages, including by automated means, from Uber and its affiliates to the number provided.</p>
    </div>
  </div>
  )
}

export default userRegister