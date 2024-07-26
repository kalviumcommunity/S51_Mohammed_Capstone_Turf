import React,{useEffect} from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from './UserProvider';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import { toast } from 'react-toastify';



const Start = () => {
  const userEmail = Cookies.get('email')
  const {user} = useAuth()
  const navigate = useNavigate();


  useEffect(() => {
    // if(user){
    //     navigate('/userHome')
    //     toast.success(`Logged in as ${userEmail}`)
    // }
},[])

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600">
      <header className="flex px-4 py-8 justify-between">
        <h1 className="text-3xl font-bold text-white">LOGO</h1>
        <nav className="space-x-4">
          <NavLink
            to="/Signup"
            className="relative inline-flex items-center px-4 py-2 rounded-full hover:bg-indigo-700 hover:text-white transition duration-300 ease-in-out"
          >
            Signup
            <span className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-purple-700 to-indigo-500 opacity-0 group-hover:opacity-75 transition duration-300 ease-in-out"></span>
          </NavLink>
          <NavLink
            to="/Login"
            className="relative inline-flex items-center px-4 py-2 rounded-full bg-white hover:bg-opacity-75 hover:text-indigo-700 transition duration-300 ease-in-out"
          >
            Login
          </NavLink>
        </nav>
      </header>
    </div>
  )
}

export default Start
