import React, { createContext, useEffect, useState } from 'react'

export const UserDataContext = createContext()


const UserContext = ({ children }) => {


    // const [ user, setUser ] = useState({
    //     email: '',
    //     fullname: {
    //         firstname: '',
    //         lastname: ''
    //     }
    // })

    const [user, setUser] = useState(null); // Initialize with null

    // Fetch user from localStorage or API
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser._id) {
            console.log(storedUser._id);
            setUser(storedUser); // Set user if found
        }
    }, []);

    return (
        <div>
            <UserDataContext.Provider value={{ user, setUser }}>
                {children}
            </UserDataContext.Provider>
        </div>
    )
}

export default UserContext