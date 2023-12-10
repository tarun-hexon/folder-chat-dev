'use client'

import { useAtom } from 'jotai'
import { sessionAtom } from './store';

import { useRouter } from 'next/navigation';

export default function Home() {


  const [session, setSession] = useAtom(sessionAtom); 
  const router = useRouter() 
  
  if(session){
    router.push('/chat')
  }else{
    router.push('/signup')
  }


  return (
    null
  )
}
