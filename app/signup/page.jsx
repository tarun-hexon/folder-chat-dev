'use client'

import Image from 'next/image'
import { PostOtp, PostPassword, Signup, UserDetails } from '../components/index'
import { useAtom } from 'jotai'
import { otpSentAtom, otpVerifiedAtom, darkModeAtom, isPostOtpCompleteAtom, isPostPassCompleteAtom } from '../store';
import LogoW from "../../public/assets/Logo-W.svg";
import Logo from "../../public/assets/Logo.svg"

export default function Home() {
  const [otpVerified] = useAtom(otpVerifiedAtom);
  const [darkMode] = useAtom(darkModeAtom);
  const [isPostOtpComplete] = useAtom(isPostOtpCompleteAtom);
  const [isPostPassComplete] = useAtom(isPostPassCompleteAtom);

  return (
    <>
    <div className={`flex font-Inter justify-center items-center w-full h-screen box-border ${darkMode ? 'bg-[#EFF5F5] text-black' : 'bg-[#115E59]'} flex-col gap-10 p-16`}>
      <Image src={darkMode ? Logo : LogoW} alt='logo' className='absolute self-start align-top top-5 left-4'/>
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
