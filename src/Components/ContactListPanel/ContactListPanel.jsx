import React from 'react'
import './ContactListPanel.css'
import UserInfo from './UserInfo/UserInfo'
import UserList from './UsersList/UserList'

const ContactListPanel = ({onOpenChat}) => {
  return (
    <div className='listCont'>
      <UserInfo/>
      <UserList onSelectChat={onOpenChat}/>
    </div>
  );
};

export default ContactListPanel
