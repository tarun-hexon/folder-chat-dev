'use client'
import React, { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion";
import threeDot from '../../../public/assets/more-horizontal.svg'
import supabase from '../../../config/supabse';
import Image from 'next/image';
import { useAtom } from 'jotai'
import { sessionAtom, isPostSignUpCompleteAtom, isPostUserCompleteAtom } from '../../store';
import { useRouter } from 'next/navigation';
import { sidebarOptions } from '../../../config/constants';
import { Dialog, DialogTrigger } from '../../../components/ui/dialog';
import { Setting } from '../(settings)/index'
import { LogOut } from 'lucide-react';

const Account = () => {
    const [userSession, setUserSession] = useAtom(sessionAtom);
    const [isPostOtpComplete, setPostSignupComplete] = useAtom(isPostSignUpCompleteAtom);
    const [isPostUserComplete, setPostUserComplete] = useAtom(isPostUserCompleteAtom);
    const [open, setOpen] = useState(false)
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
        <div className='w-full'>
            <Accordion type="single" collapsible className='w-full'>
                <AccordionItem value="item-1" className='p-2 gap-4 flex flex-col shadow-n'>
                    <AccordionTrigger className='flex-row-reverse justify-between items-center gap-2'>
                        <Image src={threeDot} alt={'options'} className='w-4 h-4 ' />
                        <h1 className='font-[600] text-sm leading-5 mr-10'>{userSession?.user?.email}</h1>
                    </AccordionTrigger>
                    <AccordionContent className='flex flex-col justify-center gap-4 items-start h-fit bg-[#EFF5F5] rounded-lg p-2'>
                        <div className='flex flex-col gap-4 w-full'>
                            {sidebarOptions.map(option => {
                                return (
                                    option.title !== 'Settings' ? 
                                    <div key={option.title} className='inline-flex gap-2 hover:cursor-pointer w-full'>
                                        <Image src={option.icon} alt={option.title} />
                                        <span className='text-sm leading-5 font-[500]'>{option.title}</span>
                                    </div> :
                                        <Dialog open={open} onOpenChange={setOpen} key={option.title}>

                                            <DialogTrigger asChild className='self-start'>

                                                <div key={option.title} className='inline-flex gap-2 hover:cursor-pointer w-full'>
                                                    <Image src={option.icon} alt={option.title} />
                                                    <span className='text-sm leading-5 font-[500]'>{option.title}</span>
                                                </div>

                                            </DialogTrigger>
                                            <Setting />
                                        </Dialog>
                                )
                            })}
                        </div>
                        <div className='flex items-center w-full gap-2 hover:cursor-pointer ' onClick={signOut}>
                        <LogOut className='w-4 h-4' color='#14B8A6'/><span  className='font-[500] leading-5 text-sm hover:cursor-pointer'>Log Out</span>
                        {/* <Image src={threeDot} alt={'options'} className='w-4 h-4 hover:cursor-pointer' /> */}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

        </div>
    )
}

export default Account