import React, { useState } from 'react';
import './addUser.css';
import { Modal } from 'react-bootstrap';
import { collection, getDocs, query, serverTimestamp, where, setDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import {db} from '../../../../ConfigFirebase/ConfigFirebase'
import { useUserStore } from '../../../../Zustand/userStore';

const AddUser = ({ show, onHide }) => {
  const [user, setUser] = useState(null)
  const {currentUser}= useUserStore();

  const handleSearch = async (e) =>{
    e.preventDefault()
    const formData = new FormData(e.target)
    const username = formData.get("username")
    
    try{
      const userRef = collection(db, "users");

      // Create a query against the collection.
      const q = query(userRef, where("username", "==", username));

      const querySnapShot = await getDocs(q) 

      if(!querySnapShot.empty){
        setUser(querySnapShot.docs[0].data())
      }
  
      
    }catch(err){
      console.log(err)
    }
  }

  const handleAdd = async () =>{
    const chatRef = collection(db, "chats")
    const userChatsRef = collection(db, "userChats") 


    try{
      const newChatRef = doc(chatRef) 

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      })

      await updateDoc(doc(userChatsRef, user.id),{
        chats: arrayUnion({ // array union function allows us to push any item into it
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef, currentUser.id),{
        chats: arrayUnion({ // array union function allows us to push any item into it
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });

      console.log(newChatRef.id)
    }catch(err){
      console.log(err)
    }
  }
  
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add / search user
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="addUser">
        <form onSubmit={handleSearch}>
          <input type='text' placeholder='Username' name='username'/>
          <button>Search</button> 
        </form>        
        {user && <div className='user'>
          <div className='detail'>
            <img src={user.avatar || 'user.png'} alt="User"/>
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>}
      </Modal.Body>
    </Modal>
  );
};

export default AddUser;


// import React, { useState } from 'react';
// import './addUser.css';
// import { Modal, Spinner } from 'react-bootstrap';
// // import defaultAvatar from '../../../assets/user.png'; // Import default avatar

// const AddUser = ({ show, onHide }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isSearching, setIsSearching] = useState(false);
//   const [searchResults, setSearchResults] = useState([]);
  
//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (!searchTerm.trim()) return;
    
//     setIsSearching(true);
//     try {
//       // Simulate API call
//       setTimeout(() => {
//         setSearchResults([{
//           id: '1',
//           username: 'Dinesh',
//           avatar: null
//         }]);
//         setIsSearching(false);
//       }, 1000);
//     } catch (error) {
//       console.error("Search error:", error);
//       setIsSearching(false);
//     }
//   };

//   return (
//     <Modal
//       show={show}
//       onHide={onHide}
//       size="lg"
//       aria-labelledby="contained-modal-title-vcenter"
//       centered
//     >
//       <Modal.Header closeButton>
//         <Modal.Title id="contained-modal-title-vcenter">
//           Add / search user
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body className="addUser">
//         <form onSubmit={handleSearch}>
//           <input 
//             type='text' 
//             placeholder='Username' 
//             name='username'
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             disabled={isSearching}
//           />
//           <button type="submit" disabled={isSearching}>
//             {isSearching ? <Spinner animation="border" size="sm" /> : 'Search'}
//           </button> 
//         </form>        
        
//         {isSearching ? (
//           <div className="text-center my-3">
//             <Spinner animation="border" />
//           </div>
//         ) : searchResults.length > 0 ? (
//           searchResults.map(user => (
//             <div className='user' key={user.id}>
//               <div className='detail'>
//                 <img src={user.avatar || 'user.png'} alt={user.username}/>
//                 <span>{user.username}</span>
//               </div>
//               <button>Add User</button>
//             </div>
//           ))
//         ) : searchTerm && (
//           <p className="text-center my-3">No users found</p>
//         )}
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default AddUser;