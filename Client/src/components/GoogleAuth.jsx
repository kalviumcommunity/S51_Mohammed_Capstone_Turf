import {useEffect} from 'react';
import { Client, Account, OAuthProvider } from "appwrite";
import { useAuth } from './UserProvider';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const GoogleAuth = () => {
  const AppwriteId = import.meta.env.VITE_APPWRITE_ID;
  const AppwriteEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
  const { user, setUser } = useAuth();

  const client = new Client()
    .setEndpoint(AppwriteEndpoint)
    .setProject(AppwriteId);

  const account = new Account(client);

  const handleGoogleLogin = async () => {
    try {
      if (user) {
        await account.deleteSession('current');
        setUser(null);
        Cookies.remove('email');
        Cookies.remove('userID');
      }

      // Start the OAuth2 session
        account.createOAuth2Session(
        OAuthProvider.Google,
        'http://localhost:5173/userHome',
        'http://localhost:5173/'
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  // useEffect to handle post-OAuth actions
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const accountDetails = await account.get();
        if (accountDetails) {
          Cookies.set('userID', accountDetails.$id);
          Cookies.set('email', accountDetails.email);
          setUser(accountDetails);
          toast.success("Login successful");
        }
      } catch (error) {
        console.log("No active session found:", error.message);
      }
    };
    checkUserStatus();
  }, [user, setUser, account]);

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center w-full py-2 bg-white border border-gray-300 rounded shadow-md hover:bg-gray-100 transition duration-200"
    >
      <img
        className="w-6 h-6 mr-2"
        src="https://storage.googleapis.com/libraries-lib-production/images/GoogleLogo-canvas-404-300px.original.png"
        alt="Google logo"
      />
      Sign in with Google
    </button>
  );
};

export default GoogleAuth;
