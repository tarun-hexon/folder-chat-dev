'use client'

import React, { useEffect, useState } from 'react'
import supabase from '../../../config/supabse';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import eye_icon from '../../../public/assets/eye_icon.svg'
import { useAtom } from 'jotai';
import { darkModeAtom } from '../../store';



const Page = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  const router = useRouter()

  async function resetPass(){
    if(email === '') return alert('type a valid email')
    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(
            email,
            { redirectTo: 'http://localhost:3000/update' }
          );
          if(error){
            throw error
          };
          alert('check your email for verification link')
    } catch (error) {
        console.log(error)
    }
};





  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <h1 className={`text-3xl font-Inter space-x-0 text-center font-[600] leading-[48px] tracking-[1.2%] mb-12 ${darkMode ? 'text-black': ''}`}>Reset Password</h1>

      <div className='w-80 flex flex-col gap-6 text-sm font-inter justify-center'>

        <div>
        <Label htmlFor="email" className={`text-[14px] font-[500] leading-[20px] ${darkMode ? 'text-black': ''}`}>Email Address</Label>
        <Input type='email' id="email" name='email' value={email} placeholder='Enter Your Email' className='text-black bg-white font-[500] leading-[20px] mt-2' onChange={(e) => setEmail(e.target.value)} />
        </div>

        <Button onClick={resetPass} variant={'outline'} className='w-full text-sm font-[400] text-white bg-[#14B8A6] border-[#14B8A6] leading-[24px] flex items-center justify-center'>Reset Password</Button>
      </div>
      
    </div>
  )
}

export default Page