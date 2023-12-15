'use client'
import React, { useEffect } from 'react'

import { useAtom } from 'jotai';
import { sessionAtom } from './store';

import supabase from '../config/supabse';



const Intial = () => {

  const [userSession, setUserSession] = useAtom(sessionAtom);


  async function getSess() {
    await supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserSession(session);
      }

    });
  };

  useEffect(() => {
    getSess();
    
  }, [])



  return (
    null
  )
}

export default Intial