'use client'
import React, { useState, useEffect } from 'react'
import { useAtom } from 'jotai';
import uploadIcon from '../../../../public/assets/upload-cloud.svg'
import { Label } from '../../../../components/ui/label';
import { Input } from '../../../../components/ui/input';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { existConnectorDetailsAtom, folderAtom, folderIdAtom, sessionAtom, documentSetAtom, userConnectorsAtom, allIndexingConnectorAtom } from '../../../store';
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
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState(false);
  const [folder, setFolder] = useAtom(folderAtom);
  const [folderId, setFolderId] = useAtom(folderIdAtom);
  const [documentSet, setDocumentSet] = useAtom(documentSetAtom);
  const [existConnectorDetails, setExistConnectorDetails] = useAtom(existConnectorDetailsAtom);
  const [allConnectorFromServer, setAllConnectorFromServer] = useAtom(allIndexingConnectorAtom);
  const [currentDOC, setCurrentDoc] = useState([]);
  const [userConnectors, setUserConnectors] = useAtom(userConnectorsAtom);
  const [existConnector, setExistConnector] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState([]);
  const router = useRouter()
  const [context, setContext] = useState({
    name: '',
    description: ''
  })
  const { toast } = useToast();

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
      const maxSize = 1024 * 1024
      if (file.size > maxSize) {
        toast({
          variant: 'destructive',
          title: "File size exceeded!"
        });
      };

      setFiles(file)

        ;
    } else {
      // console.error('Invalid file. Please upload a PDF, DOC, or XLS file.');
    }
  };

  async function uploadFile(file) {
    if (documentSet[0]?.doc_set_name === '' && context.name === '') {
      return toast({
        variant: 'destructive',
        title: "Give your context a name first!"
      });
    } else if (documentSet.length === 0 && context.name === '') {
      return toast({
        variant: 'destructive',
        title: "Give your context a name first!"
      });
    };

    if (context.name.split('-').length > 1) {
      return toast({
        variant: 'destructive',
        title: `Remove '-' from Context Name`
      });
    }

    let { data: doc_set_name, error } = await supabase
      .from('document_set')
      .select("doc_set_name")
      .eq('doc_set_name', `${context.name}-${session?.user?.email.split('@')[0]}`)


    if (doc_set_name.length > 0) {
      return toast({
        variant: 'destructive',
        title: "Context Name Already Exist !"
      });
    }

    setUploading(true)
    try {
      const formData = new FormData();
      formData.append('files', file);
      // console.log(formData)
      const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/connector/file/upload`, {
        method: "POST",
        body: formData
      });
      const json = await data.json();
      // console.log('upload done', json)
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
      const json = await data?.json();
      if (existConnector?.length === 0) {
        await insertDataInConTable([json?.id])
      } else {
        await updatetDataInConTable(existConnector, json?.id)
      }
      getCredentials(json?.id, file)
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
      const json = await data?.json();
      // console.log('getCredentials done', json)
      sendURL(connectID, json?.id, file)
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
      const json = await data?.json();

      await runOnce(connectID, credID);
      setCurrentDoc(json.data);
      setTimeout(async () => {
        if (documentSet.length === 0) {
          await setDocumentSetInServer(connectID, context.name, context.description);
        } else {
          await updateDocumentSetInServer(documentSet[0].doc_set_id, connectID, context.description)
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

  async function setDocumentSetInServer(ccID, set_name, des) {

    // const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/connector/indexing-status`);
    // const json = await data.json();

    const docSetid = []
    for (const pair_id of allConnectorFromServer) {
      if (pair_id?.connector?.id === ccID) {
        docSetid.push(pair_id?.cc_pair_id);
      }
    };

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
          "description": des,
          "cc_pair_ids": docSetid
        })
      });

      const id = await res.json();

      setContext({ name: '', description: '' })
      await insertDataInDB(docSetid, `${set_name}-${session?.user?.email.split('@')[0]}`, id)

    } catch (error) {
      console.log(error);
      toast({
        variant: 'destructive',
        title: "Some Error Occured!"
      });
    }
  }

  async function updateDocumentSetInServer(db_id, ccID, des) {
    // const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/connector/indexing-status`);
    // const json = await data.json();

    const docSetid = [];
    for (const pair_id of allConnectorFromServer) {
      if (pair_id?.connector?.id === ccID) {
        docSetid.push(pair_id?.cc_pair_id);
      }
    };

    if (docSetid.length === 0) {
      return null
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/document-set`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "id": db_id,
          "description": des,
          "cc_pair_ids": docSetid
        })
      });
      setContext({ name: '', description: '' })
      await updatetDataInDB(documentSet, docSetid)
    } catch (error) {
      console.log(error)
    }
  }

  async function insertDataInDB(newData, doc_name, doc_id) {

    const { data, error } = await supabase
      .from('document_set')
      .insert(
        {
          'cc_pair_id': newData,
          'user_id': session.user.id,
          'folder_id': folderId,
          'doc_set_name': doc_name,
          'doc_set_id': doc_id
        },
      )
      .select()
    // console.log(data)
    // console.log(error)
    if (data.length > 0) {
      setDocumentSet(data)
      // setFileName('chat')
      toast({
        variant: 'default',
        title: "File Uploaded!"
      });
      router.push('/chat/new')
      setUploading(false)
    }
  };

  async function updatetDataInDB(exConn, newData) {
    // console.log(exConn, newData, folderId)
    const allConn = [...exConn[0].cc_pair_id, ...newData]
    const { data, error } = await supabase
      .from('document_set')
      .update(
        { 'cc_pair_id': allConn },
      )
      .eq('folder_id', folderId)
      .select()

    if (data?.length) {
      setDocumentSet(data);
      await indexingStatus(folderId)
      toast({
        variant: 'default',
        title: "File Uploaded!"
      });
      router.push('/chat/new')
      setUploading(false)
    }
  };

  async function insertDataInConTable(newData) {

    const { data, error } = await supabase
      .from('connectors')
      .insert(
        { 'connect_id': newData, 'user_id': session.user.id },
      )
      .select()
    // console.log(data)
    // console.log(error)
    setExistConnector(data[0]?.connect_id);
    setUploading(false)
  };

  async function updatetDataInConTable(exConn, newData) {

    const allConn = [...exConn, newData]
    const { data, error } = await supabase
      .from('connectors')
      .update(
        { 'connect_id': allConn },
      )
      .eq('user_id', session?.user?.id)
      .select()
    // console.log(data)
    // console.log(error)
    setExistConnector(data[0]?.connect_id);
    setUploading(false)
  };

  async function indexingStatus(f_id) {
    try {
      // const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/connector/indexing-status`);
      // const json = await data.json();
      // const isId = json.filter(da => da.credential.credential_json.id.includes(12));

      const allConID = await getDocSetData(f_id);

      var cc_p_id = []
      for (const cc_id of allConnectorFromServer) {
        if (allConID?.includes(cc_id?.cc_pair_id)) {
          cc_p_id.push(cc_id)
        }
      };
      setExistConnectorDetails(cc_p_id)
      return cc_p_id
    } catch (error) {
      console.log(error)

    }

  };

  async function getDocSetData(f_id) {
    
    const { data, error } = await supabase
      .from('document_set')
      .select('*')
      .eq('folder_id', f_id);

    if (data?.length > 0) {

      setDocumentSet(data);
      setSelectedDoc(data[0]?.cc_pair_id)
      return data[0].cc_pair_id
    } else {
      setDocumentSet([])
    }
    console.log(data, error)
  };

  function handleDocSetID(id) {
    //console.log(id)
    if(selectedDoc.includes(parseInt(id))){
        // const idx = selectedDoc.indexOf(id);
        setSelectedDoc(selectedDoc.filter(doc => doc !== parseInt(id)))
    }else{
        setSelectedDoc((prev) => [...prev, parseInt(id)])
        
    }
    console.log(selectedDoc)
    
}

  async function uploadDocSetFiles(){
    if (documentSet.length === 0) {
      await setDocumentSetInServer(connectID, context.name, context.description);
    } else {
      await updateDocumentSetInServer(documentSet[0].doc_set_id, connectID, context.description)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    
    if (folder === null) {
        router.push('/chat/new')
    }
  }, [folder]);


  useEffect(() => {
    // getAllExistingConnector();

    if (userConnectors !== null) {
      const filData = userConnectors?.filter((item) => item?.connector?.source === 'file');
      if (filData.length > 0) {
        const conn_ids = filData?.map(conn => { return conn?.connector?.id });
        setExistConnector(conn_ids)
      };
    }
  }, [userConnectors]);

  return (
    <div className='w-full flex flex-col justify-center items-center rounded-[6px] gap-5 sticky top-0 self-start p-10 min-h-screen'>
      {uploading ?
        <div className={`w-[70%] border flex justify-center items-center bg-[#EFF5F5] p-32`}>
          <Loader className='animate-spin' />
        </div>
        :
        <div className='w-[70%] p-5 flex flex-col justify-center items-center gap-2 rounded-md shadow-black shadow-sm'>
          {documentSet?.length === 0 &&
            <div>
              <p className='font-[600] text-[20px] tracking-[.25%] text-[#0F172A] opacity-[50%] leading-7'>This folder is empty</p>
              <p className='font-[400] text-sm tracking-[.25%] text-[#0F172A] opacity-[50%] leading-8'>Upload a document to start</p>
            </div>}
          <div className='w-full text-start space-y-2 '>
            <div>
              <Label className='text-start' htmlFor='context'>Name Of Context</Label>
              <Input type='text' placeholder='Name Should Be Unique' id='context' disabled={documentSet?.length !== 0} value={documentSet[0]?.doc_set_name || context.name} onChange={(e) => setContext({ ...context, name: e.target.value })} />
            </div>
            <div>
              <Label className='text-start' htmlFor='context'>Description</Label>
              <Input type='text' placeholder='write a short description' id='context' value={context.description} onChange={(e) => setContext({ ...context, description: e.target.value })} /></div>
          </div>

          {!files ?
            <>
              <div
                className={`w-full border flex justify-center items-center bg-[#EFF5F5] p-2 ${isDragActive ? 'opacity-50' : ''} shadow-md`}
                {...getRootProps()}
              >
                <Label htmlFor='upload-files' className='flex flex-col items-center justify-center' >
                  <Image src={uploadIcon} alt='upload' />
                  <div className='w-full text-center'>
                    <p className='font-[400] leading-6 text-[15px] opacity-[80%]'>Click to upload or drag and drop</p>
                    <p className='opacity-[50%] text-sm leading-6'>PDF & TXT</p>
                    <p className='opacity-[50%] text-sm leading-6'>Max Size 1MB</p>
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
              {userConnectors?.length > 0 && <div className='w-full text-sm leading-5 text-center space-y-2'>
                <p className='font-[500]'>OR</p>
                <Dialog className='fixed max-h-52 overflow-x-scroll no-scrollbar'>
                  <DialogTrigger asChild>
                    <p className='font-[600] p-2 border w-[70%] m-auto rounded-sm shadow-sm bg-[#EFF5F5] hover:cursor-pointer'>Select From Existing Files</p>
                  </DialogTrigger>
                  <DialogContent>
                    <h1 className='font-[600] text-sm leading-5 m-2'>Select Documents</h1>
                    <div className='flex gap-2 flex-wrap'>
                      {userConnectors?.map((connector) =>
                          <div className='space-x-2 p-1 border flex items-center rounded-sm hover:bg-slate-100 w-fit break-all' key={connector?.cc_pair_id}>
                            <input type="checkbox" value={connector?.cc_pair_id} id={connector?.cc_pair_id} className={`px-2 py-1 border rounded hover:cursor-pointer hover:bg-gray-100 `} onChange={(e) => handleDocSetID(e.target.value)} /><label htmlFor={connector?.cc_pair_id} >{connector?.name}</label></div>)
                      }
                    </div>
                    <DialogFooter className={cn('w-full')}>
                      <Button variant={'outline'} className={cn('bg-[#14B8A6] text-[#ffffff] m-auto')} onClick={()=> uploadDocSetFiles()}>Update</Button>
                    </DialogFooter>

                  </DialogContent>
                </Dialog>
              </div>}
            </>
            :
            <div className='w-full text-center space-y-4'>
              <div className='w-full border flex justify-center items-center h-20 bg-[#EFF5F5] rounded-md relative'>

                <p className='text-sm leading-6'>{files.name}-{(files.size / 1024).toFixed(2)}kb</p>
                <X size={'1rem'} className='self-start absolute top-1 right-1 hover:cursor-pointer' onClick={() => setFiles(false)} />
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