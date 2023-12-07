'use client'
import { useAtom } from 'jotai'
import React from 'react'
import { darkModeAtom, sessionAtom } from '../store'


const Welcome = () => {
    const [session, setSession] = useAtom(sessionAtom);
    const [darkMode, setDarkMode] = useAtom(darkModeAtom)
    if(!session){
        return (
            <div className={`${darkMode ? 'text-black' : ''}`}>
                You are not authenticated !
            </div>
        )
    }
  return (
    <div className={`${darkMode ? 'text-black' : ''}`}>
        Welcome {session?.user?.email}
    </div>
  )
}

export default Welcome