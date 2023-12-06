'use client'

import Image from 'next/image'
import { PostOtp, PostPassword, Signup, UserDetails } from '../components/index'
import { useAtom } from 'jotai'
import { otpSentAtom, otpVerifiedAtom, darkModeAtom, isPostOtpCompleteAtom, isPostPassCompleteAtom } from '../store';
import LogoW from "../../public/assets/Logo-W.svg";
import Logo from "../../public/assets/Logo.svg"
import { IoSunnySharp, IoSunnyOutline } from "react-icons/io5";


export default function Home() {
  const [otpVerified] = useAtom(otpVerifiedAtom);
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  const [isPostOtpComplete] = useAtom(isPostOtpCompleteAtom);
  const [isPostPassComplete] = useAtom(isPostPassCompleteAtom);

  return (
    <>
    <div className={`flex font-Inter justify-center items-center w-full h-screen box-border ${darkMode ? 'bg-[#EFF5F5] text-black' : 'bg-[#115E59]'} flex-col gap-10 p-16`}>
      <Image src={darkMode ? Logo : LogoW} alt='logo' className='absolute self-start align-top top-5 left-4'/>
      {darkMode ? <IoSunnySharp className='absolute float-right top-5 right-5' color='#115E59'  size={'2rem'} onClick={()=> setDarkMode(false)}/> : <IoSunnyOutline className='absolute float-right top-5 right-5' color='white' size={'2rem'} onClick={()=> setDarkMode(true)}/>}

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
