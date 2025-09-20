// import React, { useEffect, useState } from "react";
// import ContactListPanel from "./Components/ContactListPanel/ContactListPanel";
// import ChatPanel from "./Components/ChatPanel/ChatPanel";
// import DetailsPanel from "./Components/DetailsPanel/DetailsPanel";
// // import Login from './Pages/Login/Login'
// // import SignUp from './Pages/SignUp/SignUp'
// import Home from "./Pages/Home/Home";
// import Notifications from "./Notifications/Notifications";
// import { onAuthStateChanged } from "firebase/auth";
// import { authentication } from "./ConfigFirebase/ConfigFirebase";
// import { useUserStore } from "./Zustand/userStore";
// import { useChatStore } from "./Zustand/chatStore";
// // import { Route,Routes } from 'react-router-dom'

// const App = () => {
//   const { currentUser, isLoading, fetchUserInfo, setCurrentUser } =
//     useUserStore();
//   const { chatId } = useChatStore();

//   // handling mobile view state for responsive design
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const [showChatOnMobile, setShowChatOnMobile] = useState(false);

//   // new state variable to control whether to show the ChatPanel or DetailsPanel.
//   const [showDetailsPanel, setShowDetailsPanel] = useState(false);

//   // 📱 Handle screen resizing
//   useEffect(() => {
//     const handleResize = () => {
//       const isNowMobile = window.innerWidth <= 768;
//       setIsMobile(isNowMobile);

//       // Reset mobile view toggle when resizing to desktop
//       if (!isNowMobile) setShowChatOnMobile(false);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   //  Auth listener
//   useEffect(() => {
//     const unSub = onAuthStateChanged(authentication, (user) => {
//       if (user) {
//         console.log("Firebase UID:", user.uid);
//         fetchUserInfo(user?.uid);
//       } else {
//         setCurrentUser(null);
//         // setTimeout({ currentUser:null, isLoading: false });
//       }
//     });

//     return () => {
//       unSub();
//     };
//   }, [fetchUserInfo, setCurrentUser]);

//   console.log(currentUser, "iam a current user");

//   //  Loading fallback
//   if (isLoading) {
//     return (
//       <div className="loading">
//         <div className="spinner"></div>
//         <p>Loading.....</p>
//       </div>
//     );
//   }

//   return (
//     <div className="appContainer">
//       {!isLoading && currentUser ? (
//         <>
//           {isMobile ? (
//             <>
//               {!chatId || !showChatOnMobile ? (
//                 <ContactListPanel
//                   onOpenChat={() => setShowChatOnMobile(true)}
//                 />
//               ) : showDetailsPanel ? (
//                 <DetailsPanel onBack={() => setShowDetailsPanel(false)} /> // 👈 Mobile view
//               ) : (
//                 <ChatPanel
//                   onBack={() => setShowChatOnMobile(false)}
//                   onViewContact={() => setShowDetailsPanel(true)} // 👈 Pass handler
//                 />
//               )}
//             </>
//           ) : (
//             <>
//               <ContactListPanel />
//               {chatId && !showDetailsPanel && (
//                 <ChatPanel onViewContact={() => setShowDetailsPanel(true)} />
//               )}
//               {chatId && showDetailsPanel && (
//                 <DetailsPanel onBack={() => setShowDetailsPanel(false)} />
//               )}
//             </>
//           )}
//         </>
//       ) : (
//         <Home />
//       )}
//       <Notifications />
//     </div>
//   );
// };
// export default App;

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
