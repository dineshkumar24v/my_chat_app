import React from 'react'
import Login from '../Login/Login'
import SignUp from '../SignUp/SignUp'
import './Home.css'
const Home = () => {
  return (
    <div className='homeContainer'>
      <Login/>
      <div className='seperator'></div>
      <SignUp/>
    </div>
  )
}

export default Home
