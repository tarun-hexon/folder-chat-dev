'use client'
import { useEffect, useState } from 'react';
import { PostSignup, Signup, UserDetails } from '../../components/index'
import { useAtom } from 'jotai'
import { darkModeAtom, isPostSignUpCompleteAtom, isPostNameCompleteAtom, sessionAtom } from '../../store';
import { PostName, Header } from '../../components'
import { useRouter } from 'next/navigation';
import {Loader2} from 'lucide-react';

const Page = () => {


    const [darkMode, setDarkMode] = useAtom(darkModeAtom);
    const [isPostSignUpComplete, setIsPostSignUpComplete] = useAtom(isPostSignUpCompleteAtom);
    const [isPostPassComplete] = useAtom(isPostNameCompleteAtom);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useAtom(sessionAtom); 
    const router = useRouter() 

    useEffect(()=> {
        
        if(session?.user?.user_metadata?.onBoarding){
          setLoading(false)
          router.push('/chat')
        }else{
          setLoading(false)
        }
        console.log(session)
    }, [session]);


  return (
    <Header>
    <div className={`flex font-Inter justify-center items-center w-full h-screen box-border ${darkMode ? 'bg-[#EFF5F5] text-black' : 'bg-[#115E59]'} flex-col gap-10`}>

      {loading ? <Loader2 className='animate-spin'/>:
      !session && !session?.user?.user_metadata?.onBoarding ? <div>
        <Signup />
        
      </div> :
      <div className='text-center'>
        { !isPostSignUpComplete && !loading ? <PostSignup/> : ( !isPostPassComplete ? <PostName /> : <UserDetails />)}
        
      </div>}
    </div>
    </Header>
  )
}

export default Page