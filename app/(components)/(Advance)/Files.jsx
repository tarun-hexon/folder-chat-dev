'use client'
import React, { useState } from 'react'
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
import { useDropzone } from 'react-dropzone';
import { Label } from '../../../components/ui/label';

const Files = () => {

    const [file, setFiles] = useState([]);
    function uploadFile(file) {
        console.log(file)
    }
    const onDrop = (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setFiles(prev => [...prev, file])
            uploadFile(file);
        } else {
            // console.error('Invalid file. Please upload a PDF, DOC, or XLS file.');
        }
    };


    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
    return (
        <>

            <div className='sm:w-[80%] sm:h-[30rem] w-full rounded-[6px] flex flex-col box-border space-y-2 gap-2'>
                <div className='flex justify-start items-center gap-2'>
                    <Image src={fileIcon} alt='file' className='w-5 h-5' />
                    <h1 className='font-[600] text-[20px] leading-7 tracking-[-0.5%] text-start'>Files</h1>
                </div>
                <hr className='w-full' />

                <div className='w-full self-start'>
                    <div className='text-start flex flex-col gap-4 '>
                        <div className='space-y-1'>
                            <h2 className='font-[600] text-sm leading-5 text-[#0F172A]'>Upload Files</h2>
                            <p className='font-[400] text-sm leading-5'>Specify files below, click the Upload button, and the contents of these files will be searchable via Advance!</p>
                        </div>
                        <div className={`w-full border rounded-lg flex flex-col justify-center items-center p-5 gap-4 ${isDragActive && 'opacity-50'}`} {...getRootProps()}>
                            <div >
                                <Label htmlFor='upload-files' className={`font-[500] text-[16px] leading-6`}>Drag and drop files here, or click ‘Upload’ button and select files</Label>
                                <div

                                    {...getInputProps()}
                                    type='file'
                                    id='upload-files'
                                    accept='.pdf, .doc, .docx, .xls, .xlsx'
                                    style={{ display: 'none' }}
                                />
                            </div>
                            <Button className='w-20'>Upload</Button>
                        </div>
                    </div>
                </div>
                <table className='w-full text-sm'>
                    <thead className='p-2'>
                        <tr className='border-b p-2'>
                            <th className="w-96 text-left p-2">File Name</th>
                            <th className='text-center'>Status</th>
                            <th className="text-center">Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {file.map((item, idx) => {
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
                </table>
            </div>

        </>
    )
}

export default Files