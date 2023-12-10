'use client'
import React, {useEffect} from 'react'
import Image from 'next/image'
import LogoW from "../public/assets/Logo-W.svg";
import Logo from "../public/assets/Logo.svg"
import { useAtom } from 'jotai';
import { darkModeAtom, isPostSignUpCompleteAtom, isPostUserCompleteAtom, sessionAtom, onBoardCompleteAtom } from './store';
import { IoSunnySharp, IoSunnyOutline } from "react-icons/io5";
import Link from 'next/link';
import { Button } from '../components/ui/button';
import supabase from '../config/supabse';
import { useRouter } from 'next/navigation';


const Intial = () => {

  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  const [userSession, setUserSession] = useAtom(sessionAtom);
  const [isPostOtpComplete, setPostSignupComplete] = useAtom(isPostSignUpCompleteAtom);
  const [isPostUserComplete ,setPostUserComplete] = useAtom(isPostUserCompleteAtom);
  const [isPostPassComplete ,setPostPassComplete] = useAtom(isPostUserCompleteAtom);
  const [onBoarding, setOnBoarding] = useAtom(onBoardCompleteAtom);
 
  
async function getSess() {
  await supabase.auth.getSession().then(({ data: { session } }) => {
    if(session){
      setUserSession(session);
    }
    
  });
};

useEffect(()=> {
  getSess();
}, [])



return (
  null
)
}

export default Intial