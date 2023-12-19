import React from 'react'
import danswerIcon from '../../../public/assets/Group 2.svg';
import Image from 'next/image';
import slackIcon from '../../../public/assets/Danswer-slack-B.svg'
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import gDriveIcon from '../../../public/assets/Danswer-google-B.svg'
import webIcon from '../../../public/assets/Danswer-web-B.svg'
import confluenceIcon from '../../../public/assets/Danswer-confluence-B.svg'
import gitIcon from '../../../public/assets/Danswer-github-B.svg';
import fileIcon from '../../../public/assets/Danswer-doc-B.svg';
import check from '../../../public/assets/check-circle.svg';
import trash from '../../../public/assets/trash-2.svg';

const GitPrs = () => {
  return (
    <div className='w-full flex flex-col rounded-[6px] gap-5 items-center justify-center overflow-scroll no-scrollbar font-Inter box-border text-[#64748B] h-full'>
            <div className='w-full flex justify-between px-4 py-2'>
                <div className='flex gap-2 justify-center items-center hover:cursor-pointer'>
                    <Image src={danswerIcon} alt='edit' className='w-4 h-4' />
                    <p className='text-sm font-[500] leading-5 text-[#334155]'>Danswer</p>
                </div>
                
            </div>
            
            <div className='sm:w-[80%] sm:h-[30rem] w-full rounded-[6px] flex flex-col box-border space-y-2 gap-2'>
                <div className='flex justify-start items-center gap-2'>
                    <Image src={gitIcon} alt='github' className='w-5 h-5' />
                    <h1 className='font-[600] text-[20px] leading-7 tracking-[-0.5%] text-start'>Github PRs</h1>
                </div>
                <hr className='w-full'/>
                <div className='self-start text-sm leading-5 flex flex-col gap-2'>
                    <h2 className='font-[600]  text-start'>Step 1: Provide your access token</h2>
                    <span className='font-[400] inline-flex items-center'>Existing Access Token: {'****...***74pD '} <Image src={trash} alt='remove' className='w-4 h-4 inline hover:cursor-pointer'/></span>
                </div>
                <div className='self-start text-sm leading-5 flex flex-col gap-2'>
                    <h2 className='font-[600]  text-start'>Step 2: Which repositories do you want to make searchable?</h2>
                    <span className='font-[400]'>We pull the latest Pull Requests from each Repository listed below every <span className='font-[600]'>10</span> minutes</span>
                </div>
                <div className='w-full self-start p-5 border rounded-lg'>
                    <div className='text-start flex flex-col gap-4'>
                        <h2 className='font-[500] text-[16px] leading-6 text-[#0F172A]'>Connect to a New Repository</h2>
                        <Input placeholder='Repository Owner' type='text'/>
                        <Input placeholder='Repository Name' type='text'/>
                        <Button className='w-20'>Connect</Button>
                    </div>
                </div>
                <table className='w-full text-sm'>
                    <thead className='p-2'>
                        <tr className='border-b p-2'>
                            <th className="w-96 text-left p-2">Repository</th>
                            <th className='text-center'>Status</th>
                            <th className='text-center'>Credential</th>
                            <th className="text-center">Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {new Array(1).fill(null).map((item, idx) => {
                            return (
                                <tr className='border-b' key={idx}>
                                    <td className="font-medium w-96 text-left p-2 py-3 ">Danswer-ai/workplace</td>
                                    <td className=''>
                                        <div className='flex justify-center items-center gap-1 text-[#22C55E]'>
                                        <Image src={check} alt='checked' className='w-4 h-4'/>Enabled
                                        </div>
                                    </td>
                                    <td className=''>****...***74pD</td>
                                    <td><Image src={trash} alt='remove' className='m-auto hover:cursor-pointer'/></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

    </div>
  )
}

export default GitPrs