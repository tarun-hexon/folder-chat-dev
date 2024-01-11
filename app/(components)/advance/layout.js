'use client'

import { useEffect, useState } from "react";
import { useAtom } from 'jotai';
import { sessionAtom, allConnectorsAtom } from '../../store';
import supabase from "../../../config/supabse";

export default function RootLayout({ children }) {
    const [allConnectors, setAllConnectors] = useAtom(allConnectorsAtom);

    const [session, setSession] = useAtom(sessionAtom);

    async function indexingStatus(){
        try {
            const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/connector/indexing-status`);
            const json = await data.json();
            console.log(json)
            const allConID = await readData();
            
            const filData = json.filter((item)=> { if(allConID?.includes(item?.connector?.id)) return item });
            
            setAllConnectors(filData);
            console.log(filData)
        } catch (error) {
            console.log(error)
            
        }

    };
    async function readData(){
        
        const { data, error } = await supabase
        .from('connectors')
        .select('connect_id')
        .eq('user_id', session.user.id);
        
        if(data.length > 0){
            var arr = []
            for(const val of data){
                arr.push(...val.connect_id)
            };
            return arr
        }
    };


    useEffect(()=> {
        
        indexingStatus()
        const int = setInterval(()=> {
            indexingStatus()
        }, 5000);

        return ()=> {
            clearInterval(int)
        }
    }, [])
  return (
    <div className='w-full flex font-Inter box-border'>        
        { children }
    </div>
  )
}
