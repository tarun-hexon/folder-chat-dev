'use client'

import Link from "next/link";
import { useEffect } from "react";
import supabase from "../config/supabse";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { isPostOtpCompleteAtom, otpVerifiedAtom, sessionAtom, isPostPassCompleteAtom, isPostUserCompleteAtom, darkModeAtom } from "./store";



export default function Home() {

  const [session1, setSession1] = useAtom(sessionAtom);
  const router = useRouter();
  const [otpVerified, setOtpVerified] = useAtom(otpVerifiedAtom);
  const [isPostOtpComplete, setPostOtpComplete] = useAtom(isPostOtpCompleteAtom);
  const [isPostPassComplete, setPostPassComplete] = useAtom(isPostPassCompleteAtom);
  const [isPostUserComplete, setPostUserComplete] = useAtom(isPostUserCompleteAtom);
  const [darkMode, setDarkMode] = useAtom(darkModeAtom)


  async function getSess() {
    await supabase.auth.getSession().then(({ data: { session } }) => {
      if(session){
        // console.log(session)
        setSession1(session);
        setOtpVerified(true);
        setPostOtpComplete(true);
        setPostPassComplete(true);
        setPostUserComplete(true)
      }
      // router.push('/signup');
      // console.log('home page', session)
    });
  };

  useEffect(()=> {
    getSess();
  }, [])
  
  return (
    <>
    <div className={`flex font-Inter justify-center items-center w-full h-screen box-border flex-col gap-10 ${darkMode ? 'text-black' :''}`}>
      <span className="hover:text-[#14B8A6] duration-200">Welcome To Folder Chat Landing Page...!</span>
      <Link href={'/signup'} className="text-sm hover:text-[#14B8A6] duration-200 hover:cursor-pointer">create an account</Link>
    </div>
    </>
  )
}
