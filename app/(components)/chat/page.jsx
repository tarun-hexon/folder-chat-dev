'use client'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import supabase from '../../../config/supabse';
import { useAtom } from 'jotai';
import { sessionAtom } from '../../store';

const Page = () => {
  const router = useRouter();
  const [userSession, setUserSession] = useAtom(sessionAtom);
    
    async function getSess() {
      await supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setUserSession(session);
          if (session?.user?.user_metadata?.onBoarding) {
            router.push('/chat/new')
          } else {
            router.push('/signup')
          }
  
        }
        else {
         
          router.push('/login')
        }
      });
    };
    
    useEffect(()=> {
        getSess();
    }, []);


  return (
      <div className='flex w-full justify-center items-center h-screen'>
        <Loader2 className='animate-spin' />
      </div>
  )
}

export default Page