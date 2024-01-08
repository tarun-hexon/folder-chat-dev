'use client'

import { useAtom } from 'jotai'
import { sessionAtom } from './store';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function Home() {


  const [session, setSession] = useAtom(sessionAtom); 
  const router = useRouter() 
  
useEffect(()=> {
  if(session){
    router.push('/chat')
  }else{
    router.push('/signup')
  }
}, [])


  return (
    <div className='flex w-full justify-center items-center h-screen'>
        <Loader2 className='animate-spin' />
      </div>
  )
}
