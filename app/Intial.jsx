'use client'
import React from 'react'
import Image from 'next/image'
import LogoW from "../public/assets/Logo-W.svg";
import Logo from "../public/assets/Logo.svg"
import { useAtom } from 'jotai';
import { darkModeAtom } from './store';
import { IoSunnySharp, IoSunnyOutline } from "react-icons/io5";
import Link from 'next/link';

const Intial = ({children}) => {

    const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  return (
    <div className={`flex font-Inter justify-center items-center w-full h-screen box-border bg-[#115E59] flex-col gap-10 text-white text-4xl ${darkMode ? 'bg-[#EFF5F5] text-black' : 'bg-[#115E59]'}`}>
        <Link href={'/'}><Image src={darkMode ? Logo : LogoW} alt='logo' className='absolute self-start align-top top-3 left-2'/></Link>
        {darkMode ? <IoSunnySharp className='absolute float-right top-5 right-5' color='#115E59'  size={'2rem'} onClick={()=> setDarkMode(false)}/> : <IoSunnyOutline className='absolute float-right top-5 right-5' color='white' size={'2rem'} onClick={()=> setDarkMode(true)}/>}
        {children}
    </div>
  )
}

export default Intial