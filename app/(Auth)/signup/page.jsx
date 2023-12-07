'use client'
import {useEffect} from 'react'
import Image from 'next/image'
import { PostOtp, PostPassword, Signup, UserDetails } from '../../components/index'
import { useAtom } from 'jotai'
import { otpSentAtom, otpVerifiedAtom, darkModeAtom, isPostOtpCompleteAtom, isPostPassCompleteAtom, sessionAtom } from '../../store';


import supabase from '../../../config/supabse'
import { Button } from '../../../components/ui/button'


export default function Home() {
  const [otpVerified, setOtpVerified] = useAtom(otpVerifiedAtom);
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  const [isPostOtpComplete, setPostOtpComplete] = useAtom(isPostOtpCompleteAtom);
  const [isPostPassComplete] = useAtom(isPostPassCompleteAtom);
  const [otpSent, setOtpSent] = useAtom(otpSentAtom);

  const [session, setSession] = useAtom(sessionAtom);  
  

  return (
    <>
    <div className={`flex font-Inter justify-center items-center w-full h-screen box-border ${darkMode ? 'bg-[#EFF5F5] text-black' : 'bg-[#115E59]'} flex-col gap-10 p-16`}>

      {!otpVerified ? <div>
        <Signup />
        
      </div> :
      <div className='text-center'>
        { !isPostOtpComplete ? <PostOtp/> : ( !isPostPassComplete ? <PostPassword /> : <UserDetails />)}
        
      </div>}
      
    </div>
    </>
  )
}
