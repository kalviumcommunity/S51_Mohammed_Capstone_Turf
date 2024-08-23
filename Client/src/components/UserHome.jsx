import React, { useEffect, useState } from 'react';
import { useAuth } from './UserProvider';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AiChatBot from './AiChatBot';
import chatbotimage from "../assets/chatbot.png"


const UserHome = () => {
    const { logoutUser, checkUserStatus } = useAuth();
    const [allTurfs, setAllTurfs] = useState([]);
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate() 

    const handleLogout = async () => {
        try {
            await checkUserStatus();
            await logoutUser();
        } catch (error) {
            console.log(error);
            toast.error("We are unable to logout you!, might be because of connectivity issues. Try again later or refresh the page.")
        }
    };

    

    const fetchAllTurfs = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/getAllTurfs', { withCredentials: true });
            setAllTurfs(Array.isArray(response.data) ? response.data : []);
            setLoading(false)
        } catch (error) {
            console.log(error.message);
            toast.message("Oops, Cant find any turfs nearby, check your connection, and try logging in again");
        }
    };

    useEffect(() => {
        fetchAllTurfs();
    }, []);

    const handleSelectedTurf = (turf) => {
      localStorage.setItem('selectedTurf', JSON.stringify(turf));
      navigate(`/selectedTurf/${turf._id}`);
    };

      useEffect(() => {
        if (allTurfs.length === 0) {
          setLoading(false);
        }
      }, [allTurfs]);
    
      return (
        <div className=''>
          {loading ? (
            <div>
              <div className="skeleton h-32 w-50"></div>
            </div>
          ) : (
            <div className="flex-col min-h-screen bg-grey text-white">

              {/* Navbar content */}
              <div className="navbar mt-6 mb-6  bg-base-100 shadow-2xl">
                <div className="navbar-start">
                  <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                    </div>
                    <div tabIndex={0} className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-72 p-2 shadow">
                      <img src="" alt="" />
                      <NavLink to="/yourturf">
                        <button className="btn  hover:bg-white hover:text-black w-full mt-4 text-white">Your turfs</button>
                      </NavLink>
                      <NavLink to="/ownerHome">
                        <button className="btn  hover:bg-white hover:text-black w-full mt-4 text-white">Upload your turf</button>
                      </NavLink>
                      <button className="btn  hover:bg-white hover:text-black w-full mt-4 text-white">Feedback</button>
                      <button className="btn w-full  hover:bg-white hover:text-black  mt-4 text-white">About</button>
                      <button className="btn  hover:bg-white hover:text-black w-full mt-4 text-white">Chat AI</button>

                      <button className="btn  hover:bg-white hover:text-black w-full mt-4 text-white" onClick={()=>document.getElementById('my_modal_5').showModal()}>Logout</button>
                      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box bg-primary">
                          <h3 className="font-bold text-lg">LOGOUT</h3>
                          <p className="py-4">Are you sure you want to "LOGOUT" ?</p>
                          <div className="modal-action">
                            <button className='btn text-white bg-black hover:bg-white hover:text-black' onClick={handleLogout}>Logout</button>
                            <form method="dialog">
                              <button className="btn text-white bg-black hover:bg-white hover:text-black">NO</button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  </div>
                </div>

                <div className="navbar-center">
                  <a className="btn btn-ghost text-2xl">TURFER</a>
                </div>

                <div className="navbar-end">
                  <button className="btn btn-ghost btn-circle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>

              </div>

               {/* Main content */}
              <div className="justify-center flex-col items-center">
                <div className='flex justify-around w-full '>
                  <div className=' rounded bg-primary w-60 h-48 flex justify-center text-center items-center'>
                    Cricket
                  </div>
                  <div className=' rounded bg-primary w-60 h-48 flex justify-center text-center items-center'>
                    Badmitton
                  </div>
                  <div className=' rounded bg-primary w-60 h-48 flex justify-center text-center items-center'>
                    Foot ball
                  </div>
                  <div className=' rounded bg-primary w-60 h-48 flex justify-center text-center items-center'>
                    Basket Ball
                  </div>
                  <div className=' rounded bg-primary w-60 h-48 flex justify-center text-center items-center'>
                    swimming
                  </div>
                </div>
                
                <div className=" p-3 ml-36 rounded w-4/5">
                
                  {allTurfs.length === 0 ? (
                    <div className="mt-10 text-center">
                      <p className="text-xl">No turfs found...</p>
                    </div>
                  ) : (
                    <div>
                      {allTurfs.map((turf, ind) => (
                        <div  className="hero bg-base-200 " key={ind}>
                          <div className='hero-content flex-col lg:flex-row' >
                            <figure>
                              <img
                                onClick={() => handleSelectedTurf(turf)}
                                src={turf.turfThumbnail ? `${turf.turfThumbnail}` : 'default-image-url'}
                                alt={turf.turfName}
                                className="w-80 h-80 rounded-lg shadow-2xl"
                              />
                            </figure>
                            <div>
                                <h1  className="text-5xl font-bold">{turf.turfName}</h1>
                                <h2 className='text-2xl'>$ {turf.turfPrice} /hr</h2>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="w-20 lg:tooltip" data-tip="chat with AI">
            <NavLink to='/AiChatBot'>
              <button><img src={chatbotimage} alt="" /></button>
            </NavLink>
          </div>
        </div>
      );
};

export default UserHome;
