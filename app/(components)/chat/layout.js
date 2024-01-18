'use client'

import { useEffect } from "react"
import { documentSetAtom, folderIdAtom, existConnectorDetailsAtom, allIndexingConnectorAtom } from "../../store"
import { useAtom } from "jotai"
import supabase from "../../../config/supabse"

export default function RootLayout({ children }) {
    const [folderId, setFolderId] = useAtom(folderIdAtom);
    const [documentSet, setDocumentSet] = useAtom(documentSetAtom);
    const [existConnectorDetails, setExistConnectorDetails] = useAtom(existConnectorDetailsAtom);
    const [allConnectorFromServer, setAllConnectorFromServer] = useAtom(allIndexingConnectorAtom);

    async function indexingStatus(f_id){
        try {
            // const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/connector/indexing-status`);
            // const json = await data.json();
            // const isId = json.filter(da => da.credential.credential_json.id.includes(12));
            
            const allConID = await readData(f_id);
            
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
    
    async function readData(f_id){
        let fol_id = f_id
        if(!f_id){
          fol_id = localStorage.getItem('folderId')
        }
        console.log(fol_id)
        const { data, error } = await supabase
        .from('document_set')
        .select('*')
        .eq('folder_id', fol_id);
        
        if(data?.length > 0){
          
          setDocumentSet(data)
          return data[0].cc_pair_id
        }else{
          setDocumentSet([])
        }
    };

    useEffect(()=> {
        setTimeout(()=> {if(folderId !== '' && folderId !== 'undefined'){
          indexingStatus(folderId)
      }}, 5000)
    }, [folderId])

  return (
    <div>
        { children }
    </div>
  )
}