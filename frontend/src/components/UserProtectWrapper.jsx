import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';

const UserProtectWrapper = ({ children }) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(true);
  
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    let isMounted = true;  // Flag to track if the component is mounted

    if (!token) {
      navigate('/login');
    } else {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BASEURL}/users/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200 && isMounted) {
            setUser(response.data);
          }
        } catch (err) {
          console.error(err);
          localStorage.removeItem('token');
          navigate('/login');
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      fetchUserData();
    }

    return () => {
      isMounted = false;  // Clean up on unmount
    };
  }, [token, navigate, setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{children}</div>;
};

export default UserProtectWrapper;
