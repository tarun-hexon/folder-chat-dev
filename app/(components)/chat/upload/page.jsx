'use client'
import React, { useState, useEffect } from 'react'
import { useAtom } from 'jotai';
import uploadIcon from '../../../../public/assets/upload-cloud.svg'
import { Label } from '../../../../components/ui/label';
import { Input } from '../../../../components/ui/input';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { fileNameAtom, existConnectorDetailsAtom, folderAtom, folderIdAtom, openMenuAtom, sessionAtom, existConnectorAtom } from '../../../store';
import { useToast } from '../../../../components/ui/use-toast';
import { useRouter } from 'next/navigation';
import supabase from '../../../../config/supabse';
import { Loader, Loader2Icon } from 'lucide-react';


const Upload = () => {
    const [userSession, setUserSession] = useAtom(sessionAtom);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [files, setFiles] = useState(false);
    const [openMenu, setOpenMenu] = useAtom(openMenuAtom);
    const router = useRouter()
    const [fileName, setFileName] = useAtom(fileNameAtom);
    const [folder, setFolder] = useAtom(folderAtom);
    const [folderId, setFolderId] = useAtom(folderIdAtom);
    const [existConnector, setExistConnector] = useAtom(existConnectorAtom);
    const [existConnectorDetails, setExistConnectorDetails] = useAtom(existConnectorDetailsAtom);
    const [ccIDs, setCCIds] = useState([]);
    const [currentDOC, setCurrentDoc] = useState([]);
    
    const [context, setContext] = useState({
        name:'',
        description:''
      })
    const { toast } = useToast();
    const onDrop = (acceptedFiles) => {
        if(existConnector[0]?.doc_set_name === '' && context.name === ''){
          return toast({
            variant: 'destructive',
            title: "Give your context a name first!"
          });
        }
        if (acceptedFiles && acceptedFiles.length > 0) {
          setUploading(true)
          const file = acceptedFiles[0];
    
          const fileType = file.name.split('.')[1]
          if (fileType !== 'pdf' && fileType !== 'txt') {
            setLoading(false)
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
          
          await runOnce(connectID, credID);
          setCurrentDoc(json.data);
          setTimeout(async()=> {
            if(existConnector.length === 0){
              
              await setDocumentSet(connectID, context.name, context.description);
            }else{
                
                  await updateDocumentSet(existConnector[0].doc_set_id, connectID, context.description)
                 
              
            } 
          }, 2000)
          
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

        } catch (error) {
          console.log('error in runOnce :', error)
          setUploading(false)
          return toast({
            variant: 'destructive',
            title: "Some Error Ocuured!"
          });
        }
      };
    
      async function setDocumentSet(ccID, f_name, des){
        
        const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/connector/indexing-status`);
        const json = await data.json();
        
        const docSetid = []
        for(const pair_id of json){
          if(pair_id?.connector?.id === ccID){
            docSetid.push(pair_id?.cc_pair_id);
          }
        };
        
        if(docSetid.length === 0){
          return null
        }
        
        try {
          
          const res = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/document-set`, {
            method:'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body:JSON.stringify({
              "name": f_name,
              "description": des,
              "cc_pair_ids": docSetid
            })
          });
          
          const id = await res.json();
    
          setContext({name:'', description:''})
          await insertDataInConn(docSetid, f_name, id)
          
        } catch (error) {
          console.log(error)  ;
          toast({
            variant: 'destructive',
            title: "Some Error Occured!"
          });
        }
      }
    
      async function updateDocumentSet(db_id, ccID, des){
        const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/connector/indexing-status`);
        const json = await data.json();
    
        const docSetid = [];
        for(const pair_id of json){
          if(pair_id?.connector?.id===ccID){
            docSetid.push(pair_id?.cc_pair_id);
          }
        };
        
        if(docSetid.length === 0){
          return null
        }
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/document-set`, {
            method:'PATCH',
            headers: {
              "Content-Type": "application/json",
            },
            body:JSON.stringify({
              "id": db_id,
              "description": des,
              "cc_pair_ids": docSetid
            })
          });
          setContext({name:'', description:''})
          await updatetDataInDB(existConnector, docSetid)
        } catch (error) {
          console.log(error)
        }
      }
      const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
    
      async function insertDataInConn(newData, doc_name, doc_id){
                   
        const { data, error } = await supabase
        .from('document_set')
        .insert(
          { 'cc_pair_id': newData, 'user_id' : userSession.user.id, 'folder_id':folderId, 'doc_set_name':doc_name,  'doc_set_id':doc_id},
        )
        .select()
        console.log(data)
        console.log(error)
        if(data.length > 0){
          setExistConnector(data)
          setFileName('chat')
          toast({
            variant: 'default',
            title: "File Uploaded!"
          });
          setUploading(false)
          router.push('/chat/new')
        }
      };
    
      async function updatetDataInDB(exConn, newData){
        // console.log(exConn, newData, folderId)
        const allConn = [...exConn[0].cc_pair_id, ...newData]
        const { data, error } = await supabase
        .from('document_set')
        .update(
          { 'cc_pair_id': allConn},
        )
        .eq('folder_id', folderId)
        .select()
        
        if(data.length){
            setUploading(false)
            setExistConnector(data);
            setUploading(false)
        //  setFileName('chat')
            await indexingStatus(folderId)
            toast({
                variant: 'default',
                title: "File Uploaded!"
            });
          router.push('/chat/new')
        }
      };
    
      async function indexingStatus(f_id){
        try {
            const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/connector/indexing-status`);
            const json = await data.json();
            // const isId = json.filter(da => da.credential.credential_json.id.includes(12));
            
            const allConID = await readData(f_id);
            
            var cc_p_id = []
            for(const cc_id of json){
              if(allConID?.includes(cc_id?.cc_pair_id)){
                cc_p_id.push(cc_id)
              }
            };
            setExistConnectorDetails(cc_p_id)
            return cc_p_id
        } catch (error) {
            console.log(error)
            
        }
    
    };
    async function readData(f_id){
      let fol_id = f_id
        if(!f_id){
          fol_id = localStorage.getItem('folderId')
        }
        const { data, error } = await supabase
        .from('document_set')
        .select('*')
        .eq('folder_id', fol_id);
        
        if(data?.length > 0){
          
          setExistConnector(data)
          return data[0].cc_pair_id
        }else{
          setExistConnector([])
        }
    };
      useEffect(() => {
        
        if(folder.length === 0){
            router.push('/chat/new')
        }

        indexingStatus(folderId)
        
        if(userSession){
          setLoading(false)
        }
        
      }, [folderId]);

  return (
    <div className='w-full flex flex-col justify-center items-center rounded-[6px] gap-5 sticky top-0 self-start p-10 min-h-screen'>
          {uploading ? 
          <div className={`w-[70%] border flex justify-center items-center bg-[#EFF5F5] p-32`}>
            <Loader className='animate-spin'/>
          </div>
          :
          <div className='w-[70%] border p-5 flex flex-col justify-center items-center gap-2 rounded-md shadow-black shadow-sm'>
            {existConnector.length === 0 &&  
            <div>
              <p className='font-[600] text-[20px] tracking-[.25%] text-[#0F172A] opacity-[50%] leading-7'>This folder is empty</p>
              <p className='font-[400] text-sm tracking-[.25%] text-[#0F172A] opacity-[50%] leading-8'>Upload a document to start</p>
            </div>}
            <div className='w-full text-start space-y-2 '>
              <div>
                <Label className='text-start' htmlFor='context'>Name Of Context</Label>
                <Input type='text' placeholder='Name Should Be Unique' id='context' disabled={existConnector.length !== 0} value={existConnector[0]?.doc_set_name || context.name} onChange={(e) => setContext({...context, name:e.target.value})}/>
            </div>
            <div>
                <Label className='text-start' htmlFor='context'>Description</Label>
                <Input type='text' placeholder='write a short description' id='context' value={context.description} onChange={(e) => setContext({...context, description:e.target.value})}/></div>
            </div>
            <div
              className={`w-full border flex justify-center items-center bg-[#EFF5F5] p-20 ${isDragActive ? 'opacity-50' : ''} shadow-md`}
              {...getRootProps()}
            >
              <Label htmlFor='upload-files' className='flex flex-col items-center justify-center' >
                <Image src={uploadIcon} alt='upload' />
                <div className='w-full text-center'>
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
          </div>
          }
        </div>
  )
}

export default Upload