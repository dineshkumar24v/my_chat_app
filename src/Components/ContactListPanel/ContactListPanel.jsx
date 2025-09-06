import React from 'react'
import './ContactListPanel.css'
import UserInfo from './UserInfo/UserInfo'
import UserList from './UsersList/UserList'

const ContactListPanel = () => {
  return (
    <div className='listCont'>
      <UserInfo/>
      <UserList/>
    </div>
  )
}

export default ContactListPanel
