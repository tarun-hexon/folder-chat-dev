'use client'
import { useAtom } from 'jotai'
import React, { useEffect } from 'react'
import { darkModeAtom, sessionAtom } from '../store'
import { useRouter } from 'next/navigation'
import supabase from '../../config/supabse'

const Welcome = () => {
    const [session, setSession] = useAtom(sessionAtom);
    const [darkMode, setDarkMode] = useAtom(darkModeAtom);

    const router = useRouter();

    async function getSess() {
        await supabase.auth.getSession().then(({ data: { session } }) => {
          if(session){
            console.log(session)
            setSession(session);
          }
          else{
            router.push('/login')
          }
        });
      };

    useEffect(()=> {
        getSess()
    }, [])

  return (
    session && 
        <>
        <div className={`${darkMode ? 'text-black' : ''}`}>
        Hello {session?.user?.email}
        </div>
        </>
    
  )
}

export default Welcome