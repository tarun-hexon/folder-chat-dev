'use client'

import { useAtom } from 'jotai'
import { allowSessionAtom, sessionAtom } from './store';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function Home() {


  const [session, setSession] = useAtom(sessionAtom); 
  const [show, setShow] = useAtom(allowSessionAtom);

  const router = useRouter() 
  
useEffect(()=> {
  if(show){
    if(session){
      router.push('/chat')
    }else{
      router.push('/signup')
    }
  }
  
  

}, [show]);

  return (
    <div className='flex w-full justify-center items-center h-screen'>
        <Loader2 className='animate-spin' />
      </div>
  )
}
