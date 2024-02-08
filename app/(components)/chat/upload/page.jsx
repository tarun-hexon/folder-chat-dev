'use client'
import React, { useState, useEffect } from 'react'
import { useAtom } from 'jotai';
import uploadIcon from '../../../../public/assets/upload-cloud.svg'
import { Label } from '../../../../components/ui/label';
import { Input } from '../../../../components/ui/input';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { folderAtom, folderIdAtom, sessionAtom, userConnectorsAtom, documentSetAtom } from '../../../store';
import { useToast } from '../../../../components/ui/use-toast';
import { useRouter } from 'next/navigation';
import supabase from '../../../../config/supabse';
import { Loader, Loader2, X } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { cn } from '../../../../lib/utils';
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../../components/ui/dialog'


const Upload = () => {

  const [session, setSession] = useAtom(sessionAtom);
  const [loading, setLoading] = useState(true);
  const [d_open, setD_open] = useState(false)
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [folder, setFolder] = useAtom(folderAtom);
  const [folderId, setFolderId] = useAtom(folderIdAtom);
  const [documentSet, setDocumentSet] = useState([]);
  // const [documentSet, setDocumentSet] = useAtom(documentSetAtom);
  const [dialogLoader, setDialogLoader] = useState(false);

  const [currentDOC, setCurrentDoc] = useState([]);
  const [userConnectors, setUserConnectors] = useAtom(userConnectorsAtom);
  const [existConnector, setExistConnector] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState([]);
  const router = useRouter()
  const [context, setContext] = useState({
    contextName: '',
    fileName: '',
    description: ''
  })
  const { toast } = useToast();

  const onDrop = (acceptedFiles) => {

    if (acceptedFiles && acceptedFiles.length > 0) {

      acceptedFiles?.map((file, index) => {

        const fileType = file?.name?.split('.')[1]
        // if (fileType !== 'pdf' && fileType !== 'txt') {

        //   toast({
        //     variant: 'destructive',
        //     title: "This File type is not supported!"
        //   });

        //   return null
        // }
        // const maxSize = 1024 * 1024
        // if (file.size > maxSize) {
        //   toast({
        //     variant: 'destructive',
        //     title: "File size exceeded!"
        //   });
        // };
        // const file = acceptedFiles[index];

        setFiles((prev) => [...prev, file])
      })

        ;
    } else {
      // console.error('Invalid file. Please upload a PDF, DOC, or XLS file.');
    }
  };

  async function uploadFile(files) {
    if (documentSet?.length === 0 && context.contextName === '') {
      return toast({
        variant: 'destructive',
        title: "Give your context a name first!"
      });
    } else if (documentSet[0]?.doc_set_name === '' && context.contextName === '') {
      return toast({
        variant: 'destructive',
        title: "Give your context a name first!"
      });
    };
    if (context.fileName === '') {
      return toast({
        variant: 'destructive',
        title: "Write a valid name for files identification!"
      });
    }
    if (context.contextName.split('-').length > 1) {
      return toast({
        variant: 'destructive',
        title: `Remove '-' from Context Name`
      });
    }

    let { data: doc_set_name, error } = await supabase
      .from('document_set')
      .select("doc_set_name")
      .eq('doc_set_name', `${context.contextName}-${session?.user?.email.split('@')[0]}`)


    if (doc_set_name.length > 0) {
      return toast({
        variant: 'destructive',
        title: "Context Name Already Exist !"
      });
    }

    setUploading(true)
    try {
      const formData = new FormData();
      let isZip = false
      files?.forEach((file) => {
        //console.log(file.type === "application/zip")
        if(file.type === "application/zip"){
          setUploading(false)
          isZip = true
          return toast({
            variant: 'destructive',
            title: "Zip File Not Allowed"
          });
        }
        formData.append("files", file);
      });
      
     if(isZip){
      
      return null
     }
     
      const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/connector/file/upload`, {
        method: "POST",
        body: formData
      });
      const json = await data.json();
      // console.log('upload done', json)
      // setFilePath(json.file_paths[0]);
      await connectorRequest(json.file_paths)
    } catch (error) {
      console.log('error in upload', error)
      setUploading(false)
      return toast({
        variant: 'destructive',
        title: "Some Error Ocuured!"
      });

    }
  };

  async function connectorRequest(path) {
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
            "file_locations": path
          },
          "refresh_freq": null,
          "disabled": false
        })
      }

      );
      const json = await data?.json();
      // console.log(existConnector, '164')

      if (existConnector?.length === 0) {
        // console.log(existConnector, '166')
        await insertDataInConTable([json?.id])
      } else {
        // console.log(existConnector, '169')
        await updatetDataInConTable(existConnector, json?.id)
      }

      await getCredentials(json?.id)
    } catch (error) {
      console.log('error while connectorRequest :', error)
      setUploading(false)
      return toast({
        variant: 'destructive',
        title: "Some Error Ocuured!"
      });
    }
  };

  async function getCredentials(connectID) {
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
      const json = await data?.json();
      // console.log('getCredentials done', json)
      await sendURL(connectID, json?.id)
    } catch (error) {
      console.log('error while getCredentials:', error)
      setUploading(false)
      return toast({
        variant: 'destructive',
        title: "Some Error Ocuured!"
      });
    }
  };

  async function sendURL(connectID, credID) {
    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/connector/${connectID}/credential/${credID}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",

        },
        body: JSON.stringify({ 'name': context.fileName })
      });
      const json = await data?.json();

      await runOnce(connectID, credID);
      setCurrentDoc(json.data);
      setTimeout(async () => {
        if (documentSet.length === 0) {
          await setDocumentSetInServer(connectID, context.contextName, context);
        } else {
          await updateDocumentSetInServer(documentSet[0]?.doc_set_id, connectID, context)
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
      // console.log('run once done', json);

    } catch (error) {
      console.log('error in runOnce :', error)
      setUploading(false)
      return toast({
        variant: 'destructive',
        title: "Some Error Ocuured!"
      });
    }
  };

  async function setDocumentSetInServer(ccID, set_name, con) {

    const data = await fetch(`/api/manage/admin/connector/indexing-status`);
    const json = await data.json();

    const docSetid = []
    
    for (const pair_id of json) {
      if (pair_id?.connector?.id === ccID) {
        docSetid.push(pair_id?.cc_pair_id);
        
      }
    };
    // console.log(docSetid)
    if (docSetid.length === 0) {
      return null
    }

    try {

      const res = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/document-set`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "name": `${set_name}-${session?.user?.email.split('@')[0]}`,
          "description": context.description,
          "cc_pair_ids": docSetid
        })
      });

      const id = await res.json();

      if (id) {

        await insertDataInDB(docSetid, `${set_name}-${session?.user?.email.split('@')[0]}`, id, context.fileName)
        
      } else {
        return toast({
          variant: 'destructive',
          title: "Some Error Occured!"
        })
      }

    } catch (error) {
      console.log(error);
      toast({
        variant: 'destructive',
        title: "Some Error Occured!"
      });
    }
  }

  async function updateDocumentSetInServer(db_id, ccID, con) {

    const data = await fetch(`/api/manage/admin/connector/indexing-status`);
    const json = await data.json();

    const docSetid = documentSet[0]?.cc_pair_id
    for (const pair_id of json) {
      if (pair_id?.connector?.id === ccID) {
        docSetid.push(pair_id?.cc_pair_id);
      }
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/document-set`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "id": db_id,
          "description": con.description,
          "cc_pair_ids": docSetid
        })
      });

      await updatetDataInDB(docSetid, context.fileName)
      setContext({ fileName: '', description: '', contextName: '' })
    } catch (error) {
      console.log(error)
    }
  }

  async function setDocumentSetInServer2(ccID, context) {

    const data = await fetch(`/api/manage/admin/connector/indexing-status`);
    const json = await data.json();


    let newArr = []
    const docSetName = []
    for (let i = 0; i < ccID?.length; i++) {
      if (newArr.indexOf(ccID[i]) < 0) {
        newArr.push(ccID[i])
        
      }
    };

    for (let i = 0; i < newArr?.length; i++) {
      for(const item of json){
        if (item?.cc_pair_id === newArr[i]){
          // console.log(item?.name)
          docSetName.push(item?.name)
        }
      }
    };

    if (newArr.length === 0) {
      return null
    }
    // console.log(docSetName);
    
    try {

      const res = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/document-set`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "name": `${context.contextName}-${session?.user?.email.split('@')[0]}`,
          "description": context.description,
          "cc_pair_ids": newArr
        })
      });

      const id = await res.json();

      if (id) {

        
        const { data, error } = await supabase
          .from('document_set')
          .insert(
            {
              'cc_pair_id': newArr,
              'user_id': session?.user?.id,
              'folder_id': folderId,
              'doc_set_name': `${context.contextName}-${session?.user?.email.split('@')[0]}`,
              'doc_set_id': id,
              'files_name': docSetName
            },
          )
          .select()

        if (data?.length > 0) {
          setDocumentSet(data)
          toast({
            variant: 'default',
            title: "File Uploaded!"
          });
          router.push('/chat/new')
        }
        setContext({ fileName: '', contextName: '', description: '' })
        
        setD_open(false)
        setDialogLoader(false)
      } else {
        return toast({
          variant: 'destructive',
          title: "Some Error Occured!"
        })
      }

    } catch (error) {
      console.log(error);
      toast({
        variant: 'destructive',
        title: "Some Error Occured!"
      });
    }
  }

  async function updateDocumentSetInServer2(db_id, ccID, c_name) {

    let newArr = [...documentSet[0]?.cc_pair_id]
    
    for (let i = 0; i < ccID?.length; i++) {
      if (newArr.indexOf(ccID[i]) < 0) {
        newArr.push(ccID[i])
      }
    };

    // console.log(newArr);
    // return null

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/document-set`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "id": db_id,
          "description": '',
          "cc_pair_ids": newArr
        })
      });

      await updatetDataInDB(newArr, c_name);
      setContext({ fileName: '', description: '', contextName: '' })
      setD_open(false)
      setDialogLoader(false)
    } catch (error) {
      console.log(error)
    }
  }

  async function insertDataInDB(newData, doc_name, doc_id, c_name) {

    const { data, error } = await supabase
      .from('document_set')
      .insert(
        {
          'cc_pair_id': newData,
          'user_id': session?.user?.id,
          'folder_id': folderId,
          'doc_set_name': doc_name,
          'doc_set_id': doc_id,
          'files_name': [c_name]
        },
      )
      .select()

    if (data?.length > 0) {
      setDocumentSet(data)
      toast({
        variant: 'default',
        title: "File Uploaded!"
      });
      router.push('/chat/new')
    }
  };

  async function updatetDataInDB(newData, name) {

    let names = []
    if (documentSet[0]?.files_name?.length > 0) {
      names = [...documentSet[0]?.files_name, name]
    } else {
      names = [name]

    }
    // console.log(names)
    const { data, error } = await supabase
      .from('document_set')
      .update(
        { 'cc_pair_id': newData, 'files_name': names },
      )
      .eq('folder_id', folderId)
      .select()

    if (data?.length) {
      setDocumentSet(data);

      toast({
        variant: 'default',
        title: "File Uploaded!"
      });
      router.push('/chat/new')
      
    }
  };

  async function insertDataInConTable(newData) {

    const { data, error } = await supabase
      .from('connectors')
      .insert(
        { 'connect_id': newData, 'user_id': session?.user?.id},
      )
      .select()
    // console.log(data)
    // console.log(error)
    setExistConnector(data[0]?.connect_id);
    // setUploading(false)
  };

  async function updatetDataInConTable(exConn, newData) {

    const allConn = [...exConn, newData]
    const { data, error } = await supabase
      .from('connectors')
      .update(
        { 'connect_id': allConn },
      )
      .eq('user_id', session?.user?.id)
      
    // console.log(data)
    // console.log(error)
    // setExistConnector(data[0]?.connect_id);
    //setUploading(false)
    // if(data?.length > 0){
    //   setExistConnector(data[0]?.connect_id)
    // }
  };


  function handleDocSetID(id) {
    //console.log(id)
    if (selectedDoc?.includes(parseInt(id))) {
      // const idx = selectedDoc.indexOf(id);
      setSelectedDoc(selectedDoc?.filter(doc => doc !== parseInt(id)))
    } else {
      setSelectedDoc((prev) => [...prev, parseInt(id)])

    }
    // console.log(selectedDoc)

  }

  async function uploadDocSetFiles() {

    if (selectedDoc?.length === 0) {
      
      return toast({
        variant: 'destructive',
        title: "Please select atleast one file!"
      })
    }
    // console.log(selectedDoc);
    setDialogLoader(true)
    if (documentSet?.length === 0) {
      await setDocumentSetInServer2(selectedDoc, context);
    } else {
      await updateDocumentSetInServer2(documentSet[0]?.doc_set_id, selectedDoc, context.fileName)
    }
  };

  async function getDocSetDetails(folder_id) {
    let { data: document_set, error } = await supabase
      .from('document_set')
      .select("*")
      .eq('folder_id', folder_id)
    if (document_set.length > 0) {
      setDocumentSet(document_set)
    } else {
      setDocumentSet([])
    }
    setLoading(false)
  };

  // async function getConnectorsID(folderId){
    
  //   const { data, error } = await supabase
  //   .from('connectors')
  //   .select('connect_id')
  //   .eq('user_id', session?.user?.id);
    
  //   if(data?.length > 0){
  //       // console.log(data)
  //       setExistConnector(data[0]?.connect_id)
  //   }
  //   return []
  // };

  function dialogOpenChange(){
    if(documentSet[0]?.cc_pair_id?.length > 0){
      setSelectedDoc(documentSet[0]?.cc_pair_id)
      context.fileName !== ''  && setD_open(!d_open)
    }else{
      () => setSelectedDoc([])
      if(context.fileName !=='' && context.contextName !== ''){
        setD_open(!d_open)
      }
    }
    // setSelectedDoc(documentSet[0]?.cc_pair_id?.length > 0 ? documentSet[0]?.cc_pair_id : []); 
    // setD_open(!d_open)

  };

  function selectFromExistingOnClick(){
    if(documentSet[0]?.cc_pair_id?.length > 0){
      if(context.fileName === ''){
        return toast({
          variant: 'destructive',
          title: "File Name is required!"
        })
      }
    }else{
      if(context.fileName=='' || context.contextName === ''){
        return toast({
          variant: 'destructive',
          title: "File and context name are required!"
        })
      }
    }
    setD_open(!d_open)
    
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {

    if (folder === null || folder?.length === 0) {
      router.push('/chat/new')
    } 
    // else {
    //   setLoading(false)
    // }

  }, [folder]);

  useEffect(() => {
    if (folderId) {
      getDocSetDetails(folderId);
      // getConnectorsID(folderId);
    }

  }, [folderId]);


  useEffect(() => {

    if (userConnectors !== null) {
      // const fileData = userConnectors?.filter((item) => item?.connector?.source === 'file');
      const conn_ids = userConnectors?.map(conn => { return conn?.connector?.id });
      // console.log(conn_ids)
      setExistConnector(conn_ids);


      // if (fileData?.length > 0) {
      //   const conn_ids = userConnectors?.map(conn => { return conn?.connector?.id });
      //   setExistConnector(conn_ids);
      // };
    }
  }, [userConnectors]);

  if (loading) {
    return (
      <div className='flex w-full justify-center items-center h-screen'>
        <Loader2 className='animate-spin' />
      </div>
    )
  };


  return (
    <div className='w-full flex flex-col justify-center items-center rounded-[6px] gap-5 sticky top-0 self-start p-10 min-h-screen'>
      {uploading ?
        <div className={`w-[70%] border flex flex-col justify-center items-center bg-[#EFF5F5] h-48 gap-4`}>
          <Loader className='animate-spin' />
          <p className='font-[500] text-sm leading-5 animate-pulse'>Please wait... We are processing your document.</p>
        </div>
        :
        <div className='w-[70%] p-5 flex flex-col justify-center items-center gap-2 rounded-md shadow-black shadow-sm'>
          {documentSet?.length === 0 &&
            <div>
              <p className='font-[600] text-[20px] tracking-[.25%] text-[#0F172A] opacity-[50%] leading-7'>This folder is empty</p>
              <p className='font-[400] text-sm tracking-[.25%] text-[#0F172A] opacity-[50%] leading-8'>Upload a document to start</p>
            </div>}
          {documentSet?.length === 0 ?
            <div className='w-full text-start space-y-2 '>
              
              <div>
                <Label className='text-start' htmlFor='context'>Name of Context</Label>
                <Input type='text' placeholder='Name Should Be Unique' id='context' value={context.contextName} onChange={(e) => setContext({ ...context, 'contextName': e.target.value })} />
              </div>
              <div>
                <Label className='text-start' htmlFor='context'>File Name</Label>
                <Input type='text' placeholder='Write a name to identify your files' id='context' value={context.fileName} onChange={(e) => setContext({ ...context, 'fileName': e.target.value })} />
              </div>
              <div>
                <Label className='text-start' htmlFor='context'>Description</Label>
                <Input type='text' placeholder='write a short description' id='context' value={context?.description} onChange={(e) => setContext({ ...context, description: e.target.value })} />
              </div>
            </div> :
            <div className='w-full text-start space-y-2 mb-2'>

              <Label className='text-start' htmlFor='context'>File Name</Label>
              <Input type='text' placeholder='Write a name to identify your files' id='context' value={context.fileName} onChange={(e) => setContext({ ...context, 'fileName': e.target.value })} />

            </div>
          }

          {files.length === 0 ?
            <>
              <div
                className={`w-full border rounded-md flex flex-col justify-center items-center bg-[#EFF5F5] py-5 ${isDragActive ? 'opacity-50' : ''} shadow-md`}
                {...getRootProps()}
              >
                <input {...getInputProps()} multiple accept=".pdf, .txt, .md, .mdx, .docx, .doc" required />

                <Image src={uploadIcon} alt='upload' />
                <div className='w-full text-center'>
                  <p className='font-[400] leading-6 text-[15px] opacity-[80%]'>Click to upload or drag and drop</p>
                  <p className='opacity-[50%] text-sm leading-6'>PDF & TXT</p>
                  {/* <p className='opacity-[50%] text-sm leading-6'>Max Size 1MB</p> */}
                </div>

                {/* <div

                  {...getInputProps()}
                  type='file'
                  id='upload-files'
                  accept='.pdf, .doc, .docx, .xls, .xlsx'
                  style={{ display: 'none' }}
                />   */}
              </div>
              {userConnectors?.length > 0 && <div className='w-full text-sm leading-5 text-center space-y-2'>
                <p className='font-[500]'>OR</p>
                <Dialog open={d_open} onOpenChange={() => dialogOpenChange()} className='fixed max-h-52 overflow-x-scroll no-scrollbar' >
                  <DialogTrigger asChild>
                    <p className='font-[600] p-2 border w-[70%] m-auto rounded-sm shadow-sm bg-[#EFF5F5] hover:cursor-pointer' onClick={() => selectFromExistingOnClick()}>Select From Existing Files</p>
                  </DialogTrigger>
                  <DialogContent>
                    {!dialogLoader ? 
                    <>
                    <h1 className='font-[600] text-sm leading-5 m-2'>Select Documents</h1>
                    <div className='flex gap-2 flex-wrap'>
                      {userConnectors?.map((connector) => connector?.connector?.source === 'file' ?
                        <div className='space-x-2 p-1 border flex items-center rounded-sm hover:bg-slate-100 w-fit break-all' key={connector?.cc_pair_id}>
                          <input type="checkbox" value={connector?.cc_pair_id} checked={selectedDoc?.includes(connector?.cc_pair_id)} id={connector?.cc_pair_id} className={`px-2 py-1 border rounded hover:cursor-pointer hover:bg-gray-100 `} onChange={(e) => handleDocSetID(e.target.value)} /><label htmlFor={connector?.cc_pair_id} >{connector?.name}</label>
                        </div>: null)
                      }
                    </div>
                    <DialogFooter className={cn('w-full')}>
                      <Button variant={'outline'} className={cn('bg-[#14B8A6] text-[#ffffff] m-auto')} onClick={() => uploadDocSetFiles()}>Update</Button>
                    </DialogFooter>
                    </>
                    :
                    <div className='w-full'>
                      <Loader2 className='animate-spin m-auto'/>
                    </div>
                    }

                  </DialogContent>
                </Dialog>
              </div>}
            </>
            :
            <div className='w-full text-center space-y-4'>
              <div className='w-full border flex flex-col gap-1 justify-center items-center min-h-[20vh] max-h-[40vh] bg-[#EFF5F5] rounded-md relative p-4 overflow-y-scroll'>

                {files?.map(file => <p key={file?.name} className='text-sm leading-6 break-all'>{file?.name}</p>)}
                <X size={'1rem'} className='self-start absolute top-1 right-1 hover:cursor-pointer' onClick={() => setFiles([])} />
              </div>

              <Button className={cn('bg-[#14B8A6] hover:bg-[#14B8A6] hover:opacity-80 ml-auto')} onClick={() => uploadFile(files)}>Upload</Button>
            </div>
          }
        </div>
      }
    </div>
  )
}

export default Upload