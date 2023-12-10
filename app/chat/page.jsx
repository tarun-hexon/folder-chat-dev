'use client'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { darkModeAtom, onBoardCompleteAtom, sessionAtom } from '../store'
import { useRouter } from 'next/navigation'
import supabase from '../../config/supabse'

import { SideBar, Header } from '../components'

const Chat = () => {
  const [session, setSession] = useAtom(sessionAtom);
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  const [onBoarding, setOnBoarding] = useAtom(onBoardCompleteAtom);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  async function getSess() {
    await supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setOnBoarding(true);
        console.log(onBoarding)
      }
      else {
        router.push('/login')
      }
    });
  };

  useEffect(() => {
   getSess()
  }, []);

  

  return (
    <Header>
    {session &&

    <div className='w-full flex h-screen justify-center items-center text-center flex-row'>
      
      <p className='text-4xl font-Inter'>Hello {session?.user?.email}</p>
    </div>}

    </Header>
  )
}

export default Chat