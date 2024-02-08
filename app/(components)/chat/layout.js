'use client'

import { useEffect } from "react"
import { folderIdAtom, allIndexingConnectorAtom, userConnectorsAtom, sessionAtom } from "../../store"
import { useAtom } from "jotai"
import supabase from "../../../config/supabse"

export default function RootLayout({ children }) {

    const [session, setSession] = useAtom(sessionAtom);
    const [folderId, setFolderId] = useAtom(folderIdAtom);
    const [allConnectorFromServer, setAllConnectorFromServer] = useAtom(allIndexingConnectorAtom)
    const [userConnectors, setUserConnectors] = useAtom(userConnectorsAtom);
    
    async function indexingStatus(ses){
      // console.log(ses)
      try {
          const data = await fetch(`/api/manage/admin/connector/indexing-status`);
          const json = await data?.json();
          // console.log(json)
          setAllConnectorFromServer(json)
          const allConID = await readData(ses);
          
          if(json?.length > 0){
            const filData = json?.filter((item)=> { if(allConID?.includes(item?.connector?.id)) return item });
          
            setUserConnectors(filData);
          }
          // console.log(filData)
      } catch (error) {
          setUserConnectors([])
          console.log(error)
      }
  
    };
  
  async function readData(ses){
      
      const { data, error } = await supabase
      .from('connectors')
      .select('connect_id')
      .eq('user_id', ses?.user?.id);
      
      if(data?.length > 0){
          let arr = []
          for(const val of data){
              arr.push(...val.connect_id)
          };
          return arr
      }
      return []
  };

    useEffect(()=> {
      indexingStatus()
    const int = setInterval(()=> {
      indexingStatus(session)
    }, 5000);

    return ()=> {
      clearInterval(int)
    }
      
    }, [])

  return (
    <div>
        { children }
    </div>
  )
}