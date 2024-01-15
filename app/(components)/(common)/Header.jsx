'use client'
import React, { useEffect } from 'react'
import Image from 'next/image'
import LogoW from "../../../public/assets/Logo-W.svg";
import Logo from "../../../public/assets/Logo.svg"
import { useAtom } from 'jotai';
import { allowSessionAtom, darkModeAtom, isPostSignUpCompleteAtom, isPostUserCompleteAtom, sessionAtom } from '../../store';
import { IoSunnySharp, IoSunnyOutline } from "react-icons/io5";
import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import supabase from '../../../config/supabse';
import { useRouter } from 'next/navigation';



const Header = () => {


    const [darkMode, setDarkMode] = useAtom(darkModeAtom);
    const [userSession, setUserSession] = useAtom(sessionAtom);
    const [isPostOtpComplete, setPostSignupComplete] = useAtom(isPostSignUpCompleteAtom);
    const [isPostUserComplete, setPostUserComplete] = useAtom(isPostUserCompleteAtom);
    
    const router = useRouter();

    async function signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.log(error)
        } else {
            router.push('/login');
            setUserSession(null);
            setPostSignupComplete(false);
            setPostUserComplete(false);
        }
    };

    return (
        
            <div className='w-full flex justify-between items-center px-5 py-1'>
                <Link href={'/'}>
                    <Image src={darkMode ? Logo : LogoW} alt='logo' priority={false} className='' />
                </Link>

                <div className='flex gap-5 justify-center items-center'>
                    <div>
                        {darkMode ? <IoSunnySharp className='hover:cursor-pointer select-none' color='#115E59' size={'2rem'} onClick={() => setDarkMode(false)} /> : <IoSunnyOutline className='hover:cursor-pointer select-none' color='white' size={'2rem'} onClick={() => setDarkMode(true)} />}
                    </div>

                    <div>
                        {userSession && <Button className=' bg-[#14B8A6] border-[#14B8A6] leading-[24px] hover:bg-[#EFF5F5] hover:text-[#14B8A6] block' onClick={signOut}>Log Out</Button>}
                    </div>
                </div>
            </div>
           
       
    )
}

export default Header