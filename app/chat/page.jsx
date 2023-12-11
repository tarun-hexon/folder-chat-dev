'use client'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { sessionAtom } from '../store'
import { useRouter } from 'next/navigation'
import supabase from '../../config/supabse'

import { SideBar, Header } from '../components'
import { Loader2 } from 'lucide-react'

const Chat = () => {
  const [userSession, setUserSession] = useAtom(sessionAtom);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  async function getSess() {
    await supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserSession(session);
        if(session?.user?.user_metadata?.onBoarding){
          setLoading(false)
        }else{
          router.push('/signup')
        }
        
      }
      else {
        setLoading(false)
        router.push('/login')
      }
    });
  };
useEffect(()=> {
  getSess()
}, [])

if(loading || !userSession){
  return (
    <div className='flex w-full justify-center items-center h-screen'>
      <Loader2 className='animate-spin'/>
    </div>
  )
}
  return (
    <Header>
    {!loading &&

    <div className='w-full flex h-screen justify-center items-center text-center flex-row'>
      
      <p className='text-4xl font-Inter'>Hello {userSession?.user?.email}</p>
    </div>}

    </Header>
  )
}

export default Chat