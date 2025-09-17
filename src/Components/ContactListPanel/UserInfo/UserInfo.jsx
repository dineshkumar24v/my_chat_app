import React, { useState, useRef, useEffect } from "react";
import "./UserInfo.css";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaVideo } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { useUserStore } from "../../../Zustand/userStore";
import { authentication } from "../../../ConfigFirebase/ConfigFirebase";
import { toast } from "react-toastify";
// import { useChatStore } from "../../../Zustand/chatStore";
// import { updateDoc, doc, arrayRemove, arrayUnion } from "firebase/firestore";
// import { db } from "../../../ConfigFirebase/ConfigFirebase";

const UserInfo = () => {
  const { currentUser } = useUserStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);


  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authentication.signOut();
      // Force reset any local state if needed
      useUserStore.getState().fetchUserInfo(null);
      console.log("User signed out successfully");
      toast.success("LoggedOut Successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <div className="userInfoCont">
      <div className="user">
        <img src={currentUser.avatar || "user.png"} alt="User Avatar" />
        <h2>{currentUser.username}</h2>
      </div>

  {/* Absolutely-positioned container for icons */}
      <div className="icons" >
        <div className="menu-container" ref={dropdownRef}>
        <HiOutlineDotsHorizontal
          className="icon"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />

        {dropdownOpen && (
          <div className="dropdown">
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
        </div>
         {/* <FaVideo className="icon" /> */}
         {/* <FaEdit className="icon" /> */}
      </div>
    </div>
  );
};

export default UserInfo;

// import React from 'react'
// import './UserInfo.css'
// import { FaUserCircle } from "react-icons/fa";
// import { HiOutlineDotsHorizontal } from "react-icons/hi";
// import { FaVideo } from "react-icons/fa6";
// import { FaEdit } from "react-icons/fa";
// import { useUserStore } from '../../../Zustand/userStore';

// const UserInfo = () => {
//   const { currentUser} = useUserStore();
//   return (
//     <div className='userInfoCont'>
//       <div className='user'>
//         <img src={currentUser.avatar || 'user.png'}/>
//         <h2>{currentUser.username}</h2>
//       </div>
//       <div className='icons'>
//         <HiOutlineDotsHorizontal className='icon'/>
//         <FaVideo className='icon'/>
//         <FaEdit className='icon'/>
//       </div>
//     </div>
//   )
// }

// export default UserInfo

// import React from 'react';
// import './UserInfo.css';
// import { FaUserCircle } from "react-icons/fa";
// import { HiOutlineDotsHorizontal } from "react-icons/hi";
// import { FaVideo, FaEdit } from "react-icons/fa";
// import { useUserStore } from '../../../Zustand/userStore';
// import defaultAvatar from '../../../assets/user.png'; // Import default avatar

// const UserInfo = () => {
//   const { currentUser, isLoading } = useUserStore();

//   // Show loading state
//   if (isLoading) {
//     return (
//       <div className='userInfoCont loading'>
//         <div className='user'>
//           <div className="avatar-skeleton"></div>
//           <div className="name-skeleton"></div>
//         </div>
//       </div>
//     );
//   }

//   // Show empty state if no user
//   if (!currentUser) {
//     return (
//       <div className='userInfoCont'>
//         <div className='user'>
//           <FaUserCircle size={40} />
//           <h2>Guest User</h2>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className='userInfoCont'>
//       <div className='user'>
//         {currentUser.avatar ? (
//           <img src={currentUser.avatar} alt={currentUser.username} />
//         ) : (
//           <img src={defaultAvatar} alt="Default avatar" />
//         )}
//       </div>
//         <h2>{currentUser.username || currentUser.email?.split('@')[0] || 'User'}</h2>
//       <div className='icons'>
//         <HiOutlineDotsHorizontal className='icon'/>
//         <FaVideo className='icon'/>
//         <FaEdit className='icon'/>
//       </div>
//     </div>
//   );
// };

// export default UserInfo;
