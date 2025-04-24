import React, { useState, useContext } from 'react';
import logo from '../assets/logo.png';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';

const userRegister = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newUser = {
      fullname: {
        firstname,
        lastname,
      },
      email,
      password,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);

      if (response.status === 201) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        navigate('/home');
      }
    } catch (error) {
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
      setFirstname('');
      setLastname('');
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className='px-7 py-4 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-20 my-5' src={logo} alt="Logo" />

        <form onSubmit={submitHandler}>
          <h3 className='text-lg font-medium mb-2'>Enter your Fullname</h3>
          <div className='flex gap-4'>
            <input
              required
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-1/2 text-lg placeholder:text-base'
              type="text"
              placeholder='firstname'
            />
            <input
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-1/2 text-lg placeholder:text-base'
              type="text"
              placeholder='lastname'
            />
          </div>

          <h3 className='text-lg font-medium mb-2'>Enter your email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            type="email"
            placeholder='email@example.com'
          />

          <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            type="password"
            placeholder='password'
          />

          <button
            type='submit'
            disabled={loading}
            className={`bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base ${loading ? 'opacity-60' : ''}`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Registering...
              </div>
            ) : (
              'Register'
            )}
          </button>
        </form>

        <p className='text-center'>
          Already have an account? <Link to='/login' className='text-blue-600'>Login</Link>
        </p>
      </div>

      <div>
        <p className='text-[12px] text-gray-500'>
          By proceeding, you consent to get calls, WhatsApp or SMS/RCS messages, including by automated means, from Uber and its affiliates to the number provided.
        </p>
      </div>
    </div>
  );
};

export default userRegister;
