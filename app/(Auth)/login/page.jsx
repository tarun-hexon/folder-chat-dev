'use client'
import React, { useEffect, useState } from 'react'
import { Input } from '../../../components/ui/input'
import { Label } from "../../../components/ui/label"
import { Button } from "../../../components/ui/button"
import Google from "../../../public/assets/google.svg"
import Image from "next/image";
import eye_icon from '../../../public/assets/eye_icon.svg'
import supabase from '../../../config/supabse'
import { useAtom } from 'jotai'
import { darkModeAtom, sessionAtom } from '../../store';
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Login = () => {

  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false)
  const [darkMode] = useAtom(darkModeAtom);
  const [session, setSession] = useAtom(sessionAtom);
  const [errorMsg, setErrorMsg] = useState(false);
  const router = useRouter()

  useEffect(() => {
    if (email !== '' && email.split('@').length > 1 && password != '') {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [email, password]);



  async function signInFunction() {
    try {
      const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setErrorMsg(error.message);
        console.log(error.message)
      }else{
        getSess();
        setErrorMsg(false)
        router.push('/welcome')
      }
      
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  }



  async function googleSignIn() {
    // return null
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              queryParams: {
                access_type: 'offline',
                prompt: 'consent',
              },
              redirectTo : 'http://localhost:3000/welcome'
            }            
        });
        if (error) {
            console.log(error.message);
        }
    } catch (error) {
        console.log(error)
    }
  };

  function getSess() {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }

  useEffect(() => {
    if (session) {
      router.push("/welcome");
    }
  }, [session]);

  return (
    <div className={`flex flex-col w-[22rem] gap-5 items-center box-border ${darkMode ? 'text-black' : 'text-white'}`}>

      <h1 className='text-5xl space-x-0 w-full text-center font-[800] leading-[48px] tracking-[1.2%] mb-8'>Sign In</h1>

      <div className='w-full flex flex-col gap-3 text-sm font-inter'>

        <div>
          <Label htmlFor="email" className='text-sm font-[500] leading-[20px]'>Email Address</Label>
          <Input type='email' id="email" placeholder='Enter Your Email' className='text-black mt-2 bg-white font-[400] leading-[20px]' onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className='relative'>
          <Label htmlFor="login-code" className='text-sm font-[500] leading-[20px]'>Password</Label>
          <Input type={showPassword ? 'text' : 'password'} id="password" value={password} placeholder='Password' className='text-black mt-2 font-[400]' onChange={(e) => setPassword(e.target.value)} />

          {password !== '' && <button className="absolute top-12 right-2 transform -translate-y-1/2 px-2 py-1" onClick={() => setShowPassword(!showPassword)}>
            <Image src={eye_icon} alt='show-password' title='Show Password' />
          </button>}
          
        </div>
        <p className='tracking-tight text-xs text-red-400 -mt-1'>{errorMsg}</p>
      </div>
      

      <Button variant="outline" className={`w-full text-sm font-[400] text-white bg-[#14B8A6] border-[#14B8A6] leading-[24px] flex items-center justify-center ${disabled ? 'opacity-5' : ''}`} disabled={disabled} onClick={signInFunction}>Login</Button>

      <hr className='border border-[#CBD5E1] w-full' />

      <Button variant="outline" className='w-full text-black border border-[#CBD5E1] rounded-[6px] leading-[20px] flex items-center justify-center gap-1' onClick={googleSignIn}><Image src={Google} alt="google" className='w-7 h-7' /><span className='font-[700] text-sm'>Continue With Google</span></Button>

      <div className='w-full text-sm opacity-75 text-center'>Don&apos;t have an account &#63; <Link href={'/'} className='font-[500] hover:underline '>Sign Up</Link></div>
      <Link href={'/reset'} className='w-full text-sm opacity-75 text-center hover:underline'>Forgot your password &#63;</Link>

    </div>
  )
}

export default Login