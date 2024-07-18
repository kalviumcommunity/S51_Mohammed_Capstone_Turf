// import React, { useState } from 'react';
// import { useAuth } from './UserProvider'


// const Logout = () => {
//     const { logoutUser, checkUserStatus } = useAuth(); 

//     const handleLogout = async () => {
//         try {
//           await checkUserStatus();
//           await logoutUser();
//         } catch (error) {
//           console.log(error);
//         }
//       };



//   return (
//     <div>
//       <button onClick={handleLogout} className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200">
//         Logout
//       </button>
//       {/* <h3>{userEmail}</h3> */}
//     </div>
//   );
// };

// export default Logout;
