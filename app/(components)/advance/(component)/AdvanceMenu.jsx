import React from 'react'
import Image from 'next/image';
import filter from '../../../../public/assets/Danswer-filter-Default.svg';
import { advanceOption } from '../../../../config/constants';
import album from '../../../../public/assets/album.svg';
import key from '../../../../public/assets/key.svg';
import Link from 'next/link';


const AdvanceMenu = () => {

    return (
        <>
            <Link href={'/advance/indexing'} className='flex gap-2 hover:cursor-pointer items-center justify-between p-3 rounded-md'>
                <span className='font-[700] text-sm leading-5'>Indexing</span>
                <Image src={album} alt={'album'} className='w-4 h-4' />
            </Link>
            
            <div className='w-full flex flex-col p-1 border-t border-b'>
            <h1 className='text-start font-[700] text-sm leading-5 p-2'>Connector Settings</h1>
                {advanceOption.map(setting => {
                    return (
                        <Link href={'/advance/'+setting.id} key={setting.id} className={`inline-flex p-2 items-center text-sm leading-5 rounded-md hover:cursor-pointer gap-2 hover:bg-[#FFFFFF33]`}>
                            <Image src={setting.icon} alt={setting.id} />
                            <span className='font-[500]'>{setting.title}</span>
                        </Link>
                    )
                })}
                <h1 className='text-start font-[700] text-sm leading-5 p-2'>Keys</h1>
                <div className={`inline-flex p-2 items-center text-sm leading-5 rounded-md hover:cursor-pointer gap-2 hover:bg-[#FFFFFF33]`} >
                    <Image src={key} alt={'apikey'} />
                    <span className='font-[500]'>{'OpenAI'}</span>
                </div>
            </div>


            <Link href={'/advance'} className='flex gap-2 hover:cursor-pointer items-center justify-between p-3 rounded-md'>
                <span className='font-[700] text-sm leading-5'>Search</span>
                <Image src={filter} alt={'open'} className='w-4 h-4' />
            </Link>

        </>
    )
}

export default AdvanceMenu