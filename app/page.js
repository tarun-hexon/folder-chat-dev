'use client'

import Image from "next/image";
import LogoW from "../public/assets/Logo-W.svg";
import Logo from "../public/assets/Logo.svg"
import { IoSunnyOutline } from "react-icons/io5";
import Link from "next/link";
import { useEffect } from "react";
import supabase from "../config/supabse";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { isPostOtpCompleteAtom, otpVerifiedAtom, sessionAtom } from "./store";



export default function Home() {

  const [session1, setSession1] = useAtom(sessionAtom);
  const router = useRouter();
  const [otpVerified, setOtpVerified] = useAtom(otpVerifiedAtom);
  const [isPostOtpComplete, setPostOtpComplete] = useAtom(isPostOtpCompleteAtom);


  async function getSess() {
    await supabase.auth.getSession().then(({ data: { session } }) => {
      setSession1(session);
      setOtpVerified(true);
      setPostOtpComplete(true)
      router.push('/signup');
      // console.log('home page', session)
    });
  };

  useEffect(()=> {
    getSess();
  }, [])
  
  return (
    <>
    <div className='flex font-Inter justify-center items-center w-full h-screen box-border bg-[#115E59] flex-col gap-10 text-white text-4xl'>
    <Image src={LogoW} alt='logo' className='absolute self-start align-top top-3 left-2'/>
      <span className="hover:text-[#14B8A6] duration-200">Welcome To Folder Chat Landing Page...!</span>
      <Link href={'/signup'} className="text-sm hover:text-[#14B8A6] duration-200 hover:cursor-pointer">create an account</Link>
    </div>
    </>
  )
}
