  import React, { useEffect } from 'react'
  import ContactListPanel from './Components/ContactListPanel/ContactListPanel'
  import ChatPanel from './Components/ChatPanel/ChatPanel'
  import DetailsPanel from './Components/DetailsPanel/DetailsPanel'
  // import Login from './Pages/Login/Login'
  // import SignUp from './Pages/SignUp/SignUp'
  import Home from './Pages/Home/Home'
  import Notifications from './Notifications/Notifications'
  import { onAuthStateChanged } from 'firebase/auth'
  import { authentication } from './ConfigFirebase/ConfigFirebase'
  import { useUserStore } from './Zustand/userStore'
  import { useChatStore } from './Zustand/chatStore'
  // import { Route,Routes } from 'react-router-dom'

  const App = () => {
    const { currentUser, isLoading, fetchUserInfo } = useUserStore();
    const {chatId} = useChatStore();
    

    useEffect(() => {
      const unSub = onAuthStateChanged(authentication, (user) => {
          if(user){
            console.log(user.uid) 
            fetchUserInfo(user?.uid);
          }
      });
      
      return () => {
        unSub();
      }
    }, [fetchUserInfo]);

    console.log(currentUser, "iam a current user") 

    if (isLoading) {
      return (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading.....</p>
        </div>
      );
    }

    return(
      <div className='appContainer'>
        {!isLoading && currentUser ? (
          <>
            <ContactListPanel/>
            {chatId && <ChatPanel/>}
            {chatId && <DetailsPanel/>}
          </>
        ) : (
          <Home/>
        )}
          <Notifications/>
      </div>
    )
  };
  export default App