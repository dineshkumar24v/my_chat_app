import React, { useEffect, useState } from "react";
import ContactListPanel from "./Components/ContactListPanel/ContactListPanel";
import ChatPanel from "./Components/ChatPanel/ChatPanel";
import DetailsPanel from "./Components/DetailsPanel/DetailsPanel";
import Home from "./Pages/Home/Home";
import Notifications from "./Notifications/Notifications";
import { onAuthStateChanged } from "firebase/auth";
import { authentication } from "./ConfigFirebase/ConfigFirebase";
import { useUserStore } from "./Zustand/userStore";
import { useChatStore } from "./Zustand/chatStore";

const App = () => {
  const { currentUser, isLoading, fetchUserInfo, setCurrentUser } =
    useUserStore();
  const { chatId } = useChatStore();

  const [isCompactView, setIsCompactView] = useState(window.innerWidth <= 1024); // ✅ Mobile + Tablet
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      const compact = window.innerWidth <= 1024;
      setIsCompactView(compact);

      if (!compact) {
        setShowChatPanel(false);
        setShowDetailsPanel(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auth state listener
  useEffect(() => {
    const unSub = onAuthStateChanged(authentication, (user) => {
      if (user) {
        console.log("Firebase UID:", user.uid);
        fetchUserInfo(user.uid);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unSub();
  }, [fetchUserInfo, setCurrentUser]);

  // Loading fallback
  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading.....</p>
      </div>
    );
  }

  //  Layout logic:
  const shouldShowContactList = !chatId || !showChatPanel;
  const shouldShowChatPanel = chatId && !showDetailsPanel;
  const shouldShowDetailsPanel = chatId && showDetailsPanel;

  return (
    <div className="appContainer">
      {!isLoading && currentUser ? (
        <>
          {/*  Compact View (Mobile + Tablet): One panel at a time */}
          {isCompactView ? (
            <>
              {shouldShowContactList && (
                <ContactListPanel onOpenChat={() => setShowChatPanel(true)} />
              )}

              {shouldShowChatPanel && (
                <ChatPanel
                  onBack={() => setShowChatPanel(false)}
                  onViewContact={() => setShowDetailsPanel(true)}
                />
              )}

              {shouldShowDetailsPanel && (
                <DetailsPanel onBack={() => setShowDetailsPanel(false)} />
              )}
            </>
          ) : (
            <>
              {/*  Desktop View: Show panels side by side */}
              <ContactListPanel />

              {shouldShowChatPanel && (
                <ChatPanel onViewContact={() => setShowDetailsPanel(true)} />
              )}

              {shouldShowDetailsPanel && (
                <DetailsPanel onBack={() => setShowDetailsPanel(false)} />
              )}
            </>
          )}
        </>
      ) : (
        <Home />
      )}

      {/* Notifications always visible */}
      <Notifications />
    </div>
  );
};

export default App;
