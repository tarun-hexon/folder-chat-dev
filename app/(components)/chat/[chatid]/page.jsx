'use client'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { sessionAtom, documentSetAtom } from '../../../store'
import { useRouter } from 'next/navigation'
import supabase from '../../../../config/supabse'
import { Loader2 } from 'lucide-react'
import ChatWindow from './ChatWindow';



const Chat = () => {
  const [session, setSession] = useAtom(sessionAtom);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // const [folder, setFolder] = useAtom(folderAtom);
  // const [folderId, setFolderId] = useAtom(folderIdAtom);
  const [existConnector, setExistConnector] = useAtom(documentSetAtom);
 
  const current_url = window.location.href;

  const chat_id = current_url.split("/chat/")[1];
  

  // async function getSess() {
  //   await supabase.auth.getSession().then(({ data: { session } }) => {
  //     if (session) {
  //       setUserSession(session);
  //       if (session?.user?.user_metadata?.onBoarding) {
  //         setLoading(false)
  //         // router.push('/chat/new')
  //       } else {
  //         router.push('/signup')
  //       }

  //     }
  //     else {
  //       setLoading(false)
  //       router.push('/login')
  //     }
  //   });
  // };

  async function readData(f_id){
    let fol_id = f_id
      // console.log(f_id)
      if(!fol_id){
        return null
      }
      // console.log(fol_id)
      const { data, error } = await supabase
      .from('document_set')
      .select('*')
      .eq('folder_id', fol_id);
      // console.log(data)
      console.log(error)
      setExistConnector(data)
      // if(data?.length > 0){
        
      //   setExistConnector(data)
      //   return data[0].cc_pair_id
      // }else{
        // alert('line 404')
        // setExistConnector([]);
        // router.push('/chat/upload')
      // }
  };

useEffect(() => {
  if (session) {
    if (session?.user?.user_metadata?.onBoarding) {
      setLoading(false)
      // router.push('/chat/new')
    } else {
      router.push('/auth/signup')
    }

  }
  else {
    setLoading(false)
    router.push('/auth/login')
  }
  // setTimeout(()=> {
    // if(folderId === '' || folderId === null){
    //   console.log(folderId)
    //   indexingStatus(localStorage.getItem('lastFolderId'));
    // }else{
    //   indexingStatus(folderId);
    // }
// }, 1000)

    
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


  if (loading || !session) {
    return (
      <div className='flex w-full justify-center items-center h-screen'>
        <Loader2 className='animate-spin' />
      </div>
    )
  };

  return (

    !loading &&

        <div className='w-full h-screen'>
          <ChatWindow />
        </div>

  )
}

export default Chat