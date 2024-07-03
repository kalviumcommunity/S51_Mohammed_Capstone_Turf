import { Route, Routes } from 'react-router-dom'
import './App.css'
import { ToastContainer } from 'react-toastify'
import Start from './components/StartPage/Start'
import Signup from './components/Signup'
import Login from './components/Login'
import Home from './components/HomePage/Home'
import PrivateRoute from './components/PrivateRoute'
import 'react-toastify/dist/ReactToastify.css';
import UserForm from './components/UserForm'

function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Start/>}/>
      <Route path='/Signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
      {/* Private route */}
      <Route element={<PrivateRoute/>}>
        <Route path='/userform' element={<UserForm/>}/>
        <Route path='/home' element={<Home/>}/>
      </Route>

    </Routes>
    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
        theme="light"
      />
      
    </>
  )
}

export default App
