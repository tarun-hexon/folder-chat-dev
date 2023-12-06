'use cient'

import Image from "next/image";
import LogoW from "../public/assets/Logo-W.svg";
import Logo from "../public/assets/Logo.svg"
import { IoSunnyOutline } from "react-icons/io5";


export default function Home() {
  
  return (
    <>
    <div className='flex font-Inter justify-center items-center w-full h-screen box-border bg-[#115E59] flex-col gap-10 text-white text-4xl'>
    <Image src={LogoW} alt='logo' className='absolute self-start align-top top-3 left-2'/>
      <span className="hover:text-[#14B8A6] duration-200">Welcome To Folder Chat Landing Page...!</span>
    </div>
    </>
  )
}
