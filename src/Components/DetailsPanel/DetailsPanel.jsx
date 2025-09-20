import React from "react";
import "./DetailsPanel.css";
import {
  IoIosArrowDropupCircle,
  IoIosArrowDropdownCircle,
  IoMdDownload,
} from "react-icons/io";
// import { authentication } from "../../ConfigFirebase/ConfigFirebase";
import { useUserStore } from "../../Zustand/userStore";
import { useChatStore } from "../../Zustand/chatStore";
import { toast } from "react-toastify";
import { updateDoc, doc, arrayRemove, arrayUnion } from "firebase/firestore";
import { db } from "../../ConfigFirebase/ConfigFirebase";

// passing props from ChatPanel
const DetailsPanel = ({ onBack }) => {
  const { user, isReceiverBlocked, isCurrentUserBlocked, changeBlock } =
    useChatStore();

  const { currentUser } = useUserStore();
  ``;

  const handleBlockUser = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  const handleReportUser = () => {
    // Implement your report user logic here
    toast.info("User reported. Thank you for your feedback.");
  }

  return (
    <div className="detailsCont">
      <div className="detailsHeader">
        {onBack && (
          <button id="detailsBackBtn" onClick={onBack}>
            ←
          </button>
        )}
      <div style={{ flex: 1 }}>
        <div className="userDetails">
        <img src={user?.avatar || "user.png"} alt="image" />
        <h2>{user?.username}</h2>
        <p>Urgent calls only</p>
      </div>
      </div>
      </div>
      <div className="userInfoCont">
      <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <IoIosArrowDropdownCircle className="icon" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img src="img.jpg" id="sharedImg" />
                <span>Photo</span>
              </div>
              <IoMdDownload className="icon" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="img.jpg" id="sharedImg" />
                <span>Photo</span>
              </div>
              <IoMdDownload className="icon" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="img.jpg" id="sharedImg" />
                <span>Photo</span>
              </div>
              <IoMdDownload className="icon" />
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
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <IoIosArrowDropupCircle className="icon" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Notifications</span>
            <IoIosArrowDropupCircle className="icon" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Encryption</span>
            <IoIosArrowDropupCircle className="icon" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Disappearing messages</span>
            <IoIosArrowDropupCircle className="icon" />
          </div>
        </div>
        
        <button onClick={handleBlockUser}>
          {isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
            ? "Unblock User"
            : "Block User"}
        </button>
        <button onClick={handleReportUser}>
          Report user
        </button>
      </div>
    </div>
  );
};

export default DetailsPanel;
