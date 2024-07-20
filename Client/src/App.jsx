import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Start from './components/StartPage/Start';
import Signup from './components/Signup';
import Login from './components/Login';
import YourTurf from './components/YourTurf';
import PrivateRoute from './components/PrivateRoute';
import UserHome from './components/UserHome';
import OwnerHome from './components/OwnerHome';
import GoogleAuth from './components/GoogleAuth';
import { UserProvider } from './components/UserProvider';

function App() {
  return (
    <UserProvider>
      <div className="App">
        <ToastContainer />
          <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/googleAuth" element={<GoogleAuth />} />
            
            {/* Private routes */}
            <Route
              path="/userHome"
              element={
                <PrivateRoute>
                  <UserHome />
                </PrivateRoute>
              }
            />
            <Route
              path="/ownerHome"
              element={
                <PrivateRoute>
                  <OwnerHome />
                </PrivateRoute>
              }
            />

            <Route
            path='/yourturf'
            element={
              <PrivateRoute>
                <YourTurf/>
              </PrivateRoute>
            }
            />
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
      </div>
    </UserProvider>
  );
}

export default App;