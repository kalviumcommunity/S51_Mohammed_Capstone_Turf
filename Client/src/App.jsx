import AllRoutes from './components/AllRoutes';
import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { TurfProvider } from './components/owner/TurfProvider';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [turfs, setTurfs] = useState([]);

  return (
    <TurfProvider>
      <div className="App">
        <ToastContainer />
        <AllRoutes turfs={turfs} setTurfs={setTurfs} />
        <ToastContainer position="top-right" autoClose={3000} theme="light" />
      </div>
    </TurfProvider>
  );
}

export default App; 
