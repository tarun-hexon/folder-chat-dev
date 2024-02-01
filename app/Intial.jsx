'use client'
import React, { useEffect } from 'react'

import { useAtom } from 'jotai';
import { allowSessionAtom, sessionAtom, allIndexingConnectorAtom, userConnectorsAtom } from './store';
import supabase from '../config/supabse';
import { isUserExist } from '../config/lib';
import { test } from '../app/api/auth'


const Intial = () => {

  const [userSession, setUserSession] = useAtom(sessionAtom);
  const [allowSession, setAllowSession] = useAtom(allowSessionAtom);
  const [allConnectorFromServer, setAllConnectorFromServer] = useAtom(allIndexingConnectorAtom);
  const [userConnectors, setUserConnectors] = useAtom(userConnectorsAtom);

  async function getSess() {
    try {
      await supabase.auth.getSession().then(async ({ data: { session } }) => {
        // console.log(session)
        if (session) {
          setUserSession(session);
          setAllowSession(true)
          //indexingStatus(session)
        }
        
      });
    } catch (error) {
      console.log(error)
    }
  };

// async function indexingStatus(ses){
//     // console.log(ses)
//     try {
//         const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/connector/indexing-status`);
//         const json = await data?.json();
//         // console.log(json)
//         setAllConnectorFromServer(json)
//         const allConID = await readData(ses);
        
//         const filData = json?.filter((item)=> { if(allConID?.includes(item?.connector?.id)) return item });
        
//         setUserConnectors(filData);
//         // console.log(filData)
//     } catch (error) {
//         setUserConnectors([])
//         console.log(error)
//     }

// };

// async function readData(ses){
    
//     const { data, error } = await supabase
//     .from('connectors')
//     .select('connect_id')
//     .eq('user_id', ses?.user?.id);
    
//     if(data?.length > 0){
//         let arr = []
//         for(const val of data){
//             arr.push(...val.connect_id)
//         };
//         return arr
//     }
//     return []
// };




  useEffect(() => {
    // getSess();
    // test();
    // const int = setInterval(()=> {
    //   getSess()
    // }, 5000);

    // return ()=> {
    //   clearInterval(int)
    // }

  }, [])

// if(!userSession){
//   return <div>Loading...</div>
// }

  return (
    null
  )
}

export default Intial
