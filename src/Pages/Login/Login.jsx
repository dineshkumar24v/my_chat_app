import React, { useState } from 'react'
import {signInWithEmailAndPassword} from 'firebase/auth'
// import { Link, useNavigate } from "react-router-dom"
import {Form} from 'react-bootstrap'
import './Login.css'
import { toast } from 'react-toastify'
import { authentication } from '../../ConfigFirebase/ConfigFirebase'

import ContactListPanel from '../../Components/ContactListPanel/ContactListPanel'
import ChatPanel from '../../Components/ChatPanel/ChatPanel'
import DetailsPanel from '../../Components/DetailsPanel/DetailsPanel'

const Login = () => {
  // const navigate = useNavigate()
  const [loginDetails,setLoginDetails] = useState({email:"", password:""}) 

  const [loading,setLoading] =useState(false)

  const handleLoginSubmit = async(e)=>{
    e.preventDefault()
    setLoading(true);
    try{
      const loggedInUser = await signInWithEmailAndPassword(authentication,loginDetails.email,loginDetails.password)

      toast.success("successfully loggedIn") 
      
      // alert("LoggedIn successfully")
      console.log(loggedInUser.user, "iam from login page") 
      // navigate(
      //   <>
      //     <ContactListPanel />
      //   <ChatPanel />
      //   <DetailsPanel />
      //   </>
      // )
    }
    catch(err){
      console.log(err)
      toast.error(err.message) 
    }finally{
      setLoading(false)
    }
  } 
  return (
    <div className='loginContainer'>
    <div>
    <h1 className='loginh1'>Login</h1>
      <Form  onSubmit={handleLoginSubmit}>   {/* // form submit  */}
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="email" onChange={(e) =>setLoginDetails({...loginDetails, email:e.target.value })}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="password here" onChange={(e) =>setLoginDetails({...loginDetails, password: e.target.value })}/>
        </Form.Group>
        
        <button id='loginSubmitBtn' type="submit" disabled={loading}>{loading ? "Loading" : "Sign In"} </button>
        {/* <Link to="/signup" id='registerLink'>Register</Link> */}
      </Form>

    </div>
    </div>
  )
}

export default Login
