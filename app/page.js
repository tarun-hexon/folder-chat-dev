'use client'

import { useAtom } from 'jotai'
import { allowSessionAtom, sessionAtom } from './store';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function Home() {


  const [session, setSession] = useAtom(sessionAtom); 
  const [allowSession, setAllowSession] = useAtom(allowSessionAtom);


  const router = useRouter() 
  
useEffect(()=> {
  if(allowSession){
    router.push('/chat')
  }else{
    router.push('/signup')
  }
  
  

}, [allowSession]);

  return (
    <div className='flex w-full justify-center items-center h-screen'>
        <Loader2 className='animate-spin' />
      </div>
  )
}
