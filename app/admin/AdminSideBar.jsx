import { Key, Users } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Dialog, DialogContent, DialogTrigger } from '../../components/ui/dialog'
import Invite from './Invite'

function AdminSideBar() {

  const options = [{
    id: "users",
    title: "Users",
    href: '/admin/users',
    icon: Users
  },
  {
    id: "openai",
    title: "OpenAi",
    href: '/admin/openai',
    icon: Key
  }
  ]
  return (
    <div className='w-full border min-h-full flex flex-col opacity-70'>
      {options?.map(item => {
        return (
          <Link href={item?.href} key={item?.id} className='flex items-center gap-2 hover:cursor-pointer p-4 hover:bg-gray-100 rounded-sm text-[16px] leading-5 font-[500]'>
            <item.icon size={'20'} />
            {item?.title}
          </Link>
        )
      })}


      <Dialog>
        <DialogTrigger asChild >
          <div className='flex items-center gap-2 hover:cursor-pointer p-4 hover:bg-gray-100 rounded-sm text-[16px] leading-5 font-[500]'>
            <Users size={'20'} />
            Invite User
          </div>
        </DialogTrigger>
        <DialogContent>
          <Invite />
        </DialogContent>
      </Dialog>



    </div>
  )
}

export default AdminSideBar