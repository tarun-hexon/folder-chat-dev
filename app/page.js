'use client'

import { useAtom } from 'jotai'
import { darkModeAtom, isPostSignUpCompleteAtom, isPostNameCompleteAtom, sessionAtom, onBoardCompleteAtom } from './store';

import { useRouter } from 'next/navigation';

export default function Home() {
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  const [isPostSignUpComplete, setIsPostSignUpComplete] = useAtom(isPostSignUpCompleteAtom);
  const [isPostPassComplete] = useAtom(isPostNameCompleteAtom);
  const [onBoarding, setOnBoarding] = useAtom(onBoardCompleteAtom);

  const [session, setSession] = useAtom(sessionAtom); 
  const router = useRouter() 
  
  if(session){
    router.push('/chat')
  }else{
    router.push('/signup')
  }


  return (
    null
  )
}
