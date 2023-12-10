import React from 'react'
import { sidebarOptions } from '../../config/constants';
import Image from 'next/image';

const SideBar = () => {
  return (
    <div className='w-64 bg-[#EFF5F5] flex flex-col py-[19px] px-[18px] gap-3'>
        <div>
            Workplace Name
        </div>
        
            {sidebarOptions.map(option => {
                return (
                    <div key={option.title} className='inline-flex gap-2'>
                        <Image src={option.icon} alt={option.title}/>
                        <span>{option.title}</span>
                    </div>
                )
            })}
        
    </div>
  )
}

export default SideBar