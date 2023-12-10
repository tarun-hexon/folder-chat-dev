'use client'
import { useEffect, useState } from 'react';
import { PostSignup, Signup, UserDetails } from '../../components/index'
import { useAtom } from 'jotai'
import { darkModeAtom, isPostSignUpCompleteAtom, isPostNameCompleteAtom, sessionAtom, onBoardCompleteAtom } from '../../store';
import { PostName, Header } from '../../components'
import { useRouter } from 'next/navigation';
import {Loader2} from 'lucide-react';

const page = () => {


    const [darkMode, setDarkMode] = useAtom(darkModeAtom);
    const [isPostSignUpComplete, setIsPostSignUpComplete] = useAtom(isPostSignUpCompleteAtom);
    const [isPostPassComplete] = useAtom(isPostNameCompleteAtom);
    const [onBoarding, setOnBoarding] = useAtom(onBoardCompleteAtom);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useAtom(sessionAtom); 
    const router = useRouter() 
  
    useEffect(()=> {
        if(onBoarding){
            setLoading(false)
            router.push('/chat')
        }
        setLoading(false)
        console.log(onBoarding, session)
    }, [onBoarding]);



// if(loading){
//     return(
//         <div>Loading...</div>
//     )
// }
  return (
    <Header>
    <div className={`flex font-Inter justify-center items-center w-full h-screen box-border ${darkMode ? 'bg-[#EFF5F5] text-black' : 'bg-[#115E59]'} flex-col gap-10`}>

      {loading ? <Loader2 className='animate-spin'/>:
      !session && !onBoarding ? <div>
        <Signup />
        
      </div> :
      <div className='text-center'>
        { !isPostSignUpComplete && !loading ? <PostSignup/> : ( !isPostPassComplete ? <PostName /> : <UserDetails />)}
        
      </div>}
    </div>
    </Header>
  )
}

export default page