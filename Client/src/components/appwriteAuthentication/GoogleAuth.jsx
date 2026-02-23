import { useEffect } from 'react';
import { Client, Account, OAuthProvider } from 'appwrite';
import { useAuth } from '../owner/UserProvider';
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
      }

      // This redirects to Google Auth
      account.createOAuth2Session(
        OAuthProvider.Google,
        'http://localhost:5173/userHome',  // success redirect
        'http://localhost:5173/'           // failure redirect
      );
    } catch (error) {
      console.error('Google login failed:', error.message);
      toast.error("Google login failed. Try again.");
    }
  };

  const checkUserStatus = async () => {
    try {
      const user = await account.get();
      setUser(user);
    } catch (error) {
      console.warn("No active session found");
      setUser(null);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      checkUserStatus();
    }, 200); // delay to ensure cookie is attached
    return () => clearTimeout(timer);
  }, []);



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
