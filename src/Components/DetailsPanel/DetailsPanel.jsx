import React from 'react'
import './DetailsPanel.css'
import { IoIosArrowDropupCircle , IoIosArrowDropdownCircle , IoMdDownload} from "react-icons/io";
import { authentication } from '../../ConfigFirebase/ConfigFirebase';
import { useUserStore } from '../../Zustand/userStore';
import { useChatStore } from '../../Zustand/chatStore';
import { toast } from 'react-toastify'
import { updateDoc, doc, arrayRemove, arrayUnion } from 'firebase/firestore';
import {db} from "../../ConfigFirebase/ConfigFirebase"

const DetailsPanel = () => {
  
  const {user, isReceiverBlocked, isCurrentUserBlocked, changeBlock} = useChatStore();

  const {currentUser} = useUserStore();``

  const handleBlockUser = async ()=>{
    if(!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try{
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock()

    }catch(err){
      console.log(err);
    }
  }

  const handleLogout = async ()=>{
    try {
      await authentication.signOut();
      // Force reset any local state if needed
      useUserStore.getState().fetchUserInfo(null); 
      console.log("User signed out successfully");
      toast.success("LoggedOut Successfully") 
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }
  return (
    <div className='detailsCont'>
      <div className='userDetails'>
        <img src={user?.avatar ||'user.png'} alt='image'/>
        <h2>{user?.username}</h2>
        <p>Lorem ipsum himnd</p>
      </div>
      <div className='userInfoCont'>
        <div className='option'>
          <div className='title'>
            <span>Chat Settings</span>
            <IoIosArrowDropupCircle className='icon'/>
          </div>
        </div>
        <div className='option'>
          <div className='title'>
            <span>Chat Settings</span>
            <IoIosArrowDropupCircle className='icon'/>
          </div>
        </div>
        <div className='option'>
          <div className='title'>
            <span>Privacy & help</span>
            <IoIosArrowDropupCircle className='icon'/>
          </div>
        </div>
        <div className='option'>
          <div className='title'>
            <span>Shared Photos</span>
            <IoIosArrowDropdownCircle className='icon'/>
          </div>
          <div className='photos'>
            <div className='photoItem'>
              <div className='photoDetail'>
                <img src='img.jpg' id='sharedImg'/>
                <span>Photo</span>
              </div>
            <IoMdDownload className='icon'/>
            </div>
            <div className='photoItem'>
              <div className='photoDetail'>
                <img src='img.jpg' id='sharedImg'/>
                <span>Photo</span>
              </div>
            <IoMdDownload className='icon'/>
            </div>
            <div className='photoItem'>
              <div className='photoDetail'>
                <img src='img.jpg' id='sharedImg'/>
                <span>Photo</span>
              </div>
            <IoMdDownload className='icon'/>
            </div>
            {/* <div className='photoItem'>
              <div className='photoDetail'>
                <img src='img.jpg' id='sharedImg'/>
                <span>Photo</span>
              </div>
            <IoMdDownload className='icon'/>
            </div> */}
          </div>
        </div>
        <div className='option'>
          <div className='title'>
            <span>Shared Files</span>
            <IoIosArrowDropupCircle className='icon'/>
          </div>
        </div>
        <button onClick={handleBlockUser}>
          {isCurrentUserBlocked ? "You are Blocked!" : isReceiverBlocked ? "User Blocked" : "Block User"} 
        </button>
        <button id='logout' onClick={handleLogout}>Logout</button>  
      </div>
    </div>
  )
}

export default DetailsPanel
