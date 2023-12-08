'use client'
import React, { useState } from 'react'
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Button } from "../../components/ui/button"
import user_icon from "../../public/assets/user_icon.png"
import supabase from '../../config/supabse'
import Image from "next/image";
import { darkModeAtom, isPostSignUpCompleteAtom, sessionAtom } from '../store';
import { useAtom } from 'jotai'


const PostSignup = () => {
    const [darkMode] = useAtom(darkModeAtom);
    const [isPostSignUpComplete, setIsPostSignUpComplete] = useAtom(isPostSignUpCompleteAtom);
    
    const [session, setSession] = useAtom(sessionAtom);

    const [name, setName] = useState('');


    return (
        <div className={`flex flex-col w-[22rem] gap-5 items-center box-border ${darkMode ? '' : 'text-white'}`}>

            <div className='w-full text-center'>
                <h1 className='font-[600] text-[20px]'>Welcome to <span className='text-[#14B8A6]'>folder.chat</span></h1>
                <p className='text-xs opacity-90'>First things first, tell us about yourself.</p>
            </div>

            <div className='w-full flex flex-col items-center gap-4 justify-center mt-4'>

                <div className='w-full'>
                    <Label htmlFor='profile-img' className='flex flex-col items-center justify-center'><Image src={false ? imgURL : user_icon} alt="user_img" className='h-20 w-20 block' /><p className='text-[12px] font-[300] opacity-70 mt-2 -ml-1'>Add a photo</p>
                    </Label>
                    <input type='file' id='profile-img' accept="image/png, image/jpeg" style={{ display: 'none' }} 
                    onChange={(e) => uploadImage(e.target.files[0])}
                    />
                </div>

                <div className='w-full text-start'>
                    <Label htmlFor="name" className='text-[14px] font-[500] leading-[20px]'>What should we call you?</Label>
                    <Input type='text' id="name" name='name' placeholder='eg: Ada Lovelase' className='text-black mt-1 border-[#CBD5E1] text-[14px] font-[500] leading-[20px]' onChange={(e) => setName(e.target.value)} />
                </div>                

                <Button variant="outline" className={`w-full mt-2 text-sm text-white font-[400] bg-[#14B8A6] border-[#14B8A6] leading-[24px] flex items-center justify-center ${false ? 'opacity-5' : ''}`} disabled={name == ''} 
                onClick={()=> setIsPostSignUpComplete(true)}
                >Continue</Button>
                
                <div className='w-[33rem] text-xs opacity-60 text-center mt-4 leading-[20px] font-[300]'>You may unsubscribe from receiving marketing communications at any time. Folder.chat&apos;s websites and communications are subjects to our Privacy Policy</div>
            </div>


        </div>
    )
}

export default PostSignup