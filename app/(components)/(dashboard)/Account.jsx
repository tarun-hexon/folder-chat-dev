'use client'
import React, { useEffect, useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion";
import threeDot from '../../../public/assets/more-horizontal.svg'
import supabase from '../../../config/supabse';
import Image from 'next/image';
import { useAtom } from 'jotai'
import { sessionAtom, isPostSignUpCompleteAtom, isPostUserCompleteAtom, supabaseUserDataAtom } from '../../store';
import { useRouter } from 'next/navigation';
import { sidebarOptions } from '../../../config/constants';
import { Dialog, DialogTrigger } from '../../../components/ui/dialog';
import { Setting } from '../(settings)'
import { LogOut } from 'lucide-react';
import { isUserExist } from '../../../config/lib';

const Account = () => {
    const [userSession, setUserSession] = useAtom(sessionAtom);
    const [isPostOtpComplete, setPostSignupComplete] = useAtom(isPostSignUpCompleteAtom);
    const [isPostUserComplete, setPostUserComplete] = useAtom(isPostUserCompleteAtom);
    const [open, setOpen] = useState(false);
    const [item, setItem] = useState('profile')
    const [workSpace, setWorkSpace] = useState(null);
    
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
    async function getInfo(){
        try {
            
            let { data: workspaces, error } = await supabase
            .from('workspaces')
            .select('name')
            .eq('created_by', userSession.user.id);
            if(error){
                throw error
            }
            setWorkSpace(workspaces[0].name)
        } catch (error) {
            console.log(error)
        }
    };
    useEffect(()=> {
        getInfo()
    }, [])
    return (
        <div className='w-full'>
            <Accordion type="single" defaultValue='profile' collapsible className='w-full'>
                <AccordionItem value="profile" className='p-2 gap-4 flex flex-col w-full'>
                    <AccordionTrigger className='flex-row-reverse justify-between items-center gap-2'>
                        <div className='flex w-full justify-between'>
                        
                            <h1 className='font-[600] text-sm leading-5 mr-10'>{workSpace}</h1>
                            <Image src={threeDot} alt={'options'} className='w-4 h-4 ' />
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className='flex flex-col justify-center gap-4 items-start h-fit bg-[#EFF5F5] rounded-lg p-2'>
                        <div className='flex flex-col gap-4 w-full'>
                            {sidebarOptions.map(option => {
                                return (
                                    option.id !== 'settings' ? 
                                    <div key={option.id} className='inline-flex gap-2 hover:cursor-pointer w-full' onClick={()=> {setItem(option.id); setOpen(true); }}>
                                        <Image src={option.icon} alt={option.title} />
                                        <span className='text-sm leading-5 font-[500]'>{option.title}</span>
                                    </div> :
                                        <Dialog open={open} onOpenChange={()=> {setOpen(!open); setItem(option.id)}} key={option.id}>

                                            <DialogTrigger asChild className='self-start'>

                                                <div key={option.title} className='inline-flex gap-2 hover:cursor-pointer w-full' >
                                                    <Image src={option.icon} alt={option.title} />
                                                    <span className='text-sm leading-5 font-[500]'>{option.title}</span>
                                                </div>

                                            </DialogTrigger>
                                            <Setting item={item} setItem={setItem}/>
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