import React from 'react'
import Image from 'next/image';
import filter from '../../../../public/assets/Danswer-filter-Default.svg';
import { advanceOption } from '../../../../config/constants';
import album from '../../../../public/assets/album.svg';
import { useAtom } from 'jotai';
import { advanceItemAtom, fileNameAtom } from '../../../store';
import key from '../../../../public/assets/key.svg';
import { useRouter } from 'next/navigation';


const Advance = () => {


    const [item, setItem] = useAtom(advanceItemAtom);
    const [fileName, setFileName] = useAtom(fileNameAtom)
    const router = useRouter()

    function handleOnClick(name) {
        setFileName('advance')
        if(name === 'advance'){
            router.push('/advance')
            // window.history.replaceState('', '', `/advance`)

        }else{
            router.push('/advance/'+name)
            // window.history.replaceState('', '', `/advance/${name}`)

        }

    }

    return (
        <>
            <div className='flex gap-2 hover:cursor-pointer items-center justify-between p-3 rounded-md' onClick={() => handleOnClick('indexing')}>
                <span className='font-[700] text-sm leading-5'>Indexing</span>
                <Image src={album} alt={'album'} className='w-4 h-4' />
            </div>
            
            <div className='w-full flex flex-col p-1 border-t border-b'>
            <h1 className='text-start font-[700] text-sm leading-5 p-2'>Connector Settings</h1>
                {advanceOption.map(setting => {
                    return (
                        <div key={setting.id} className={`inline-flex p-2 items-center text-sm leading-5 rounded-md hover:cursor-pointer gap-2 hover:bg-[#FFFFFF33]`} onClick={() => handleOnClick(setting.id)}>
                            <Image src={setting.icon} alt={setting.id} />
                            <span className='font-[500]'>{setting.title}</span>
                        </div>
                    )
                })}
                <h1 className='text-start font-[700] text-sm leading-5 p-2'>Keys</h1>
                <div className={`inline-flex p-2 items-center text-sm leading-5 rounded-md hover:cursor-pointer gap-2 hover:bg-[#FFFFFF33]`} onClick={() => handleOnClick('keys')}>
                    <Image src={key} alt={'apikey'} />
                    <span className='font-[500]'>{'OpenAI'}</span>
                </div>
            </div>


            <div className='flex gap-2 hover:cursor-pointer items-center justify-between p-3 rounded-md'>
                <span className='font-[700] text-sm leading-5'>Search</span>
                <Image src={filter} alt={'open'} className='w-4 h-4' />
            </div>

        </>
    )
}

export default Advance