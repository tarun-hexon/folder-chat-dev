'use client'
import React, { useEffect } from 'react'

import { useAtom } from 'jotai';
import { allowSessionAtom, sessionAtom, supabaseUserDataAtom } from './store';
import supabase from '../config/supabse';
import { isUserExist } from '../config/lib';



const Intial = () => {

  const [userSession, setUserSession] = useAtom(sessionAtom);
  const [userData, setUserData] = useAtom(supabaseUserDataAtom)
  const [allowSession, setAllowSession] = useAtom(allowSessionAtom);

  async function getSess() {
    try {
      await supabase.auth.getSession().then(async ({ data: { session } }) => {
        
        if (session) {
          setUserSession(session);
        }
        setAllowSession(true)
      });
    } catch (error) {
      console.log(error)
      setAllowSession(true)
    }
  };


  useEffect(() => {
    getSess();
  }, [])

// if(!userSession){
//   return <div>Loading...</div>
// }

  return (
    null
  )
}

export default Intial