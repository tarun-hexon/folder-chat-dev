'use client'
import React, { useEffect, useState } from 'react'
import { Input } from '../../components/ui/input'
import { Label } from "../../components/ui/label"
import { Button } from "../../components/ui/button"
import Google from "../../public/assets/google.svg"
import Image from "next/image";
import supabase from '../../config/supabse'
import { useAtom } from 'jotai'
import { otpSentAtom, otpVerifiedAtom, darkModeAtom, sessionAtom } from '../store';

const Signup = () => {

  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useAtom(otpSentAtom);
  const [otpVerified, setOtpVerified] = useAtom(otpVerifiedAtom);
  const [otp, setOtp] = useState(null);
  const [darkMode] = useAtom(darkModeAtom);
  const [session, setSession] = useAtom(sessionAtom)


  useEffect(() => {
    if (email !== '' && email.split('@').length > 1) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [email]);

  const handleSendOtp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: email.split('@')[0],
      });
      if (error) {
        alert(error.message)
      }
      else {
        setOtpSent(true)
        alert('We have sent you an OTP. Please check your email.')
      }
    } catch (error) {
      console.log(error.message)

    }
  };


  const handleSignup = async () => {
    const { data, error } = await supabase.auth.verifyOtp({ email: email, token: otp, type: 'email' });
    if (error) {
      alert(error.message)
    } else {
      setOtpVerified(true)
    }
  };

  function signUpFunction() {
    if (otpSent) {
      handleSignup()
    } else {
      handleSendOtp()
    }
  };

  async function googleSignIn() {
    // return null
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
          // redirect_uri: 'http://localhost:3000/signup'
        },
      },
    });
    if (error) {
      console.log(error.message);
    }else{
      console.log(data)
      
    }
  };

  function getSess() {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)     
    });
  }

  // useEffect(()=> {
  //   console.log(session)
  //   getSess()
  // }, [session])


  return (
    <div className={`flex flex-col w-[22rem] gap-6 items-center box-border ${darkMode ? '' : 'text-white'}`}>

      <h1 className='text-5xl space-x-0 w-full text-center font-[800] leading-[48px] tracking-[1.2%] mb-8'>Sign Up</h1>

      <div className='w-full flex flex-col gap-[8px] text-sm font-inter'>
        <Label htmlFor="email" className='font-[500] leading-[20px]'>Work email</Label>
        <Input type='email' id="email" placeholder='Enter Your Email' className='text-black bg-white font-[400] leading-[20px]' onChange={(e) => setEmail(e.target.value)} />

        {otpSent ? <> <p className='text-sm mt-1 font-[300] leading-[24px]'>We just sent you a temporary sign up code. Please check your inbox and paste it below</p>

          <div className='mt-1 text-sm font-inter'>
            <Label htmlFor="login-code" className='text-sm font-[500] leading-[20px]'>Sign Up Code</Label>
            <Input type='text' id="login-code" placeholder='Paste Login Code' className='text-black mt-1' onChange={(e) => setOtp(e.target.value)} />
          </div>
        </> : null}
      </div>

      <Button variant="outline" className={`w-full text-sm font-[400] text-white bg-[#14B8A6] border-[#14B8A6] leading-[24px] flex items-center justify-center ${disabled ? 'opacity-5' : ''}`} disabled={disabled} onClick={() => { signUpFunction() }}>{otpSent ? 'Create new account' : 'Continue with email'}</Button>

      <hr className='border border-[#CBD5E1] w-full' />
      <Button variant="outline" className='w-full text-black border border-[#CBD5E1] rounded-[6px] leading-[20px] flex items-center justify-center gap-1' onClick={googleSignIn}><Image src={Google} alt="google" className='w-7 h-7' /><span className='font-[700] text-sm'>Continue With Google</span></Button>

      {otpSent && <div className='w-[32rem] text-[12px] leading-[20px] opacity-70 text-center'>By clicking &lsquo;Continue with Apple/Google/Email/SAML&rsquo; above, you acknowledge that you have read and understood&#44; and agree to Notion&apos;s Terms & Conditions and Privacy Policy.</div>}
    </div>
  )
}

export default Signup