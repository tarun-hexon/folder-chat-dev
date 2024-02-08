'use client'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import supabase from '../../../config/supabse';
import { useAtom } from 'jotai';
import { sessionAtom, userConnectorsAtom, allIndexingConnectorAtom } from '../../store';

const Chat = () => {
  const router = useRouter();
  const [session, setSession] = useAtom(sessionAtom);


    useEffect(()=> {
      // if (session) {
      //   if (session?.user?.user_metadata?.onBoarding) {
      //     router.push('/chat/new')
      //   } else {
      //     router.push('/auth/signup')
      //   }
      // }
      // else {
      //   router.push('/auth/login')
      // }
      // console.log(session)
      // if (session) {
      //   router.push('/chat/new')
      // }
      // else {
      //   router.push('/auth/login')
      // }
      router.push('/chat/new')
    }, []);


  return (
      <div className='flex w-full justify-center items-center h-screen'>
        <Loader2 className='animate-spin' />
      </div>
    
  )
}

export default Chat