// import React, { useEffect } from 'react'
// import './UserList.css'
// import { IoSearchSharp } from "react-icons/io5";
// import { FaPlus,FaMinus } from "react-icons/fa6";
// import { useState } from 'react';
// import AddUser from './addUser/AddUser';
// import { useChatStore } from '../../../Zustand/chatStore';
// import { useUserStore } from '../../../Zustand/userStore';
// import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
// import {db} from '../../../ConfigFirebase/ConfigFirebase'

// const UserList = () => {
//   // const [plusState,setPlusState] = useState(false)
//   const [modalShow, setModalShow] = useState(false);
//   const [chats, setChats] = useState([]) // taking an empty array state to store the chats
//   const [searchInput, setSearchInput] = useState("");

//   const {currentUser} = useUserStore();
//   const {chatId, changeChat} = useChatStore();
//   console.log(chatId)

//   useEffect(()=>{
//     const unSub = onSnapshot(doc(db, "userChats", currentUser.id), async(res) => {
//       // setChats(doc.data())
//       // console.log("Current data: ", doc.data());
//       const items = res.data().chats

//       const promises = items.map(async(item)=>{
//         const userDocRef = doc(db, "users", item.receiverId)
//         const userDocSnap = await getDoc(userDocRef)

//         const user = userDocSnap.data();

//         return {...item, user}
//       })

//         const chatData = await Promise.all(promises)
//         setChats(chatData.sort((a,b)=>b.updatedAt - a.updatedAt));
//     });

//       return ()=>{
//         unSub()
//       }
//   },[currentUser.id]);
//   // console.log(chats)

//   const handleSelect = async (chat)=>{

//     const userChats = chats.map((item)=>{
//       const {user, ...rest} = item;
//       return rest;
//     });

//     const chatIndex = userChats.findIndex(
//       (item) => item.chatId === chat.chatId
//     );

//     userChats[chatIndex].isSeen = true;

//     const userChatsRef = doc(db, "userChats", currentUser.id);

//     try{
//       await updateDoc(userChatsRef, {
//         chats: userChats,
//       })
//       changeChat(chat.chatId, chat.user)

//     }catch(err){
//       console.log(err)
//     }

//   }

//   const filteredChats = chats.filter((c)=>
//     c.user.username.toLowerCase().includes(searchInput.toLowerCase())
//   );

//   return (
//     // search bar
//     <div className='userListCont'>
//       <div className='search'>
//         <div className='searchBar'>
//           <IoSearchSharp className='searchIcon'/>       {/* Search Bar */}
//           <input type='text' placeholder='Search....' className='searchInput'
//             onChange={(e)=>setSearchInput(e.target.value)}
//           />
//         </div>
//         <div>
//           {/* {plusState ? <FaMinus className='plusIcon' onClick={()=>setPlusState((prev) =>!prev)}/>: <FaPlus className='plusIcon' onClick={()=>setPlusState((prev) =>!prev)}  />} */}

//           <FaPlus className='plusIcon' onClick={() => setModalShow(true)} />

//         </div>
//       </div>

//     {/* users contact list */}
//     {filteredChats.map((chat)=>(
//       <div className='userList' key={chat.chatId} onClick={()=>handleSelect(chat)} style={{backgroundColor:chat?.isSeen ? "transparent" : "#5183fe",borderRadius:"10px",marginBottom:"2px"}}>

//         <img src={chat.user.blocked.includes(currentUser.id) ? "user.png" : chat.user.avatar || 'user.png'}/>
//         <div className='userTexts'>
//           <span>{chat.user.blocked.includes(currentUser.id) ? "User" :chat.user.username}</span>
//           <p>{chat.lastMessage}</p>
//         </div>
//       </div>
//     ))}

//      {/* Modal Component */}
//      <AddUser show={modalShow} onHide={() => setModalShow(false)} />
//     </div>
//   )
// }
// export default UserList

import React, { useEffect, useCallback } from "react";
import "./UserList.css";
import { IoSearchSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import AddUser from "./addUser/AddUser";
import { useChatStore } from "../../../Zustand/chatStore";
import { useUserStore } from "../../../Zustand/userStore";
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../ConfigFirebase/ConfigFirebase";

const UserList = ({ onSelectChat }) => {
  const [modalShow, setModalShow] = useState(false);
  const [chats, setChats] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();
  console.log(chatId);

  const isUserBlocked = useCallback(
    (user) => {
      return user?.blocked?.includes(currentUser.id);
    },
    [currentUser.id]
  );

  useEffect(() => {
    if (!currentUser?.id) return;

    const unSub = onSnapshot(
      doc(db, "userChats", currentUser.id),
      async (res) => {
        try {
          if (!res.exists()) {
            setChats([]);
            return;
          }

          const items = res.data().chats || [];
          const promises = items.map(async (item) => {
            try {
              const userDocRef = doc(db, "users", item.receiverId);
              const userDocSnap = await getDoc(userDocRef);
              return userDocSnap.exists()
                ? { ...item, user: userDocSnap.data() }
                : null;
            } catch (err) {
              console.error("Error fetching user:", err);
              return null;
            }
          });

          const chatData = (await Promise.all(promises)).filter(Boolean);
          setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
          setLoading(false);
        } catch (err) {
          console.error("Error processing chats:", err);
          setError("Failed to load chats");
          setLoading(false);
        }
      },
      (err) => {
        console.error("Snapshot error:", err);
        setError("Failed to listen for chat updates");
        setLoading(false);
      }
    );

    return () => unSub();
  }, [currentUser.id]);

  const handleSelect = useCallback(
    async (chat) => {
      if (!chat?.chatId || !currentUser?.id) return;

      changeChat(chat.chatId, chat.user);
      if (onSelectChat) onSelectChat(); // 👈 Trigger for mobile view toggle

      try {
        const userChats = chats.map(({ user, ...rest }) => rest);
        const chatIndex = userChats.findIndex(
          (item) => item.chatId === chat.chatId
        );

        if (chatIndex === -1) return;

        userChats[chatIndex].isSeen = true;
        const userChatsRef = doc(db, "userChats", currentUser.id);

        await updateDoc(userChatsRef, { chats: userChats });
        changeChat(chat.chatId, chat.user);
      } catch (err) {
        console.error("Error updating chat:", err);
      }
    },
    [chats, currentUser.id, changeChat, onSelectChat]
  );

  const filteredChats = chats.filter((c) =>
    c.user?.username?.toLowerCase().includes(searchInput.toLowerCase())
  );

  if (loading) return <div className="userListCont">Loading chats...</div>;
  if (error) return <div className="userListCont">{error}</div>;

  return (
    <div className="userListCont">
      <div className="search">
        <div className="searchBar">
          <IoSearchSharp className="searchIcon" />
          <input
            type="text"
            title="search for users"
            placeholder="Search...."
            className="searchInput"
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
          />
        </div>
        <div>
          <FaPlus
            className="plusIcon"
            title="add user"
            onClick={() => setModalShow(true)}
            aria-label="Add user"
          />
        </div>
      </div>

      {filteredChats.length === 0 ? (
        <div className="no-chats">No chats found</div>
      ) : (
        filteredChats.map((chat) => (
          <div
            className="userList"
            key={chat.chatId}
            onClick={() => handleSelect(chat)}
            style={{
              backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
              borderRadius: "10px",
              marginBottom: "2px",
            }}
          >
            <img
              src={
                isUserBlocked(chat.user)
                  ? "user.png"
                  : chat.user?.avatar || "user.png"
              }
              alt={chat.user?.username || "User"}
            />
            <div className="userTexts">
              <span>
                {isUserBlocked(chat.user) ? "User" : chat.user?.username}
              </span>
              <p>{chat.lastMessage}</p>
            </div>
          </div>
        ))
      )}

      <AddUser show={modalShow} onHide={() => setModalShow(false)} />
    </div>
  );
};

export default UserList;
