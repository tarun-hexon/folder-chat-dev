'use client'
import {useEffect} from 'react'
import Image from 'next/image'
import { PostOtp, PostPassword, Signup, UserDetails } from '../components/index'
import { useAtom } from 'jotai'
import { otpSentAtom, otpVerifiedAtom, darkModeAtom, isPostOtpCompleteAtom, isPostPassCompleteAtom, sessionAtom } from '../store';
import LogoW from "../../public/assets/Logo-W.svg";
import Logo from "../../public/assets/Logo.svg"
import { IoSunnySharp, IoSunnyOutline } from "react-icons/io5";
import supabase from '../../config/supabse'
import { Button } from '../../components/ui/button'


export default function Home() {
  const [otpVerified, setOtpVerified] = useAtom(otpVerifiedAtom);
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  const [isPostOtpComplete, setPostOtpComplete] = useAtom(isPostOtpCompleteAtom);
  const [isPostPassComplete] = useAtom(isPostPassCompleteAtom);
  const [otpSent, setOtpSent] = useAtom(otpSentAtom);

  const [session, setSession] = useAtom(sessionAtom);


  async function signOut(){
    
    const { error } = await supabase.auth.signOut();
    if(error){
      console.log(error)
    }else{
      setSession(null);
      setOtpSent(false)
      setOtpVerified(false);
      setPostOtpComplete(false)
    }
  }

  useEffect(() => {
    console.log(session)
  }, [])
  

  return (
    <>
    <div className={`flex font-Inter justify-center items-center w-full h-screen box-border ${darkMode ? 'bg-[#EFF5F5] text-black' : 'bg-[#115E59]'} flex-col gap-10 p-16`}>
      <Image src={darkMode ? Logo : LogoW} alt='logo' className='absolute self-start align-top top-5 left-4'/>
      {session && <Button className='absolute float-right top-5 right-16 bg-[#14B8A6] border-[#14B8A6] leading-[24px] hover:bg-[#EFF5F5] hover:text-[#14B8A6]' onClick={signOut}>Logout</Button>}
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
