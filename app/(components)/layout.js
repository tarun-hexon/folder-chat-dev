'use client'

import { useAtom } from 'jotai';
import { SideBar } from './(common)';
import { allConnecorsAtom, sessionAtom } from '../store';
import { useEffect, useState } from 'react';
import supabase from '../../config/supabse';
import Logo from "../../public/assets/Logo.svg"
import shareIcon from '../../public/assets/Navbar_Share.svg'
import openDocIcon from '../../public/assets/Navbar_OpenDoc.svg'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { fetchCCPairId } from '../../lib/helpers';
import { Loader2 } from 'lucide-react';


export default function RootLayout({ children }) {
    const [session, setSession] = useAtom(sessionAtom);
    const [allConnectors, setAllConnectors] = useAtom(allConnecorsAtom);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    
    async function getSess() {
        await supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            if (!session?.user?.user_metadata?.onBoarding) {
              
              router.push('/signup')
            }else{
              setLoading(false)
            }
          }
          else {
            router.push('/login')
          }
        });
      };

async function getConn(){
        const connectors = await fetchCCPairId();
        if(connectors.length > 0){
          setAllConnectors(connectors)
        }
}
useEffect(()=> {
  getConn()   
  getSess()
}, []);

if(loading){
  return (
    <div className='flex w-full justify-center items-center h-screen'>
      <Loader2 className='animate-spin' />
    </div>
  )
}

return (
    <div className='w-full flex font-Inter box-border'>
        <div className={`w-[28%] min-h-screen sticky top-0 self-start`}>
            <SideBar />
        </div>
        <div className='w-full sticky top-0 self-start'>
        { children }
        </div>
    </div>
  )
}
