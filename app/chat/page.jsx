'use client'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { fileNameAtom, sessionAtom } from '../store'
import { usePathname, useRouter } from 'next/navigation'
import supabase from '../../config/supabse'
import uploadIcon from '../../public/assets/upload-cloud.svg'
import { SideBar, Header } from '../components'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { Label } from '../../components/ui/label';
import { useDropzone } from 'react-dropzone';
import ChatWindow from './ChatWindow'





const Chat = () => {
  const [userSession, setUserSession] = useAtom(sessionAtom);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState(false);

  const router = useRouter();
  const [fileName, setFileName] = useAtom(fileNameAtom)

  async function getSess() {
    await supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserSession(session);
        if (session?.user?.user_metadata?.onBoarding) {
          setLoading(false)
        } else {
          router.push('/signup')
        }

      }
      else {
        setLoading(false)
        router.push('/login')
      }
    });
  };


  function uploadFile(file) {
    console.log(file)
  }
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFiles(file)
      uploadFile(file);
    } else {
      // console.error('Invalid file. Please upload a PDF, DOC, or XLS file.');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });


  useEffect(() => {
    getSess();
    
  }, [session]);



  if (loading || !userSession) {
    return (
      <div className='flex w-full justify-center items-center h-screen'>
        <Loader2 className='animate-spin' />
      </div>
    )
  };



  return (
    
    !loading &&

    <div className='w-full flex text-center font-Inter'>
      <div className='w-[25%] min-h-screen'>
        <SideBar />
      </div>
      {fileName === 'upload' ?
        <div className='w-full flex flex-col justify-center items-center rounded-[6px] gap-5'>
        <div>
          <p className='font-[600] text-[20px] tracking-[.25%] text-[#0F172A] opacity-[50%] leading-7'>This folder is empty</p>
          <p className='font-[400] text-sm tracking-[.25%] text-[#0F172A] opacity-[50%] leading-8'>Upload a document to start</p>
        </div> 
          <div
              className={`w-[60%] h-[60%] border flex justify-center items-center bg-[#EFF5F5] ${isDragActive ? 'opacity-50' : ''}`}
              {...getRootProps()}
            >
              <Label htmlFor='upload-files' className='flex flex-col items-center justify-center' > 
                <Image src={uploadIcon} alt='upload' />
                <div>
                  <p className='font-[400] leading-6 text-[16px] opacity-[80%]'>Click to upload or drag and drop</p>
                  <p className='opacity-[50%] text-sm leading-6'>PDF, DOC, XLS</p>
                </div>
              </Label>
              <div
                
                {...getInputProps()}
                type='file'
                id='upload-files'
                accept='.pdf, .doc, .docx, .xls, .xlsx'
                style={{ display: 'none' }}
              />
          </div>
          <p className='text-black bg-slate-100 p-2 rounded-lg'>{files.name}</p>
      </div>
      :
      <div className='sticky top-0 self-start'>
      <ChatWindow />
      </div>
      }
      
    </div>
  )
}

export default Chat