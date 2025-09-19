import React, { useEffect, useState, useRef } from "react";
import "./ChatPanel.css";
import {
  FaPhone,
  FaVideo,
  FaCircleInfo,
  FaImage,
  FaCameraRetro,
  FaMicrophone,
} from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdEmojiEmotions } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import EmojiPicker from "emoji-picker-react";
import {
  onSnapshot,
  doc,
  arrayUnion,
  arrayRemove,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../ConfigFirebase/ConfigFirebase";
import { useChatStore } from "../../Zustand/chatStore";
import { useUserStore } from "../../Zustand/userStore";
// import { TiTickOutline } from "react-icons/ti";
import axios from "axios"; // ✅ You need to install axios

// props: onBack, onViewContact
const ChatPanel = ({ onBack, onViewContact }) => {
  const [sendImage, setSentImage] = useState({ file: null, url: "" });

  const [chat, setChat] = useState();

  const [openEmoji, setOpenEmoji] = useState(false); // setting state for emojis
  const [writeText, setWriteText] = useState(""); // setting state for input text

  const { currentUser } = useUserStore();
  const { chatId, user, isReceiverBlocked, isCurrentUserBlocked, changeBlock } =
    useChatStore();

  // end ref for auto scroll
  const endRef = useRef(null); // useRef hook

  // dropdown state and ref
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // clear chat modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Sometimes, the first render might not have any messages, so scrollIntoView does nothing. You can make sure to only run the scroll when chat?.messages?.length is non-zero.

  useEffect(() => {
    if (chat?.messages?.length > 0) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat?.messages]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);
  console.log(chat);

  // sending an image code
  const handleSentImage = (e) => {
    if (e.target.files[0]) {
      setSentImage({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const uploadToCloudinary = async (uid) => {
    const data = new FormData();
    data.append("file", sendImage.file);
    data.append("upload_preset", "ReactChatAppUploads"); // 🔁 Replace this with your Cloudinary preset
    data.append("cloud_name", "dmrgvxawa"); // 🔁 Replace with your Cloudinary cloud name

    // 👇 Store in a user-specific folder
    data.append("folder", `users/${uid}/avatar`);

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dmrgvxawa/image/upload",
        data
      );
      return res.data.secure_url; // ✅ returns the uploaded image URL
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  };

  const handleEmoji = (e) => {
    console.log(e); // consoling the emoji click event --> we get an object with emoji as key value pair
    setWriteText((prev) => prev + e.emoji); // here emoji is the key w
    setOpenEmoji(false);
  };
  console.log(writeText); // consoling the text input

  const handleSend = async () => {
    if (writeText === "") return;

    let imgURL = null;

    try {
      if (sendImage.file) {
        imgURL = await uploadToCloudinary(sendImage.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text: writeText,
          createdAt: new Date(),
          ...(imgURL && { img: imgURL }),
        }),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userChats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = writeText;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }

    setSentImage({
      file: null,
      url: "",
    });

    setWriteText("");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // block user functionality
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

  // view contact functionality
  const handleViewContact = () => {
    if (!user) return;
    setDropdownOpen(false);
    onViewContact(); // 👈 Trigger the parent to show DetailsPanel
  };

  return (
    // top
    <div className="chatCont">
      <div className="top">
        <div className="user">
          {/* ✅ Show back button only on mobile */}
          {onBack && (
            <button id="chatBackBtn" onClick={onBack}>
              ←
            </button>
          )}

          <img src={user?.avatar || "user.png"} />

          <div className="navTexts">
            <span className="chatName">{user?.username || "User"}</span>
            <p className="chatDesc">Lorem Ipsum hasii</p>
          </div>
        </div>
        <div className="icons">
          <FaVideo size={18} />
          <FaPhone size={16} />

          <div className="menu-container" ref={dropdownRef}>
            <BsThreeDotsVertical
              size={20}
              className="icon"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />

            {dropdownOpen && (
              <div id="user-dropdown">
                <button onClick={handleViewContact}>View contact</button>
                <button onClick={() => setShowConfirmModal(true)}>
                  Clear chat
                </button>
                <button onClick={handleBlockUser} id="blockBtn">
                  {isCurrentUserBlocked
                    ? "You are Blocked!"
                    : isReceiverBlocked
                    ? "Unblock User"
                    : "Block User"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* center *****************/}
      <div className="center">
        {/* <div className='myMessage'>
          <div className='msgTexts'>
            <p>lorem kjdjhskjdvhsv ksdvks sgdksd sdkshdv dkshdv kdkjs </p>
            <span>1 min ago</span>
          </div>
        </div> */}

        {chat?.messages?.map((message) => (
          <div
            className={
              message.senderId === currentUser?.id ? "myMessage" : "message"
            }
            key={message?.createdAt}
          >
            {message.img && <img src={message.img} />}
            <div className="msgTexts">
              <p>{message.text} </p>
              {/* <span>1 min ago</span> */}
            </div>
          </div>
        ))}

        {sendImage.url && (
          <div className="myMessage">
            <div className="msgTexts">
              <img src={sendImage.url} />
            </div>
          </div>
        )}

        <div ref={endRef}></div>
      </div>
      {/* bottom *****************************/}
      <div className="bottom">
        <div className="BottomIcons">
          <label
            htmlFor="file"
            onClick={(e) => {
              if (isCurrentUserBlocked || isReceiverBlocked) {
                e.preventDefault();
              }
            }}
            className={
              isCurrentUserBlocked || isReceiverBlocked
                ? "media-icon-disabled"
                : "media-icon-enabled"
            }
          >
            <FaImage size={20} />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleSentImage}
          />
          {/* <FaCameraRetro /> */}
          {/* <FaMicrophone /> */}
        </div>
        <input
          type="text"
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You cannot send a message"
              : "Type a message...."
          }
          value={writeText}
          onChange={(e) => setWriteText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <MdEmojiEmotions
            size={32}
            onClick={() => {
              if (isCurrentUserBlocked || isReceiverBlocked) return;
              setOpenEmoji((prev) => !prev);
            }}
            style={{
              cursor:
                isCurrentUserBlocked || isReceiverBlocked
                  ? "not-allowed"
                  : "pointer",
              opacity: isCurrentUserBlocked || isReceiverBlocked ? 0.5 : 1,
            }}
          />
          {/* handling the state of emoji */}
          <div className="emojiCont">
            <EmojiPicker open={openEmoji} onEmojiClick={handleEmoji} />{" "}
            {/* handling the onClickEmoji function of emoji */}
          </div>
        </div>
        <button
          className="sendButton"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          <IoMdSend />
        </button>
      </div>
      {showConfirmModal && (
        <div className="clear-chat-modal-overlay">
          <div className="clear-chat-modal-content">
            <h3>Clear Chat</h3>
            <p>
              Are you sure you want to clear this chat? This action cannot be
              undone.
            </p>
            <button
              onClick={async () => {
                try {
                  await updateDoc(doc(db, "chats", chatId), {
                    messages: [],
                  });
                  setShowConfirmModal(false);
                } catch (err) {
                  console.error("Failed to clear chat:", err);
                }
              }}
            >
              Yes, Clear
            </button>
            <button onClick={() => setShowConfirmModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPanel;
