'use client'

import { PostSignup, Signup, UserDetails } from './components/index'
import { useAtom } from 'jotai'
import { darkModeAtom, isPostSignUpCompleteAtom, isPostNameCompleteAtom, sessionAtom } from './store';
import PostName from './components/PostName'

import { useRouter } from 'next/navigation';

export default function Home() {
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  const [isPostSignUpComplete, setIsPostSignUpComplete] = useAtom(isPostSignUpCompleteAtom);
  const [isPostPassComplete] = useAtom(isPostNameCompleteAtom);
  
  const [session, setSession] = useAtom(sessionAtom);  
 
  return (
    <>
    <div className={`flex font-Inter justify-center items-center w-full box-border ${darkMode ? 'bg-[#EFF5F5] text-black' : 'bg-[#115E59]'} flex-col gap-10`}>

      {!session ? <div>
        <Signup />
        
      </div> :
      <div className='text-center'>
        { !isPostSignUpComplete ? <PostSignup/> : ( !isPostPassComplete ? <PostName /> : <UserDetails />)}
        
      </div>}
      
    </div>
    </>
  )
}
