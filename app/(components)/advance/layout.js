'use client'

import { useEffect } from "react";
import { useAtom } from 'jotai';
import { sessionAtom, userConnectorsAtom, showAdvanceAtom, allIndexingConnectorAtom } from '../../store';
import supabase from "../../../config/supabse";

export default function RootLayout({ children }) {
    const [allConnectors, setAllConnectors] = useAtom(userConnectorsAtom);
    const [showAdvance, setShowAdvance] = useAtom(showAdvanceAtom);
    const [session, setSession] = useAtom(sessionAtom);
    const [allConnectorFromServer, setAllConnectorFromServer] = useAtom(allIndexingConnectorAtom);



    useEffect(()=> {
        setShowAdvance(true)
    }, []);


  return (
    <div className='w-full flex font-Inter box-border'>        
        { children }
    </div>
  )
}
