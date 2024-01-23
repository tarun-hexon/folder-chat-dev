'use client'

import { useEffect } from "react"
import { folderIdAtom, existConnectorDetailsAtom, allIndexingConnectorAtom } from "../../store"
import { useAtom } from "jotai"
import supabase from "../../../config/supabse"

export default function RootLayout({ children }) {
    const [folderId, setFolderId] = useAtom(folderIdAtom);

    const [existConnectorDetails, setExistConnectorDetails] = useAtom(existConnectorDetailsAtom);
    const [allConnectorFromServer, setAllConnectorFromServer] = useAtom(allIndexingConnectorAtom);

    async function indexingStatus(){
      if(allConnectorFromServer === null){
        return null
      }
        try {            
            const allConID = await readData();
            var cc_p_id = []
            for(const cc_id of allConnectorFromServer){
              if(allConID?.includes(cc_id?.cc_pair_id)){
                cc_p_id.push(cc_id)
              }
            };
            setExistConnectorDetails(cc_p_id)
            return cc_p_id
        } catch (error) {
            console.log(error)
            
        }
    
    };
    
    async function readData(){
        const { data, error } = await supabase
        .from('document_set')
        .select('*')
        .eq('folder_id', folderId);
        
        if(data?.length > 0){
          
          
          return data[0].cc_pair_id
        }else{
          
        }
    };

    useEffect(()=> {
      indexingStatus()
      
    }, [folderId])

  return (
    <div>
        { children }
    </div>
  )
}