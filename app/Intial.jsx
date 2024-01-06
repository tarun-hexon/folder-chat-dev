'use client'
import React, { useEffect } from 'react'

import { useAtom } from 'jotai';
import { sessionAtom, supabaseUserDataAtom } from './store';
import supabase from '../config/supabse';
import { isUserExist } from '../config/lib';



const Intial = () => {

  const [userSession, setUserSession] = useAtom(sessionAtom);
  const [userData, setUserData] = useAtom(supabaseUserDataAtom)

  async function getSess() {
    try {
      await supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session) {
          setUserSession(session);
          const data = await isUserExist('users', '*', 'email', session.user.email)
          setUserData(data[0])
        }
  
      });
    } catch (error) {
      console.log(error)
    }
  };


  useEffect(() => {
    getSess();
  }, [])



  return (
    null
  )
}

export default Intial