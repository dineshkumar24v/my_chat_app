import React, { useEffect, useState } from "react";
import ContactListPanel from "./Components/ContactListPanel/ContactListPanel";
import ChatPanel from "./Components/ChatPanel/ChatPanel";
import DetailsPanel from "./Components/DetailsPanel/DetailsPanel";
// import Login from './Pages/Login/Login'
// import SignUp from './Pages/SignUp/SignUp'
import Home from "./Pages/Home/Home";
import Notifications from "./Notifications/Notifications";
import { onAuthStateChanged } from "firebase/auth";
import { authentication } from "./ConfigFirebase/ConfigFirebase";
import { useUserStore } from "./Zustand/userStore";
import { useChatStore } from "./Zustand/chatStore";
// import { Route,Routes } from 'react-router-dom'

const App = () => {
  const { currentUser, isLoading, fetchUserInfo, setCurrentUser } =
    useUserStore();
  const { chatId } = useChatStore();

  // handling mobile view state for responsive design
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  // 📱 Handle screen resizing
  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 768;
      setIsMobile(isNowMobile);

      // Reset mobile view toggle when resizing to desktop
      if (!isNowMobile) setShowChatOnMobile(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //  Auth listener
  useEffect(() => {
    const unSub = onAuthStateChanged(authentication, (user) => {
      if (user) {
        console.log("Firebase UID:", user.uid);
        fetchUserInfo(user?.uid);
      } else {
        setCurrentUser(null);
        // setTimeout({ currentUser:null, isLoading: false });
      }
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo, setCurrentUser]);

  console.log(currentUser, "iam a current user");

  //  Loading fallback
  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading.....</p>
      </div>
    );
  }

  return (
    <div className="appContainer">
      {!isLoading && currentUser ? (
        <>
          {isMobile ? (
            <>
              {/*  Mobile View Logic */}
              {!chatId || !showChatOnMobile ? (
                <ContactListPanel
                  onOpenChat={() => setShowChatOnMobile(true)}
                />
              ) : (
                <ChatPanel onBack={() => setShowChatOnMobile(false)} />
              )}
            </>
          ) : (
            <>
              {/*  Desktop View Logic */}
              <ContactListPanel />
              {chatId && <ChatPanel />}
              {chatId && <DetailsPanel />}
            </>
          )}
        </>
      ) : (
        <Home />
      )}
      <Notifications />
    </div>
  );
};
export default App;
