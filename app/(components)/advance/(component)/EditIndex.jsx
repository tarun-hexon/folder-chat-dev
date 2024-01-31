import React, { useEffect, useRef, useState } from 'react'
import { DialogContent } from '../../../../components/ui/dialog';
import { cn } from '../../../../lib/utils';
import supabase from '../../../../config/supabse';
import { Loader2 } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../../../components/ui/tooltip"
import { fetchConnectorStatus } from '../../../../lib/helpers';
import { useToast } from '../../../../components/ui/use-toast';
import { sessionAtom, userConnectorsAtom, folderIdAtom, tempAtom } from '../../../store';
import { useAtom } from 'jotai';


const EditIndex = ({ cc_pair_id, setOpen }) => {
    const { toast } = useToast();
    const [session, setSession] = useAtom(sessionAtom)
    const [connectorDetails, setConnectorDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userConnectorId, setUserConnectorId] = useState([]);
    const [userConnectors, setUserConnectors] = useAtom(userConnectorsAtom);
    const [documentSet, setDocumentSet] = useState([]);
    const [folderId, setFolderId] = useAtom(folderIdAtom);
    const [temp, setTemp] = useAtom(tempAtom)
    const body = useRef(null)

    async function connectorStatus(id) {
        try {
            const data = await fetchConnectorStatus(id);
            setConnectorDetails(data);
            body.current = data
            
        } catch (error) {
            console.log(error)
        }
    };
    async function getDocSetDetails(folID){
        if(!folID){
            return null
        }
        let { data: document_set, error } = await supabase
          .from('document_set')
          .select("*")
          .eq('folder_id', folID)

          if(document_set?.length > 0){
            setDocumentSet(document_set)
            
          }else{
            setDocumentSet([])
            
          }
          
      }
    //will delete this api call we already storing data in atom 
    async function getConnectorsID(){
        // console.log(documentSet)
        const { data, error } = await supabase
        .from('connectors')
        .select('connect_id')
        .eq('user_id', session?.user?.id);
        
        if(data?.length > 0){
            // console.log(data)
            setUserConnectorId(data[0]?.connect_id)
        }
        return []
    };

    async function disableConnector(bodyData){
        bodyData.current.connector.disabled = !bodyData.current.connector.disabled
        
        try {
            const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/connector/${bodyData.current.connector.id}`, {
                method:'PATCH',
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify(bodyData.current.connector)
            });
            const json = await data.json();
            const updatedData = {
                ...connectorDetails,
                connector: {
                  ...connectorDetails.connector,
                  disabled: json.disabled
                },
              };
              setConnectorDetails(updatedData);
              if(bodyData.current.connector.disabled){
                toast({
                    variant:'default',
                    description:'Connector Disabled Successfully!'
                  })
              }else{
                toast({
                    variant:'default',
                    description:'Connector Enabled Successfully!'
                  })
              }
            //   setOpen(false)
        } catch (error) {
            console.log(error)
        }
    }
    async function deleteConnector(bodyData){
        if(!bodyData.current.connector.disabled) return null
        setLoading(true)
        try {
            const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/deletion-attempt`, {
                method:'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    "connector_id": bodyData?.current?.connector?.id,
                    "credential_id": bodyData?.current?.credential?.id
            })
            });
            const json = await data.json();

            let exConn = [...userConnectorId]
            const index = exConn.indexOf(bodyData?.current?.connector?.id);
            //logic to delete cc id from doc set, need to identify folder id 
            if(documentSet !== null && documentSet.length > 0){
                let idxOfID = documentSet[0]?.cc_pair_id.indexOf(bodyData?.current?.cc_pair_id)

                //storing by value not by refrence
                const ccIDs = [...documentSet[0]?.cc_pair_id]
                const names = [...documentSet[0]?.files_name]
                
                ccIDs.splice(idxOfID, 1)
                names.splice(idxOfID, 1)
                
                if(ccIDs.length > 0){

                    await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/document-set`, {
                        method: 'PATCH',
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          "id": documentSet[0]?.doc_set_id,
                          "description": '',
                          "cc_pair_ids": ccIDs
                        })
                      })

                    const {data, error} = await supabase
                    .from('document_set')
                    .update(
                        { 'cc_pair_id': ccIDs, 'files_name' : names },
                    )
                    .eq('folder_id', documentSet[0]?.folder_id)
                    .select();
                    if(!error){
                        setDocumentSet(data)
                    }
                }else{
                    await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/document-set/${documentSet[0]?.doc_set_id}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    await supabase
                    .from('document_set')
                    .delete()
                    .eq('folder_id', documentSet[0]?.folder_id);
                    setDocumentSet([])
                }
            }
            exConn.splice(index, 1)
            
            if(exConn?.length > 0){
                await supabase
                .from('connectors')
                .update({ 'connect_id': exConn })
                .eq('user_id', session?.user?.id);
            }else{
                await supabase
                .from('connectors')
                .delete()
                .eq('user_id', session?.user?.id);
            }

            toast({
                variant:'default',
                description:'Connector Deleted Successfully!'
            })
            setTemp(!temp)
            setOpen(false);
            setLoading(false)
            return null
            
        } catch (error) {
            console.log(error)
        }
    }
    
    useEffect(() => {
        connectorStatus(cc_pair_id)
        getConnectorsID()
    }, []);

    if (connectorDetails === null || loading) {
        return <Loader2 className='animate-spin m-auto' />
    }
    return (

        <div className='w-full space-y-10 break-all flex flex-col'>
            <h1 className='text-lg font-[600] px-2 text-start'>{connectorDetails?.name}</h1>
            <div className='w-full flex justify-around'>
                <Button className={cn(`${body?.current?.connector?.disabled ? 'bg-[#14B8A6] hover:bg-[#14B8A6]' : 'bg-[#F6BE00] hover:bg-[#F6BE00]'} hover:opacity-75`)} onClick={()=> disableConnector(body)}>{body.current.connector.disabled ? 'Re-Enable' : 'Disable'}</Button>
                <TooltipProvider >
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant={'destructive'} className={cn(connectorDetails?.connector?.disabled ? 'cursor-pointer ' : 'cursor-not-allowed opacity-50')} onClick={()=> deleteConnector(body)}>Delete</Button>
                            
                        </TooltipTrigger>
                        {!connectorDetails?.connector?.disabled && <TooltipContent className={cn('w-[60%] break-words m-auto text-justify bg-gray-500 text-white opacity-90')}>
                                <p className='text-sm leading-5 font-[400]'>You must disable the connector first before deleting it</p>
                        </TooltipContent>}
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
}

export default EditIndex