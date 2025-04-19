import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import mapImage from '../assets/map.gif'
import logo from '../assets/logo.png'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import LiveTracking from '../components/LiveTracking';

const Home = () => {
    const [input, setInput] = useState('');
    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');
    const [panelOpen, setPanelOpen] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const [vehiclePanel, setVehiclePanel] = useState(false)
    const [confirmRidePanel, setConfirmRidePanel] = useState(false)
    const [vehicleFound, setVehicleFound] = useState(false)
    const [waitingForDriver, setWaitingForDriver] = useState(false)
    const [pickupSuggestions, setPickupSuggestions] = useState([])
    const [destinationSuggestions, setDestinationSuggestions] = useState([])
    const [activeField, setActiveField] = useState(null)
    const [fare, setFare] = useState({})
    const [vehicleType, setVehicleType] = useState(null)
    const [ride, setRide] = useState(null)

    const navigate = useNavigate()

    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)


    useEffect(() => {
        if (user && user._id) {
            console.log("Joining socket as user:", user._id);
            socket.emit("join", { userType: "user", userId: user._id });
        } else {
            console.warn("User is not ready yet!");
        }

        // Listen for 'find-captain' event
        socket.on('find-captain', ({ rideId }) => {
            console.log('Received find-captain event for ride:', rideId);
            // Update UI to show "Looking for Driver" state
            setVehicleFound(true);
        });

        // Listen for 'ride-confirmed' event
        socket.on('ride-confirmed', ride => {
            console.log('Ride confirmed:', ride);
            setVehicleFound(false);
            setWaitingForDriver(true);
            setRide(ride);
        });

        socket.on('ride-started', ride => {
            console.log("ride")
            setWaitingForDriver(false)
            navigate('/riding', { state: { ride } }) // Updated navigate to include ride data
        })

        // Clean up listeners on component unmount
        return () => {
            socket.off('find-captain');
            socket.off('ride-confirmed');
            socket.off('ride-started');
        };
    }, [socket, user]);

    async function findTrip() {
        setVehiclePanel(true)
        setPanelOpen(false)

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
            params: { pickup, destination },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })


        setFare(response.data)


    }

    async function createRide() {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
                pickup,
                destination,
                vehicleType
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            console.log('Ride created:', response.data);
            setRide(response.data );
            socket.emit('new-ride', response.data);
        } catch (error) {
            console.error('Error creating ride:', error);
            // Handle error (e.g., show error message to user)

        }

    }



    const debouncedHandlePickupChange = useCallback(
        debounce(async (inputValue) => {
            if (inputValue.length < 3) {
                setPickupSuggestions([]);
                return;
            }
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                    params: { input: inputValue },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (response.data && Array.isArray(response.data.data)) {
                    setPickupSuggestions(response.data.data);
                } else {
                    console.warn('Unexpected response format:', response.data);
                    setPickupSuggestions([]);
                }
            } catch (error) {
                console.error('Error fetching destination suggestions:', error);
                setPickupSuggestions([]);
            }
        }, 300),
        []
    );

    const handlePickupChange = (e) => {
        const inputValue = e.target.value;
        setPickup(inputValue);
        debouncedHandlePickupChange(inputValue);
    };


    const debouncedHandleDestinationChange = useCallback(
        debounce(async (inputValue) => {
            if (inputValue.length < 3) {
                setDestinationSuggestions([]);
                return;
            }
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                    params: { input: inputValue },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (response.data && Array.isArray(response.data.data)) {
                    setDestinationSuggestions(response.data.data);
                } else {
                    console.warn('Unexpected response format:', response.data);
                    setDestinationSuggestions([]);
                }
            } catch (error) {
                console.error('Error fetching destination suggestions:', error);
                setDestinationSuggestions([]);
            }
        }, 300),
        []
    );

    const handleDestinationChange = (e) => {
        const inputValue = e.target.value;
        setDestination(inputValue);
        debouncedHandleDestinationChange(inputValue);
    };


    const submitHandler = (e) => {
        e.preventDefault()
    }

    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '70%',
                padding: 24
                // opacity:1
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0
                // opacity:0
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0
            })
        }
    }, [panelOpen])


    useGSAP(function () {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [vehiclePanel])

    useGSAP(function () {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [confirmRidePanel])

    useGSAP(function () {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [vehicleFound])

    useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [waitingForDriver])




    return (
        <div className='h-screen w-screen relative overflow-hidden'>
            <div className=" fixed top-0  z-10 p-4 left-[80%] w-full">
                <Link
                    to="/login"
                    className=" bg-white h-12 w-12 rounded-full flex items-center justify-center"
                >
                    <i className="text-xl text-medium ri-logout-box-r-line"></i>
                </Link>
            </div>
            <div className='h-screen w-screen absolute top-0 left-0 z-0'>
                <LiveTracking />
            </div>

            <div className=' flex flex-col justify-end h-screen absolute top-0 w-full'>
                <div className='h-[35%] p-6 bg-white relative'>
                    <h5 ref={panelCloseRef} onClick={() => {
                        setPanelOpen(false)
                    }} className='absolute opacity-0 right-6 top-6 text-2xl'>
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>
                    <h4 className='text-2xl font-semibold'>Find a trip</h4>
                    <form className='relative py-3' onSubmit={(e) => {
                        submitHandler(e)
                    }}>
                        <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField('pickup')
                            }}
                            value={pickup}
                            onChange={handlePickupChange}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full'
                            type="text"
                            placeholder='Add a pick-up location'
                        />
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField('destination')
                            }}
                            value={destination}
                            onChange={handleDestinationChange}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3'
                            type="text"
                            placeholder='Enter your destination' />
                    </form>
                    <button
                        onClick={findTrip}
                        className='bg-black text-white px-4 py-2 rounded-lg  w-full'>
                        Find Trip
                    </button>
                </div>
                <div ref={panelRef} className='bg-white h-0'>
                    <LocationSearchPanel
                        suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                        setPanelOpen={setPanelOpen}
                        setVehiclePanel={setVehiclePanel}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeField={activeField}
                    />
                </div>
            </div>
            <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <VehiclePanel
                    selectVehicle={setVehicleType}
                    fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
            </div>
            <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <ConfirmRide
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setConfirmRidePanel={setConfirmRidePanel} 
                    setVehiclePanel={setVehiclePanel}
                    setVehicleFound={setVehicleFound} />
            </div>
            <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 mt-5 translate-y-full bg-white px-3 py-6 pt-12'>
                <LookingForDriver
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setVehicleFound={setVehicleFound} />
            </div>
            <div ref={waitingForDriverRef} className='fixed w-full  z-10 bottom-0  bg-white px-3 py-6 pt-12'>
                <WaitingForDriver
                    ride={ride}
                    vehicleType={vehicleType}
                    setVehicleFound={setVehicleFound}
                    setWaitingForDriver={setWaitingForDriver}
                    waitingForDriver={waitingForDriver} />
            </div>
        </div>
    )
}

export default Home