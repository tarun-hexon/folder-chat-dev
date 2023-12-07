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



const page = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  const [hash, setHash] = useState(null)
  const router = useRouter()

  async function resetPass(){
    if(email === '') return alert('type a valid email')
    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(
            email,
            { redirectTo: 'http://localhost:3000/reset' }
          );
          if(error){
            throw error
          };
          console.log(data)
    } catch (error) {
        console.log(error)
    }
};

async function updatePass(){
  if(password === '') return alert('type some password')
  if(password.length < 6) return alert('password length should be atleat 6 digits')
  try {
      const { data, error } = await supabase.auth.updateUser({ password: password })

        if(error){
          throw error
        };
        console.log(data);
        alert('password updated successfully!');
        router.push('/')
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


useEffect(()=> {
  setHash(window.location.hash)
}, []);



  return (
    <div>
      <h1 className={`text-5xl font-Inter space-x-0 w-full text-center font-[600] leading-[48px] tracking-[1.2%] mb-12 ${darkMode ? 'text-black': ''}`}>{hash ? "Update": 'Reset'} Password</h1>

      <div className='w-full flex flex-col gap-6 text-sm font-inter'>
        {hash ?
        <div className='relative text-start'>

          <Label htmlFor="password" className={`text-[14px] font-[500] leading-[20px] ${darkMode ? 'text-black': ''}`}>Set a Password</Label>
          <Input type='password' name='password' id='password' placeholder='New Password' className='mt-1 text-black border-[#CBD5E1] pr-12 font-[500]' onChange={(e) => setPassword(e.target.value)} />

          {password !== '' && <button className="absolute top-2/3 right-2 transform -translate-y-1/2 px-2 py-1 z-20" onClick={()=> showPassword('password')}>
              <Image src={eye_icon} alt='show-password' title='Show Password' />
          </button>}
        </div>
        :
        <div>
        <Label htmlFor="email" className={`text-[14px] font-[500] leading-[20px] ${darkMode ? 'text-black': ''}`}>Work email</Label>
        <Input type='email' id="email" name='email' value={email} placeholder='Enter Your Email' className='text-black bg-white font-[500] leading-[20px] mt-2' onChange={(e) => setEmail(e.target.value)} />
        </div>
        }
        <Button onClick={hash ? updatePass : resetPass} variant={'outline'} className='w-full text-sm font-[400] text-white bg-[#14B8A6] border-[#14B8A6] leading-[24px] flex items-center justify-center'>{hash ? "Update": 'Reset'} Password</Button>
      </div>
      
    </div>
  )
}

export default page