'use client'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { sessionAtom } from '../../../../../store'
import { useRouter } from 'next/navigation'
import supabase from '../../../../../../config/supabse'
import { Loader2 } from 'lucide-react'
import ChatWindow from './ChatWindow';



const Chat = () => {
  const [session, setSession] = useAtom(sessionAtom);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

 
  // const current_url = window.location.href;

  // const chat_id = current_url.split("/chat/")[1];
  

useEffect(() => {
  
  setLoading(false)
  

    
  }, []);


  // useEffect(()=> {
  //   if(folderId !== ''){
  //     console.log(folderId)
  //     readData(folderId)
  //   }
  //   console.log(folderId, 'folid')
  // }, [folderId]);


  // useEffect(()=> {
    
  //     console.log(existConnector)
  // },[existConnector])


  // if (loading || !session) {
  //   return (
  //     <div className='flex w-full justify-center items-center h-screen'>
  //       <Loader2 className='animate-spin' />
  //     </div>
  //   )
  // };

  return (

    // !loading &&

        <div className='w-full h-full'>
          <ChatWindow />
        </div>

  )
}

export default Chat