'use client'

import React, { useContext } from 'react'
import {signOut} from "firebase/auth"
import { auth } from '@lib/firebase'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  const currentUser = {'uid':"asdassdasd",'username':'test','displayName':'asdsd','photoURL':'asd'}//useContext(AuthContext)

  return (
    <div className='navbar'>
      <span className="logo">Lama Chat</span>
      <div className="user">
        <img src={'/public/cam.png'} alt="" />
        <span>{currentUser.displayName}</span>
        <button onClick={()=>signOut(auth)}>logout</button>
      </div>
    </div>
  )
}

export default Navbar