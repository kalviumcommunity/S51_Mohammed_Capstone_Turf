import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from './UserProvider'
//Private route is a feature of react-router-dom that authorizes a route. If condition is satisfied the rout works else it dosent work
//React "Outlet" <Outlet/> is a component provided by React Router that serves as a placeholder for child routes within a parent route. It allows for the nesting of routes, enabling developers to create complex navigation structures in their applications.
const PrivateRoute = () => {

    // const userCookie = Cookies.get()
    const {user} = useAuth()
  return user ? <Outlet/> : <Navigate to='/'/>
}

export default PrivateRoute
