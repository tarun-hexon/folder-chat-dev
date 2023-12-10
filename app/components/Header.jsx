'use client'
import React, { useEffect } from 'react'
import Image from 'next/image'
import LogoW from "../../public/assets/Logo-W.svg";
import Logo from "../../public/assets/Logo.svg"
import { useAtom } from 'jotai';
import { allowSessionAtom, darkModeAtom, onBoardCompleteAtom, isPostSignUpCompleteAtom, isPostUserCompleteAtom, sessionAtom } from '../store';
import { IoSunnySharp, IoSunnyOutline } from "react-icons/io5";
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import supabase from '../../config/supabse';
import { useRouter } from 'next/navigation';



const Header = ({ children }) => {


    const [darkMode, setDarkMode] = useAtom(darkModeAtom);
    const [userSession, setUserSession] = useAtom(sessionAtom);
    const [isPostOtpComplete, setPostSignupComplete] = useAtom(isPostSignUpCompleteAtom);
    const [isPostUserComplete, setPostUserComplete] = useAtom(isPostUserCompleteAtom);
    const [isPostPassComplete, setPostPassComplete] = useAtom(isPostUserCompleteAtom);
    const [allowSession, setAllowSession] = useAtom(allowSessionAtom);
    const [onBoarding, setOnBoarding] = useAtom(onBoardCompleteAtom);

    const router = useRouter();

    async function signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.log(error)
        } else {
            router.push('/login');
            setOnBoarding(false);
            setUserSession(null);
            setPostSignupComplete(false);
            setPostUserComplete(false);
        }
    };
    
    return (
        <div className={`flex font-Inter justify-start items-center h-screen w-full box-border bg-[#115E59] flex-col gap-1 ${darkMode ? 'bg-[#EFF5F5] text-black' : 'bg-[#115E59] text-white'}`}>
            <div className='w-full flex justify-between items-center px-5 py-1 h-[5rem]'>
                <Link href={'/'}><Image src={darkMode ? Logo : LogoW} alt='logo' className='' /></Link>

                <div className='flex gap-5 justify-center items-center'>
                    <div>
                        {darkMode ? <IoSunnySharp className='hover:cursor-pointer select-none' color='#115E59' size={'2rem'} onClick={() => setDarkMode(false)} /> : <IoSunnyOutline className='hover:cursor-pointer select-none' color='white' size={'2rem'} onClick={() => setDarkMode(true)} />}
                    </div>

                    <div>
                        {userSession && <Button className=' bg-[#14B8A6] border-[#14B8A6] leading-[24px] hover:bg-[#EFF5F5] hover:text-[#14B8A6] block' onClick={signOut}>Log Out</Button>}
                    </div>
                </div>
            </div>
            {children}
        </div>
    )
}

export default Header