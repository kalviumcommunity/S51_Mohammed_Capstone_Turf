import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Start from './components/Start';
import Signup from './components/Signup';
import Login from './components/Login';
import YourTurf from './components/YourTurf';
import PrivateRoute from './components/PrivateRoute';
import UserHome from './components/UserHome';
import OwnerHome from './components/OwnerHome';
import GoogleAuth from './components/GoogleAuth';
import { UserProvider } from './components/UserProvider';
import UpdateTurfData from './components/UpdateTurfData';
import { TurfProvider } from './components/TurfProvider';
import SelectedTurf from './components/SelectedTurf';
import AiChatBot from './components/AiChatBot';


function App() {
  const [turfs, setTurfs] = useState([]);

  return (
    <UserProvider>
      <TurfProvider>
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
                  path="/yourTurf"
                  element={
                    <PrivateRoute>
                      <YourTurf turfs={turfs} setTurfs={setTurfs}/>
                    </PrivateRoute>
                  }
                />

                <Route path="/selectedTurf/:id" 
                element={
                <PrivateRoute>
                  <SelectedTurf />
                </PrivateRoute>
                }
                />

                <Route
                  path="/updateTurfData"
                  element={
                    <PrivateRoute>
                      <UpdateTurfData setTurfs={setTurfs}/>
                    </PrivateRoute>
                  }
                />

                <Route
                path='/AiChatBot'
                element={
                  <PrivateRoute>
                    <AiChatBot />
                  </PrivateRoute>
                }/>

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
      </TurfProvider>
    </UserProvider>
  );
}

export default App;
