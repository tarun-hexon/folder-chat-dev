'use client'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import supabase from '../../../config/supabse';
import { useAtom } from 'jotai';
import { sessionAtom, folderIdAtom, documentSetAtom, existConnectorDetailsAtom, allIndexingConnectorAtom } from '../../store';

const Chat = () => {
  const router = useRouter();
  const [session, setSession] = useAtom(sessionAtom);
    
    // async function getSess() {
    //   await supabase.auth.getSession().then(({ data: { session } }) => {
    //     if (session) {
    //       setUserSession(session);
    //       if (session?.user?.user_metadata?.onBoarding) {
    //         router.push('/chat/new')
    //       } else {
    //         router.push('/signup')
    //       }
  
    //     }
    //     else {
         
    //       router.push('/login')
    //     }
    //   });
    // };
    const [folderId, setFolderId] = useAtom(folderIdAtom);
    const [documentSet, setDocumentSet] = useAtom(documentSetAtom);
    const [existConnectorDetails, setExistConnectorDetails] = useAtom(existConnectorDetailsAtom);
    const [allConnectorFromServer, setAllConnectorFromServer] = useAtom(allIndexingConnectorAtom);

    // async function indexingStatus(f_id){
    //     try {
    //         // const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/connector/indexing-status`);
    //         // const json = await data.json();
    //         // const isId = json.filter(da => da.credential.credential_json.id.includes(12));
            
    //         const allConID = await readData(f_id);
            
    //         var cc_p_id = []
    //         for(const cc_id of allConnectorFromServer){
    //           if(allConID?.includes(cc_id?.cc_pair_id)){
    //             cc_p_id.push(cc_id)
    //           }
    //         };
    //         setExistConnectorDetails(cc_p_id)
    //         return cc_p_id
    //     } catch (error) {
    //         console.log(error)
            
    //     }
    
    // };
    
    // async function readData(f_id){
    //     const { data, error } = await supabase
    //     .from('document_set')
    //     .select('*')
    //     .eq('folder_id', f_id);
        
    //     if(data?.length > 0){
          
    //       setDocumentSet(data)
    //       return data[0].cc_pair_id
    //     }else{
    //       setDocumentSet([])
    //     }
    // };

    // useEffect(()=> {
    //   console.log('fold', folderId)
    //   indexingStatus(folderId)
    // }, [folderId]);

    useEffect(()=> {
      if (session) {
        if (session?.user?.user_metadata?.onBoarding) {
          router.push('/chat/new')
        } else {
          router.push('/signup')
        }
      }
      else {
        router.push('/login')
      }
    }, []);


  return (
      <div className='flex w-full justify-center items-center h-screen'>
        <Loader2 className='animate-spin' />
      </div>
  )
}

export default Chat