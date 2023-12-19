'use client'

import React, { useState } from 'react'
import supabase from '../../../config/supabse';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import eye_icon from '../../../public/assets/eye_icon.svg'
import { useAtom } from 'jotai';
import { darkModeAtom, sessionAtom } from '../../store';
import { Header } from '../../(components)';


const UpdatePassword = () => {


    const [password, setPassword] = useState('');
    const [c_password, setCPassword] = useState('');
    const [darkMode, setDarkMode] = useAtom(darkModeAtom);
    const [session, setSession] = useAtom(sessionAtom);
    const router = useRouter();
    const [inputError, setInputError] = useState(false);
    
    async function updatePass() {

        if (password.length < 6){
            setInputError('password length should be atleat 6 digits');
            return null
        };

        if(password !== c_password) {
            setInputError('Password and confirm password does not match');
            return null
        };

        try {
            const { data, error } = await supabase.auth.updateUser({ password: password })

            if (error) {
                setInputError(error.message);
                throw error
            };
            supabase.auth.signOut();
            setSession(null)
            router.push('/login')
        } catch (error) {
            console.log(error)
        }
    };

    function showPassword(id) {
        var input = document.getElementById(id);
        if (input) {
            if (input.type === "text") {
                input.type = "password";
            } else {
                input.type = "text";
            }
        }
    };
  return (
    <Header>
    <div className='w-full flex flex-col justify-center items-center'>

    <h1 className={`text-3xl font-Inter space-x-0 text-center font-[600] leading-[48px] tracking-[1.2%] mb-12 ${darkMode ? 'text-black': ''}`}>Update Password</h1>

    <div className='w-80 flex flex-col gap-6 text-sm font-inter justify-center'>
        <div className='relative text-start'>

            <Label htmlFor="password" className={`text-[14px] font-[500] leading-[20px] ${darkMode ? 'text-black' : ''}`}>Set a Password</Label>
            <Input type='password' value={password} name='password' id='password' placeholder='New Password' className='mt-2 text-black border-[#CBD5E1] pr-12 font-[500]' onChange={(e) => setPassword(e.target.value)} />

            {password !== '' && <button className="absolute top-12 right-2 transform -translate-y-1/2 px-2 py-1 z-20" onClick={() => showPassword('password')}>
                <Image src={eye_icon} alt='show-password' title='Show Password' />
            </button>}
            
        </div>

        <div className='relative text-start'>

            <Label htmlFor="password" className={`text-[14px] font-[500] leading-[20px] ${darkMode ? 'text-black' : ''}`}>Confirm Password</Label>
            <Input type='password' value={c_password} name='c_password' id='c_password' placeholder='Confirm New Password' className='mt-2 text-black border-[#CBD5E1] pr-12 font-[500]' onChange={(e) => setCPassword(e.target.value)} />

            {c_password !== '' && <button className="absolute top-2/3 right-2 transform -translate-y-1/2 px-2 py-1 z-20" onClick={() => showPassword('c_password')}>
                <Image src={eye_icon} alt='show-password' title='Show Password' />
            </button>}
        </div>
        <p className='tracking-tight text-xs text-red-400 -mt-4'>{inputError}</p>

        <Button onClick={updatePass} variant={'outline'} className='w-full text-sm font-[400] text-white bg-[#14B8A6] border-[#14B8A6] leading-[24px] flex items-center justify-center'>Update Password</Button>
    </div>
    </div>
    </Header>
  )
}

export default UpdatePassword