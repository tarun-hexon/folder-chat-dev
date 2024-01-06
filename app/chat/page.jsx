'use client'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const Page = () => {
    const router = useRouter()
    
    useEffect(()=> {
        router.push('/chat/new')
    }, [])
  return (
    <div className='flex w-full justify-center items-center h-screen'>
        <Loader2 className='animate-spin' />
      </div>
  )
}

export default Page