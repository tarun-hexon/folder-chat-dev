'use client'
import React, { useState } from 'react'
import Image from 'next/image';
import slackIcon from '../../../../public/assets/Danswer-slack-B.svg'
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import gDriveIcon from '../../../../public/assets/Danswer-google-B.svg'
import webIcon from '../../../../public/assets/Danswer-web-B.svg'
import confluenceIcon from '../../../../public/assets/Danswer-confluence-B.svg'
import gitIcon from '../../../../public/assets/Danswer-github-B.svg';
import fileIcon from '../../../../public/assets/Danswer-doc-B.svg';
import check from '../../../../public/assets/check-circle.svg';
import trash from '../../../../public/assets/trash-2.svg';
import { useDropzone } from 'react-dropzone';
import { Label } from '../../../../components/ui/label';
import { Trash2 } from 'lucide-react';
import { allConnecorsAtom } from '../../../store';
import { useAtom } from 'jotai';

const Drive = () => {
    const [files, setFiles] = useState(null)
    const [filesList, setFilesList] = useState([]);
    const [credentialJsonStr, setCredentialJsonStr] = useState(null);
    const [fileName, setFileName] = useState('')
    const [allConnectors, setAllConnectors] = useAtom(allConnecorsAtom);
    function uploadFile(file) {
        setFilesList(prev => [...prev, file[0]]);
        console.log(file[0].name)
        
        setFiles(null)
    }


    return (
        <div className='w-full flex sticky top-0 self-start h-screen flex-col rounded-[6px] gap-5 items-center  box-border text-[#64748B] '>
            
            <div className='w-[80%] rounded-[6px] flex flex-col box-border space-y-2 gap-2 overflow-scroll no-scrollbar h-full px-4 py-10'>
                <div className='flex justify-start items-center gap-2'>
                    <Image src={gDriveIcon} alt='file' className='w-5 h-5' />
                    <h1 className='font-[600] text-[20px] leading-7 tracking-[-0.5%] text-start'>Google Drive</h1>
                </div>
                <hr className='w-full' />

                <div className='w-full self-start space-y-6'>
                    {credentialJsonStr === null ? 
                    <div className='text-start flex flex-col gap-4 '>
                        <div className='space-y-1'>
                            <h2 className='font-[600] text-sm leading-5 text-[#0F172A]'>Step 1: Provide your app Credentials</h2>
                            <p className='font-[400] text-sm leading-5'>Follow the guide here to setup your google app in your company workplace. Download the credentials.json, and upload it here.</p>
                        </div>
                        <div className={`w-full border rounded-lg flex flex-col justify-start items-start p-5 gap-4 bg-slate-100 shadow-md`}>
                            <Input 
                            type='file' 
                            accept=".json"
                            onChange={(event) => {
                                if (!event.target.files) {
                                    return;
                                }
                                const file = event.target.files[0];
                                const reader = new FileReader();

                                reader.onload = function (loadEvent) {
                                    if (!loadEvent?.target?.result) {
                                        return;
                                    }
                                    const fileContents = loadEvent.target.result;
                                    
                                    setCredentialJsonStr(fileContents);
                                };
                                setFileName(file.name.split('_')[2])
                                reader.readAsText(file);
                            }} />
                            <Button onClick={() => { uploadFile(files) }}>Update</Button>
                        </div>
                    </div> :
                    <div className='text-start flex flex-col gap-4 '>
                        <span className='text-sm leading-5 font-[500]'>Existing CLient ID : <span className='font-[400]'>{fileName}</span> <Trash2 className='inline hover:cursor-pointer' size={'1rem'} /></span>
                        
                    </div>
                    }

                    <div className='text-start flex flex-col gap-4 '>
                        <div className='space-y-1'>
                            <h2 className='font-[600] text-sm leading-5 text-[#0F172A]'>Step 2: Authenticate with Advance</h2>
                            <p className='font-[400] text-sm leading-5'>Next, you must provide credentials with OAuth. This gives us read access to the docs you have access to in your google drive account.</p>
                        </div>
                        {credentialJsonStr !== null && <Button className='w-fit'>Authenticate with Google Drive</Button>}
                    </div>

                    <div className='text-start flex flex-col gap-4 '>
                        <div className='space-y-1'>
                            <h2 className='font-[600] text-sm leading-5 text-[#0F172A]'>Step 3: Start indexing!</h2>
                            <p className='font-[400] text-sm leading-5'>Click the button below to create a connector. We will refresh the latest documents from Google Drive every 10 minutes.</p>
                        </div>
                        <Button className='w-fit'>Add</Button>
                    </div>
                </div>
                {filesList.length > 0 && <table className='w-full text-sm'>
                    <thead className='p-2'>
                        <tr className='border-b p-2'>
                            <th className="w-96 text-left p-2">Connected documents</th>
                            <th className='text-center'>Status</th>
                            <th className="text-center">Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filesList.map((item, idx) => {
                            return (
                                <tr className='border-b' key={idx}>
                                    <td className="font-medium w-96 text-left p-2 py-3 ">{item.name}</td>
                                    <td>
                                        <div className='flex justify-center items-center gap-1 text-[#22C55E]'>
                                            <Image src={check} alt='checked' className='w-4 h-4' />Enabled
                                        </div>
                                    </td>
                                    <td><Image src={trash} alt='remove' className='m-auto hover:cursor-pointer' /></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>}
            </div>
            

        </div>
    )
}

export default Drive