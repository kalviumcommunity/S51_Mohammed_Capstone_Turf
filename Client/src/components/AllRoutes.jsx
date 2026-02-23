import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

// Public pages
import Start from './LandingPage';
import Signup from './appwriteAuthentication/Signup';
import Login from './appwriteAuthentication/Login';
import GoogleAuth from './appwriteAuthentication/GoogleAuth';

// Protected pages
import UserHome from './User/UserHome';
import OwnerHome from './owner/OwnerHome';
import YourTurf from './owner/YourTurf';
import UpdateTurfData from './owner/UpdateTurfData';
import SelectedTurf from './User/SelectedTurf';
import TurfBooking from './User/TurfBooking';
import AiChatBot from './AiChatBot';
import AccountSetup from './AccountSetup';

const AllRoutes = ({ turfs, setTurfs }) => {
  return (
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
            <YourTurf turfs={turfs} setTurfs={setTurfs} />
          </PrivateRoute>
        }
      />

      <Route
        path="/updateTurfData"
        element={
          <PrivateRoute>
            <UpdateTurfData setTurfs={setTurfs} />
          </PrivateRoute>
        }
      />

      <Route
        path="/selectedTurf/:id"
        element={
          <PrivateRoute>
            <SelectedTurf />
          </PrivateRoute>
        }
      />

      <Route
        path="/bookSelectedTurf/:id"
        element={
          <PrivateRoute>
            <TurfBooking />
          </PrivateRoute>
        }
      />

      <Route
        path="/AiChatBot"
        element={
          <PrivateRoute>
            <AiChatBot />
          </PrivateRoute>
        }
      />

      <Route
        path="/userDetails"
        element={
          <PrivateRoute>
            <AccountSetup />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AllRoutes;
