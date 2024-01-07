'use client'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { fileNameAtom, folderAtom, folderIdAtom, openMenuAtom, sessionAtom } from '../../store'
import { useRouter } from 'next/navigation'
import supabase from '../../../config/supabse'
import uploadIcon from '../../../public/assets/upload-cloud.svg'
import { ChevronRightCircle, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { Label } from '../../../components/ui/label';
import { useDropzone } from 'react-dropzone';
import ChatWindow from './ChatWindow';
import { SideBar, AdvancePage } from '../../(components)'
import { useToast } from '../../../components/ui/use-toast'


const Chat = () => {
  const [userSession, setUserSession] = useAtom(sessionAtom);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState(false);

  const [openMenu, setOpenMenu] = useAtom(openMenuAtom);
  const router = useRouter();
  const [fileName, setFileName] = useAtom(fileNameAtom);
  const [folder, setFolder] = useAtom(folderAtom);
  const [folderId, setFolderId] = useAtom(folderIdAtom);

  const { toast } = useToast();

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


  // function uploadFile(file) {
  //   const fileReader = new FileReader();
  //   fileReader.readAsText(file, 'utf-8');
  //   fileReader.onload = e => {
  //     const content = e.target.result;
  //     const currentFol = folder.filter(fol => fol.id === folderId);
  //     currentFol[0].files = [...currentFol[0].files, {name:file.name, content:content}]

  //     setFolder([...folder])      
  //   };
  // };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      const fileType = file.name.split('.')[1]
      if (fileType !== 'pdf' && fileType !== 'txt') {
        toast({
          variant: 'destructive',
          title: "This File type is not supported!"
        });
        return null
      }

      setFiles(file)
      uploadFile(file);
    } else {
      // console.error('Invalid file. Please upload a PDF, DOC, or XLS file.');
    }
  };

  async function uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append('files', file);
      console.log(formData)
      const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/connector/file/upload`, {
        method: "POST",
        body: formData
      });
      const json = await data.json();
      console.log('upload done', json)
      // setFilePath(json.file_paths[0]);
      connectorRequest(json.file_paths[0], file)
    } catch (error) {
      console.log('error in upload', error)
    }
  };

  async function connectorRequest(path, file) {
    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/connector`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "name": "FileConnector-" + Date.now(),
          "source": "file",
          "input_type": "load_state",
          "connector_specific_config": {
            "file_locations": [
              path
            ]
          },
          "refresh_freq": null,
          "disabled": false
        })
      }

      );
      const json = await data.json();
      // setConnectorId(json.id)
      console.log('conn done', json)
      getCredentials(json.id, file)
    } catch (error) {
      console.log('error while connectorRequest :', error)
    }
  };

  async function getCredentials(connectID, file) {
    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/credential`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",

        },
        body: JSON.stringify({
          "credential_json": {},
          "admin_public": true
        })
      });
      const json = await data.json();
      console.log('getCredentials done', json)
      sendURL(connectID, json.id, file)
    } catch (error) {
      console.log('error while getCredentials:', error)
    }
  };

  async function sendURL(connectID, credID, file) {
    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/connector/${connectID}/credential/${credID}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",

        },
        body: JSON.stringify({ 'name': file.name })
      });
      const json = await data.json();
      console.log('send done', json)
      await runOnce(connectID, credID);

    } catch (error) {
      console.log('error while sendURL:', error)
    }
  };

  async function runOnce(conID, credID) {
    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/connector/run-once`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "connector_id": conID,
          "credentialIds": [
            credID
          ]
        })
      });
      const json = await data.json()
      console.log('run once done', json)
      return toast({
        variant: 'default',
        title: "File Uploaded!"
      })
    } catch (error) {
      console.log('error in runOnce :', error)
    }
  };




  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });


  useEffect(() => {
    getSess();
    // console.log(folder)
  }, [folder]);



  if (loading || !userSession) {
    return (
      <div className='flex w-full justify-center items-center h-screen'>
        <Loader2 className='animate-spin' />
      </div>
    )
  };



  return (

    !loading &&

    <div className='w-full flex text-center font-Inter box-border'>

      <div className={`w-[28%] min-h-screen`}>
        <SideBar />
      </div>
      {fileName === 'upload' ?
        <div className='w-full flex flex-col justify-center items-center rounded-[6px] gap-5 sticky top-0 self-start p-10 min-h-screen'>
          <div>
            <p className='font-[600] text-[20px] tracking-[.25%] text-[#0F172A] opacity-[50%] leading-7'>This folder is empty</p>
            <p className='font-[400] text-sm tracking-[.25%] text-[#0F172A] opacity-[50%] leading-8'>Upload a document to start</p>
          </div>
          <div
            className={`w-[70%] border flex justify-center items-center bg-[#EFF5F5] p-32 ${isDragActive ? 'opacity-50' : ''}`}
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

        </div>
        :
        <div className='w-full sticky top-0 self-start h-screen'>
          {fileName === 'advance' ? <AdvancePage /> : <ChatWindow />}
        </div>
      }

    </div>
  )
}

export default Chat