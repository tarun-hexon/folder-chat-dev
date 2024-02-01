'use client'

import { useAtom } from "jotai";
import { Header } from "../(components)/(common)"
import { darkModeAtom } from "../store";


export default function RootLayout({ children }) {
    const [darkMode, setDarkMode] = useAtom(darkModeAtom);

  return (
    <div className={`flex font-Inter items-center h-screen w-full box-border flex-col gap-1 ${darkMode ? 'bg-[#EFF5F5] text-black' : 'bg-[#115E59] text-white'}`}>
        <Header showActions={true}/>
        { children }
    </div>
  )
}
