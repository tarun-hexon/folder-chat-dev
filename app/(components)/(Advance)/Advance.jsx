import React from 'react'
import Image from 'next/image';
import filter from '../../../public/assets/Danswer-filter-Default.svg';
import { advanceOption } from '../../../config/constants';
import album from '../../../public/assets/album.svg';
import { useAtom } from 'jotai';
import { advanceItemAtom, fileNameAtom } from '../../store';


const Advance = () => {


    const [item, setItem] = useAtom(advanceItemAtom);
    const [fileName, setFileName] = useAtom(fileNameAtom)


    function handleOnClick(name){
        setFileName('advance')
        setItem(name);
        
    }

    return (
        <>
            <div className='flex gap-2 hover:cursor-pointer items-center justify-between p-3 rounded-md'>
                <span className='font-[700] text-sm leading-5'>Filters</span>
                <Image src={filter} alt={'open'} className='w-4 h-4' />
            </div>
           
            
            <div className='w-full flex flex-col p-1 border-t border-b'>
                    {advanceOption.map(setting => {
                        return (
                            <div key={setting.id} className={`inline-flex p-2 items-center text-sm leading-5 rounded-md hover:cursor-pointer gap-2 hover:bg-[#FFFFFF33]`} onClick={()=> handleOnClick(setting.id)}>
                                <Image src={setting.icon} alt={setting.id}/>
                                <span className='font-[500]'>{setting.title}</span>
                            </div>
                        )
                    })}
            </div>

            <div className='flex gap-2 hover:cursor-pointer items-center justify-between p-3 rounded-md' onClick={()=> handleOnClick('indexing')}>
                <span className='font-[700] text-sm leading-5'>Indexing</span>
                <Image src={album} alt={'album'} className='w-4 h-4' />
            </div>
            
        </>
    )
}

export default Advance