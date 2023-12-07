'use client'

import React, { useState } from 'react'
import supabase from "../../config/supabse";
import { Button } from '../../components/ui/button'

const Page = () => {

  const [email, setEmail] = useState('')
  const checkUserExists = async () => {
    const { data, error } = await supabase
      .from('client') // replace 'users' with your actual table name
      .select('user_id')
      .eq('email', 'rocky191019@gmail.com')

    if (error) {
      console.error('Error checking user existence:', error.message);
      return false;
    } else {
      console.log(data);
    }


  };

  return (
    <div>
      <h1 className='text-5xl space-x-0 w-full text-center font-[800] leading-[48px] tracking-[1.2%] mb-8'>Sign Up</h1>

      <Button onClick={checkUserExists}>Check If User Exist</Button>
    </div>
  )
}

export default Page