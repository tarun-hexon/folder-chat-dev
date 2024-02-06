'use client'
import React, { useEffect, useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion";
import threeDot from '../../../public/assets/more-horizontal.svg'
import supabase from '../../../config/supabse';
import Image from 'next/image';
import { useAtom } from 'jotai'
import { sessionAtom, isPostSignUpCompleteAtom, isPostUserCompleteAtom, currentWorkSpaceAtom } from '../../store';
import { useRouter } from 'next/navigation';
import { sidebarOptions } from '../../../config/constants';
import { Dialog, DialogTrigger } from '../../../components/ui/dialog';
import { Setting } from '../(settings)'
import { ArrowDownUp, Check, LogOut } from 'lucide-react';
import { isUserExist } from '../../../config/lib';
import { getCurrentUser } from '../../../lib/user';
import { logout } from '../../../lib/user';
import { Button } from '../../../components/ui/button';
import { Workspace } from '../(common)';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "../../../components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../../components/ui/popover"
import { cn } from '../../../lib/utils';
import Link from 'next/link';


const Account = () => {
    const [userSession, setUserSession] = useAtom(sessionAtom);
    const [isPostOtpComplete, setPostSignupComplete] = useAtom(isPostSignUpCompleteAtom);
    const [isPostUserComplete, setPostUserComplete] = useAtom(isPostUserCompleteAtom);
    const [open, setOpen] = useState(false);
    const [item, setItem] = useState('profile')
    const [workSpace, setWorkSpace] = useState(null);
    const [currentUser, setCurrentUser] = useState({});
    const [value, setValue] = useAtom(currentWorkSpaceAtom)
    const router = useRouter();

    const [workspaces, setWorkSpaces] = useState([])


    async function getWorkspaceName() {
        try {

            let { data: workspaces, error } = await supabase
                .from('workspaces')
                .select('name')
                .eq('created_by', userSession.user.id);
            if (error) {
                throw error
            }
            setWorkSpace(workspaces[0].name)
        } catch (error) {
            console.log(error)
        }
    };

    async function fetchCurrentUser() {
        const user = await getCurrentUser();
        // console.log(user)
        setCurrentUser(user)
    };

    async function getWorkSpace(){
        const res = await fetch('/api/workspace/list-workspace');
        const json = await res.json()
        
        setWorkSpaces(json?.data)
    }

    useEffect(() => {
        // getWorkspaceName();
        getWorkSpace()
        fetchCurrentUser();
    }, [])
    return (
        // <div className='w-full'>
        //     <Popover className='w-full'>
        //         <AccordionItem value="profile" className='p-2 gap-4 flex flex-col w-full'>
        //             <AccordionTrigger className='flex-row-reverse justify-between items-center gap-2'>
        //                 <div className='flex w-full justify-between'>
        //                     {/* <h1 className='font-[600] text-sm leading-5 mr-10'>{workSpace}</h1> */}
        //                     <h1 className='font-[600] text-sm leading-5 mr-10'>{currentUser?.email}</h1>
        //                     <Image src={threeDot} alt={'options'} className='w-4 h-4 ' />
        //                 </div>
        //             </AccordionTrigger>
        //             <AccordionContent className='flex flex-col justify-center gap-4 items-start h-fit bg-[#EFF5F5] rounded-lg p-2'>
        //                 {/* <div className='flex flex-col w-full max-h-52 overflow-y-scroll'>
        //                     {sidebarOptions.map(option => {
        //                         return (
        //                             option.id !== 'settings' ? 
        //                             <div key={option.id} className='inline-flex gap-2 hover:cursor-pointer p-2 hover:bg-[#d9dada] w-full rounded-md' onClick={()=> {setItem(option.id); setOpen(true); }}>
        //                                 <Image src={option.icon} alt={option.title} />
        //                                 <span className='text-sm leading-5 font-[500]'>{option.title}</span>
        //                             </div> :
        //                                 <Dialog open={open} onOpenChange={()=> {setOpen(!open); setItem(option.id)}} key={option.id}>

        //                                     <DialogTrigger asChild className='self-start'>

        //                                         <div key={option.title} className='inline-flex gap-2 hover:cursor-pointer p-2 hover:bg-[#d9dada] w-full rounded-md' >
        //                                             <Image src={option.icon} alt={option.title} />
        //                                             <span className='text-sm leading-5 font-[500]'>{option.title}</span>
        //                                         </div>

        //                                     </DialogTrigger>
        //                                     <Setting item={item} setItem={setItem}/>
        //                                 </Dialog>
        //                         )
        //                     })}
        //                 </div> */}
        //                 {/* <div className='flex items-center w-full gap-2 hover:cursor-pointer ' onClick={async () => {
        //                     const res = await logout();
        //                     if(res.ok){
        //                         router.push('/auth/login')
        //                     }
        //                 }}>
        //                 <LogOut className='w-4 h-4' color='#14B8A6'/><span  className='font-[500] leading-5 text-sm hover:cursor-pointer'>Log Out</span>

        //                 </div> */}
        //                 {/* <Button className='m-auto w-full bg-[#14B8A6] hover:bg-[#14B8A6] opacity-75 hover:opacity-100 shadow-lg'>Add Workspace</Button> */}
        //                 <Workspace />
        //             </AccordionContent>
        //         </AccordionItem>
        //     </Popover>

        // </div>
        <div className='w-full'>
            <Popover open={open} onOpenChange={setOpen} className='w-full'>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value
                        ? workspaces.find((workspace) => workspace.name === value.name)?.name
                        : "Select workspace..."}
                    <ArrowDownUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-2">
                <Command>
                    <CommandInput placeholder="Search workspace..." className="h-9" />
                    <CommandEmpty>No workspace found.</CommandEmpty>
                    <CommandGroup>
                        {workspaces?.map((workspace) => (
                            <Link href={`/workspace/${workspace?.id}/chat/new`} key={workspace.id} className='hover:cursor-pointer'>
                            <CommandItem
                                className='hover:cursor-pointer'
                                value={workspace.name}
                                onSelect={(currentValue) => {
                                    setValue(workspace)
                                    setOpen(false)
                                }}
                            >
                                {workspace.name}
                                <Check
                                    className={cn(
                                        "ml-auto h-4 w-4",
                                        value === workspace.name ? "opacity-100" : "opacity-0"
                                    )}
                                />
                            </CommandItem>
                            </Link>
                        ))}
                    </CommandGroup>
                </Command>
                <Workspace />
            </PopoverContent>
            
            </Popover>
            
        </div>
        
    )
}

export default Account