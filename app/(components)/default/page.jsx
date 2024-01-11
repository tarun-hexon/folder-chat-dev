'use client'
import React, { useState } from 'react'
import Image from 'next/image';
import { Indexing, Slack, GitPrs, Files, Drive, Confluence, Web } from '../(common)/index' 
import { Input } from '../../../components/ui/input';
import searchIcon from '../../../public/assets/search.svg';
import gDriveIcon from '../../../public/assets/Danswer-google-B.svg'
import webIcon from '../../../public/assets/Danswer-web-B.svg'
import slackIcon from '../../../public/assets/Danswer-slack-B.svg'
import confluenceIcon from '../../../public/assets/Danswer-confluence-B.svg'
import { useAtom } from 'jotai';
import { advanceItemAtom, fileNameAtom } from '../../store';


const AdvancePage = () => {
    const [selected, setSelected] = useState('auto');
    const [search, setSearch] = useState('');
    const [item, setItem] = useAtom(advanceItemAtom);
    const results = [
        {
            id:'drive',
            icon:gDriveIcon
        },
        {
            id:'web',
            icon:webIcon
        },
        {
            id:'slack',
            icon:slackIcon
        },
        {
            id:'confluence',
            icon:confluenceIcon
        }
    ]
  return (
    <>
    <div className='w-full flex flex-col rounded-[6px] gap-5 items-center no-scrollbar box-border text-[#64748B] h-full overflow-scroll px-4 py-10'>
        {/* <div className='w-full flex justify-between '>
            <div className='flex gap-2 justify-center items-center hover:cursor-pointer'>
                <Image src={danswerIcon} alt='edit' className='w-4 h-4'/>
                <p className='text-sm font-[500] leading-5 text-[#334155]'>Danswer</p>
            </div>
        </div> */}
        
        {item === "advance" && <div className='sm:w-[80%] sm:h-[30rem] w-full rounded-[6px] flex flex-col box-border space-y-2 gap-2 '>
            <div className='self-start space-x-2 border p-1 rounded-md text-[14px] font-[500] leading-5'>
                <button className={`${selected === 'auto' && 'bg-[#14B8A6] text-white'} p-3 rounded-lg px-5`} onClick={()=> setSelected('auto')}>Auto</button>
                <button className={`${selected === 'ai' && 'bg-[#14B8A6] text-white'} p-3 rounded-lg`} onClick={()=> setSelected('ai')}>AI Search</button>
                <button className={`${selected === 'key' && 'bg-[#14B8A6] text-white'} p-3 rounded-lg`} onClick={()=> setSelected('key')}>Keyword Search</button>
            </div>
            <div className='w-full relative flex '>
                <Input type='text' placeholder='Search' className='pr-10' onChange={(e) => setSearch(e.target.value)}/>
                <Image src={searchIcon} alt='search' className='absolute right-2 top-2 hover:cursor-pointer'/>
            </div>
            <div className='flex flex-col justify-between p-2 px-3 gap-4 text-sm border rounded-md'>
                <h2 className='font-[600]  leading-5 self-start'>AI Answer</h2>
                <div className='font-[400] leading-6 text-justify'>
                        The updated onboarding flow features a smoother login process using SSO with Google Accounts, allowing users with existing Google Account to avoid creating new Folder Chat, and giving existing users the option to link their Folder Chat to a Google Account.
                </div>

                <div className='flex flex-col font-[500] text-[12px] leading-5 '>
                    <h2 className='self-start'>Sources</h2>
                    <div className='flex gap-2'>
                        <div className='p-2 border rounded-md inline-flex gap-2 hover:cursor-pointer'>
                            <Image src={gDriveIcon} alt='drive'/>
                            <span>User Onboarding Doc 2023</span>
                        </div>
                        <div className='p-2 border rounded-md inline-flex gap-2 hover:cursor-pointer'>
                            <Image src={webIcon} alt='drive'/>
                            <span>Onboarding - Advance Document</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-5 pb-5'>
            <h2 className='font-[600] text-sm leading-5 self-start'>Results</h2>

                {results.map(res => {
                    return (
                        <div className='w-full relative flex flex-col gap-2 hover:cursor-pointer' key={res.id}>
                        <div className='inline-flex gap-2 '>
                            <Image src={res.icon} alt='icon'/>
                            <span className='font-[600] text-[12px] leading-5'>Onboarding - Advance Document</span>
                        </div>
                        <div className='font-[400] text-sm leading-6 text-justify'>
                        The updated onboarding flow features a smoother login process using SSO with Google Accounts, allowing users with existing Google Account to avoid creating new Folder Chat, and giving existing users the option to link their Folder Chat to a Google Account.
                        </div>
                </div>
                    )
                })}

            </div>
        </div>}
        { item === 'indexing' && <Indexing />}
        { item === 'slack' && <Slack />}
        { item === 'git' && <GitPrs />}
        { item === 'files' && <Files />}
        { item === 'drive' && <Drive />}
        { item === 'confluence' && <Confluence />}
        { item === 'web' && <Web />}
    </div>
    
    </>
  )
}

export default AdvancePage