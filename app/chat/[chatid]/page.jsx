'use client'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { fileNameAtom, folderAtom, folderIdAtom, openMenuAtom, sessionAtom, currentDOCNameAtom } from '../../store'
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
import { fetchCCPairId } from '../../../lib/helpers'


const Chat = () => {
  const [userSession, setUserSession] = useAtom(sessionAtom);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState(false);
  const [openMenu, setOpenMenu] = useAtom(openMenuAtom);
  const router = useRouter();
  const [fileName, setFileName] = useAtom(fileNameAtom);
  const [folder, setFolder] = useAtom(folderAtom);
  const [folderId, setFolderId] = useAtom(folderIdAtom);
  const [existConnector ,setExistConnector] = useState([]);
  const [ccIDS, setCcIDS] = useState([]);
  const [currentDOC, setCurrentDoc] = useState([]);
  const [currentDOCName, setCurrentDocName] = useAtom(currentDOCNameAtom);

  const [uploading, setUploading] = useState(false);
  
  const { toast } = useToast();

  async function getSess() {
    await supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserSession(session);
        if (session?.user?.user_metadata?.onBoarding) {
          setLoading(false)
          // router.push('/chat/new')
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



  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setUploading(true)
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
      // console.log(formData)
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
      setUploading(false)
      return toast({
        variant: 'destructive',
        title: "Some Error Ocuured!"
      });
      
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
      
      if(existConnector.length === 0){
        await insertDataInConn([json.id])
    }else{
        await updatetDataInConn(existConnector, json.id)
    }
      console.log('conn done', json)
      getCredentials(json.id, file)
    } catch (error) {
      console.log('error while connectorRequest :', error)
      setUploading(false)
      return toast({
        variant: 'destructive',
        title: "Some Error Ocuured!"
      });
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
      setUploading(false)
      return toast({
        variant: 'destructive',
        title: "Some Error Ocuured!"
      });
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
      setCurrentDoc(json.data);
      await setDocumentSet(json.data, file.name)
    } catch (error) {
      console.log('error while sendURL:', error)
      setUploading(false)
      return toast({
        variant: 'destructive',
        title: "Some Error Ocuured!"
      });
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
      console.log('run once done', json);
      setUploading(false)
      toast({
        variant: 'default',
        title: "File Uploaded!"
      });
      
      setFileName('chat')
      window.history.replaceState('', '', `/chat/new`);
    } catch (error) {
      console.log('error in runOnce :', error)
      setUploading(false)
      return toast({
        variant: 'destructive',
        title: "Some Error Ocuured!"
      });
    }
  };
async function setDocumentSet(cc, f_name){
  const res = await fetch('https://danswer.folder.chat/api/manage/admin/document-set', {
    method:'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body:JSON.stringify({
      "name": f_name,
      "description": "dummy desc",
      "cc_pair_ids": [
        cc
      ]
  })
  })
}
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  async function insertDataInConn(newData){
               
    const { data, error } = await supabase
    .from('connectors')
    .insert(
      { 'connect_id': newData, 'user_id' : userSession.user.id, 'folder_id':folderId },
    )
    .select()
    // console.log(data)
    // console.log(error)
    setExistConnector(data[0].connect_id)
  };

  async function updatetDataInConn(exConn, newData){
    
    const allConn = [...exConn, newData]
    const { data, error } = await supabase
    .from('connectors')
    .update(
      { 'connect_id': allConn },
    )
    .eq('folder_id', folderId)
    .select()
    // console.log(data)
    // console.log(error)
    setExistConnector(data[0].connect_id)
  };

async function readData(){
    try {
        const cc_ids = await fetchCCPairId();
        if(cc_ids){
          setCcIDS(cc_ids);
        }
        const { data, error } = await supabase
        .from('connectors')
        .select('connect_id')
        .eq('folder_id', folderId);
        if(error){
            throw error
        }else{
            if(data.length > 0){
                setExistConnector(data[0].connect_id);
                for (const name of ccIDS){
                    if(name.cc_pair_id === data[0].connect_id[data[0].connect_id.length-1]){
                      setCurrentDocName({name:name.name, id:name.cc_pair_id})
                    }
                }
                return data[0].connect_id
            }else{
                setExistConnector([])
                setCurrentDocName({name:'', id:null})
                return []
            }
        }
        
    } catch (error) {
        setExistConnector([])
        console.log(error)
    }
};

  useEffect(() => {
    getSess();
    
    
    if(userSession){
      setLoading(false)
    }
    
  }, [folder]);


  useEffect(()=> {
    folderId && readData()
  }, [folderId]);


  useEffect(()=> {
      console.log(existConnector)
    },
  [existConnector])


  if (loading || !userSession) {
    return (
      <div className='flex w-full justify-center items-center h-screen'>
        <Loader2 className='animate-spin' />
      </div>
    )
  };



  return (

    !loading &&

    <>

      
      {fileName === 'upload' ?
        <div className='w-full flex flex-col justify-center items-center rounded-[6px] gap-5 sticky top-0 self-start p-10 min-h-screen'>
          {uploading ? 
          <div className={`w-[70%] border flex justify-center items-center bg-[#EFF5F5] p-32`}>
            Your File is uploading please wait...!
          </div>
          :
          <>
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
                  <p className='opacity-[50%] text-sm leading-6'>PDF & TXT</p>
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
          </>
          }
        </div>
        :
        <div className='w-full sticky top-0 self-start h-screen'>
          {fileName === 'advance' ? <AdvancePage /> : <ChatWindow />}
        </div>
      }

    </>
  )
}

export default Chat