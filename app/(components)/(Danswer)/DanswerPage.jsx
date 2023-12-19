import React, { useState } from 'react'
import danswerIcon from '../../../public/assets/Group 2.svg';
import Image from 'next/image';
import { Indexing, Slack, GitPrs, Files } from '../index' 
import { Input } from '../../../components/ui/input';
import searchIcon from '../../../public/assets/search.svg';
import gDriveIcon from '../../../public/assets/Danswer-google-B.svg'
import webIcon from '../../../public/assets/Danswer-web-B.svg'
import slackIcon from '../../../public/assets/Danswer-slack-B.svg'
import confluenceIcon from '../../../public/assets/Danswer-confluence-B.svg'
import { useAtom } from 'jotai';
import { danswerItemAtom, fileNameAtom } from '../../store';


const DanswerPage = () => {
    const [selected, setSelected] = useState('auto');
    const [search, setSearch] = useState('');
    const [item, setItem] = useAtom(danswerItemAtom);

  return (
    <>
    {item === "danswer" && <div className='w-full flex flex-col rounded-[6px] gap-5 items-center no-scrollbar box-border text-[#64748B] h-full overflow-scroll'>
        <div className='w-full flex justify-between px-4 py-2'>
            <div className='flex gap-2 justify-center items-center hover:cursor-pointer'>
                <Image src={danswerIcon} alt='edit' className='w-4 h-4'/>
                <p className='text-sm font-[500] leading-5 text-[#334155]'>Danswer</p>
            </div>
        </div>
        <div className='sm:w-[70%] sm:h-[30rem] w-full rounded-[6px] flex flex-col box-border space-y-2 gap-2 '>
            <div className='self-start space-x-2 border p-1 rounded-md text-[14px] font-[500] leading-5'>
                <button className={`${selected === 'auto' && 'bg-[#0EA5E9] text-white'} p-3 rounded-lg px-5`} onClick={()=> setSelected('auto')}>Auto</button>
                <button className={`${selected === 'ai' && 'bg-[#0EA5E9] text-white'} p-3 rounded-lg`} onClick={()=> setSelected('ai')}>AI Search</button>
                <button className={`${selected === 'key' && 'bg-[#0EA5E9] text-white'} p-3 rounded-lg`} onClick={()=> setSelected('key')}>Keyword Search</button>
            </div>
            <div className='w-full relative flex '>
                <Input type='text' placeholder='Search' className='pr-10' onChange={(e) => setSearch(e.target.value)}/>
                <Image src={searchIcon} alt='search' className='absolute right-2 top-2 hover:cursor-pointer'/>
            </div>
            <div className='flex flex-col justify-between p-1 gap-4 text-sm border rounded-md'>
            <h2 className='font-[600]  leading-5 self-start'>AI Answer</h2>
            <div className='font-[400] leading-6 text-justify'>
                    The updated onboarding flow features a smoother login process using SSO with Google Accounts, allowing users with existing Google Account to avoid creating new Dawnswer account, and giving existing users the option to link their Danswer account to a Google Account.
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
                        <span>Onboarding - Danswer Document</span>
                    </div>
                </div>
            </div>
            </div>
            <div className='flex flex-col gap-5 '>
            <h2 className='font-[600] text-sm leading-5 self-start'>Results</h2>
            <div className='w-full relative flex flex-col gap-2 hover:cursor-pointer'>
                    <div className='inline-flex gap-2 '>
                        <Image src={webIcon} alt='icon'/>
                        <span className='font-[600] text-[12px] leading-5'>Onboarding - Danswer Document</span>
                    </div>
                    <div className='font-[400] text-sm leading-6 text-justify'>
                    The updated onboarding flow features a smoother login process using SSO with Google Accounts, allowing users with existing Google Account to avoid creating new Dawnswer account, and giving existing users the option to link their Danswer account to a Google Account.
                    </div>
            </div>
            <div className='w-full relative flex flex-col gap-2 hover:cursor-pointer'>
                    <div className='inline-flex gap-2 '>
                        <Image src={gDriveIcon} alt='icon'/>
                        <span className='font-[600] text-[12px] leading-5'>Onboarding - Danswer Document</span>
                    </div>
                    <div className='font-[400] text-sm leading-6 text-justify'>
                    The updated onboarding flow features a smoother login process using SSO with Google Accounts, allowing users with existing Google Account to avoid creating new Dawnswer account, and giving existing users the option to link their Danswer account to a Google Account.
                    </div>
            </div>
            <div className='w-full relative flex flex-col gap-2 hover:cursor-pointer'>
                    <div className='inline-flex gap-2 '>
                        <Image src={slackIcon} alt='icon'/>
                        <span className='font-[600] text-[12px] leading-5'>Onboarding - Danswer Document</span>
                    </div>
                    <div className='font-[400] text-sm leading-6 text-justify'>
                    The updated onboarding flow features a smoother login process using SSO with Google Accounts, allowing users with existing Google Account to avoid creating new Dawnswer account, and giving existing users the option to link their Danswer account to a Google Account.
                    </div>
            </div>
            <div className='w-full relative flex flex-col gap-2 hover:cursor-pointer'>
                    <div className='inline-flex gap-2 '>
                        <Image src={confluenceIcon} alt='icon'/>
                        <span className='font-[600] text-[12px] leading-5'>Onboarding - Danswer Document</span>
                    </div>
                    <div className='font-[400] text-sm leading-6 text-justify'>
                    The updated onboarding flow features a smoother login process using SSO with Google Accounts, allowing users with existing Google Account to avoid creating new Dawnswer account, and giving existing users the option to link their Danswer account to a Google Account.
                    </div>
            </div>
            </div>
        </div>
    </div>}
    { item === 'indexing' && <Indexing />}
    { item === 'slack' && <Slack />}
    { item === 'git' && <GitPrs />}
    { item === 'files' && <Files />}
    </>
  )
}

export default DanswerPage