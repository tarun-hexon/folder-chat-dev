import { Key, Users } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function AdminSideBar() {
  return (
    <div className='w-full border min-h-full flex flex-col opacity-70'>
        <Link href={'/admin/users'} className='flex items-center gap-2 hover:cursor-pointer p-4 hover:bg-gray-100 rounded-sm text-[16px] leading-5 font-[500]'>
            <Users size={'20'}/>
            Users
        </Link>
        <Link href={'/admin/openai'} className='flex items-center gap-2 hover:cursor-pointer p-4 hover:bg-gray-100 rounded-sm text-[16px] leading-5 font-[500]'>
            <Key size={'20'}/>
            OpenAi
        </Link>
    </div>
  )
}

export default AdminSideBar