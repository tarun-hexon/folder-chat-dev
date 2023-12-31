import React, { useEffect, useRef, useState } from 'react'
import { DialogContent } from '../../../components/ui/dialog';
import { cn } from '../../../lib/utils';
import { Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../../components/ui/tooltip"


const EditIndex = ({ cc_pair_id }) => {

    const [connectorDetails, setConnectorDetails] = useState(null);
    const body = useRef(null)

    async function connectorStatus(id) {
        try {
            const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/cc-pair/${id}`);
            const json = await data.json();
            setConnectorDetails(json);
            body.current = json
            console.log(json)
        } catch (error) {
            console.log(error)
        }
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
        } catch (error) {
            console.log(error)
        }
    }
    async function deleteConnector(bodyData){
        if(!bodyData.current.connector.disabled) return null
        try {
            const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/deletion-attempt`, {
                method:'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    "connector_id": bodyData.current.connector.id,
                    "credential_id": bodyData.current.credential.id
            })
            });
            const json = await data.json();
            console.log(json)
            
        } catch (error) {
            console.log(error)
        }
    }
    // {
    //     "id": 11,
    //     "name": "https://en.wikipedia.org/wiki/Artificial_intelligence",
    //     "num_docs_indexed": 20,
    //     "connector": {
    //         "name": "WebConnector-https://en.wikipedia.org/wiki/Artificial_intelligence",
    //         "source": "web",
    //         "input_type": "load_state",
    //         "connector_specific_config": {
    //             "base_url": "https://en.wikipedia.org/wiki/Artificial_intelligence"
    //         },
    //         "refresh_freq": 86400,
    //         "disabled": false,
    //         "id": 10,
    //         "credential_ids": [
    //             10
    //         ],
    //         "time_created": "2023-12-29T16:20:22.022944+00:00",
    //         "time_updated": "2023-12-29T16:20:22.022944+00:00"
    //     },
    //     "credential": {
    //         "credential_json": {},
    //         "admin_public": true,
    //         "id": 10,
    //         "user_id": null,
    //         "time_created": "2023-12-29T16:20:22.612335+00:00",
    //         "time_updated": "2023-12-29T16:20:22.612335+00:00"
    //     },
    //     "index_attempts": [
    //         {
    //             "id": 12,
    //             "status": "success",
    //             "new_docs_indexed": 20,
    //             "total_docs_indexed": 20,
    //             "error_msg": null,
    //             "time_started": "2023-12-29T16:20:39.274964+00:00",
    //             "time_updated": "2023-12-29T16:26:16.787347+00:00"
    //         }
    //     ],
    //     "latest_deletion_attempt": null
    // }
    useEffect(() => {
        connectorStatus(cc_pair_id)
    }, []);

    if (connectorDetails === null) {
        return <Loader2 className='animate-spin m-auto' />
    }
    return (

        <div className='w-full space-y-10'>
            <h1 className='text-lg font-[600]'>{connectorDetails.name}</h1>
            <div className='w-full flex justify-around'>
                <Button variant={'default'} className={cn('bg-yellow-500 hover:bg-yellow-500 hover:opacity-70')} onClick={()=> disableConnector(body)}>{body.current.connector.disabled ? 'Enable' : 'Disable'}</Button>

                <TooltipProvider >
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant={'destructive'} className={cn(connectorDetails?.connector.disabled ? 'cursor-pointer ' : 'cursor-not-allowed opacity-50')} onClick={()=> deleteConnector(body)}>Delete</Button>
                            
                        </TooltipTrigger>
                        <TooltipContent className={cn('w-[60%] m-auto text-justify bg-gray-500 text-white opacity-60')}>
                                <p className='text-sm leading-5 font-[400]'>You Must Disabled the connector first before deleting it</p>
                            </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
}

export default EditIndex