import React from 'react'
import Login from '../Login/Login'
import SignUp from '../SignUp/SignUp'
import './Home.css'
import { useState } from 'react'
const Home = () => {
   const [focusLoginEmail, setFocusLoginEmail] = useState(false);

   const handleSignupSuccess = () => {
    setFocusLoginEmail(true);
    setTimeout(() => setFocusLoginEmail(false), 500); // Reset after focus
  };

  return (
    <div className='homeContainer'>
      <Login focusEmail={focusLoginEmail} />
      <div className='seperator'></div>
      <SignUp onSignupSuccess={handleSignupSuccess} />
    </div>
  )
}

export default Home
