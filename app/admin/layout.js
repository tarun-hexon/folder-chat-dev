'use client'

import { useAtom } from "jotai";
import { Header } from "../(components)/(common)"
import { darkModeAtom } from "../store";
import AdminSideBar from './AdminSideBar'

export default function RootLayout({ children }) {
    const [darkMode, setDarkMode] = useAtom(darkModeAtom);

  return (
    <div className={`font-Inter h-screen w-full box-border sticky self-start top-0 flex flex-col`}>
        <Header showActions={false}/>
        <div className="flex h-full">
            <div className="w-[20%]">
            <AdminSideBar />
            </div>
            <div className="w-[80%]">
            {children}
            </div>
        </div>
    </div>
  )
}
