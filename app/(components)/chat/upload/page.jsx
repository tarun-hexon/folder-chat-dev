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
import { Loader, Loader2, XCircle } from 'lucide-react';

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
    c_name: '',
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
    if (documentSet?.length === 0 && context.name === '') {
      return toast({
        variant: 'destructive',
        title: "Give your context a name first!"
      });
    } else if (documentSet[0]?.doc_set_name === '' && context.name === '') {
      return toast({
        variant: 'destructive',
        title: "Give your context a name first!"
      });
    };
    if (context.c_name === '') {
      return toast({
        variant: 'destructive',
        title: "Write a valid name for files identification!"
      });
    }
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

      files?.forEach((file) => {
        formData.append("files", file);
      });

      // console.log(formData)
      const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/connector/file/upload`, {
        method: "POST",
        body: formData
      });
      const json = await data.json();
      // console.log('upload done', json)
      // setFilePath(json.file_paths[0]);
      connectorRequest(json.file_paths)
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

      if (existConnector?.length === 0) {
        await insertDataInConTable([json?.id])
      } else {
        await updatetDataInConTable(existConnector, json?.id)
      }

      getCredentials(json?.id)
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
      sendURL(connectID, json?.id)
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
        body: JSON.stringify({ 'name': context.c_name })
      });
      const json = await data?.json();

      await runOnce(connectID, credID);
      setCurrentDoc(json.data);
      setTimeout(async () => {
        if (documentSet.length === 0) {
          await setDocumentSetInServer(connectID, context.name, context);
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

    const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/connector/indexing-status`);
    const json = await data.json();

    const docSetid = []
    for (const pair_id of json) {
      if (pair_id?.connector?.id === ccID) {
        docSetid.push(pair_id?.cc_pair_id);
      }
    };
    console.log(docSetid)
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

        await insertDataInDB(docSetid, `${set_name}-${session?.user?.email.split('@')[0]}`, id, context.c_name)
        setContext({ name: '', c_name: '', description: '' })
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

    const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/connector/indexing-status`);
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

      await updateDataInDB(docSetid, context.c_name)
      setContext({ name: '', description: '', c_name: '' })
    } catch (error) {
      console.log(error)
    }
  }

  async function setDocumentSetInServer2(ccID, set_name, des) {

    let newArr = []

    for (let i = 0; i < ccID?.length; i++) {
      if (newArr.indexOf(ccID[i]) < 0) {
        newArr.push(ccID[i])
      }
    };

    // console.log(newArr);
    // console.log(ccID);

    // return null

    // const docSetid = []
    // for (const pair_id of json) {
    //   if (pair_id?.connector?.id === ccID) {
    //     docSetid.push(pair_id?.cc_pair_id);
    //   }
    // };
    console.log(newArr)
    // if (docSetid.length === 0) {
    //   return null
    // }
    if (newArr.length === 0) {
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
          "cc_pair_ids": newArr
        })
      });

      const id = await res.json();

      if (id) {

        await insertDataInDB(newArr, `${set_name}-${session?.user?.email.split('@')[0]}`, id, context.c_name)
        setContext({ name: '', c_name: '', description: '' })
        setD_open(false)
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

  async function updateDocumentSetInServer2(db_id, ccID, des) {

    let newArr = documentSet[0]?.cc_pair_id

    for (let i = 0; i < ccID?.length; i++) {
      if (newArr.indexOf(ccID[i]) < 0) {
        newArr.push(ccID[i])
      }
    };

    console.log(newArr);
    // return null

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/document-set`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "id": db_id,
          "description": des,
          "cc_pair_ids": newArr
        })
      });

      await updateDataInDB(newArr, context.c_name);
      setContext({ name: '', description: '', c_name: '' })
      setD_open(false)
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
          'c_name': c_name
        },
      )
      .select()
    // console.log(data)
    // console.log(error)
    if (data?.length > 0) {
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

  async function updateDataInDB(newData, name) {
    
        // Combine existing data with new data
        const newData1 = [...documentSet[0].c_name, name] ;

        // Update the record with the combined data
        const { data: updatedData, error: updateError } = await supabase
          .from('document_set')
          .update({'cc_pair_id': newData, 'c_name':newData1})
          .eq('folder_id', folderId)
          .select();

        if (updateError) {
          console.error('Error updating record:', updateError.message);
        } else {
          setDocumentSet(updatedData);
          //await indexingStatus(folderId)
          toast({
            variant: 'default',
            title: "File Uploaded!"
          });
          router.push('/chat/new')
          setUploading(false)
          console.log('Record updated successfully:', updatedData);
        }
    
    // let names = []

    // if (documentSet[0]?.c_name?.length > 0) {
    //   names = [...documentSet[0]?.c_name, name]
    // } else {
    //   names = [name]
    // }

    // const { data, error } = await supabase
    //   .from('document_set')
    //   .update(
    //     { 'cc_pair_id': newData, 'c_name': names },
    //   )
    //   .eq('folder_id', folderId)
    //   .select()

    // if (data?.length) {
    //   setDocumentSet(data);
    //   //await indexingStatus(folderId)
    //   toast({
    //     variant: 'default',
    //     title: "File Uploaded!"
    //   });
    //   router.push('/chat/new')
    //   setUploading(false)
    // }
  };

  async function insertDataInConTable(newData) {

    const { data, error } = await supabase
      .from('connectors')
      .insert(
        { 'connect_id': newData, 'user_id': session?.user?.id, 'folder_id': folderId },
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
    if (selectedDoc?.includes(parseInt(id))) {
      // const idx = selectedDoc.indexOf(id);
      setSelectedDoc(selectedDoc?.filter(doc => doc !== parseInt(id)))
    } else {
      setSelectedDoc((prev) => [...prev, parseInt(id)])

    }
    console.log(selectedDoc)

  }

  async function uploadDocSetFiles() {
    if (selectedDoc?.length === 0) {
      return toast({
        variant: 'destructive',
        title: "Please Select Atleast One File!"
      });
    };
    // console.log(selectedDoc);
    // return null
    if (documentSet?.length === 0) {
      await setDocumentSetInServer2(selectedDoc, context.name, context.description);
    } else {
      await updateDocumentSetInServer2(documentSet[0]?.doc_set_id, selectedDoc, context.description)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {

    if (folder === null || folder?.length === 0) {
      router.push('/chat/new')
    } else {
      setLoading(false)
    }

  }, [folder]);


  useEffect(() => {

    if (userConnectors !== null) {
      const filData = userConnectors?.filter((item) => item?.connector?.source === 'file');
      if (filData?.length > 0) {
        const conn_ids = userConnectors?.map(conn => { return conn?.connector?.id });
        setExistConnector(conn_ids);
      };
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
          {documentSet?.length === 0 ?
            <div className='w-full text-start space-y-2 '>
              <div>
                <Label className='text-start' htmlFor='context'>Name</Label>
                <Input type='text' placeholder='Write a name to identify your files' id='context' value={context.c_name} onChange={(e) => setContext({ ...context, 'c_name': e.target.value })} />
              </div>
              <div>
                <Label className='text-start' htmlFor='context'>Name of Context</Label>
                <Input type='text' placeholder='Name Should Be Unique' id='context' value={context.name} onChange={(e) => setContext({ ...context, 'name': e.target.value })} />
              </div>

              <div>
                <Label className='text-start' htmlFor='context'>Description</Label>
                <Input type='text' placeholder='write a short description' id='context' value={context?.description} onChange={(e) => setContext({ ...context, description: e.target.value })} />
              </div>
            </div> :
            <div className='w-full text-start space-y-2 mb-2'>

              <Label className='text-start' htmlFor='context'>Name</Label>
              <Input type='text' placeholder='Write a name to identify your files' id='context' value={context.c_name} onChange={(e) => setContext({ ...context, 'c_name': e.target.value })} />

            </div>
          }

          {files.length === 0 ?
            <>
              <div
                className={`w-full border rounded-md flex flex-col justify-center items-center bg-[#EFF5F5] py-5 ${isDragActive ? 'opacity-50' : ''} shadow-md`}
                {...getRootProps()}
              >
                <input {...getInputProps()} multiple accept=".pdf, .zip, .txt, .md, .mdx" required />

                <Image src={uploadIcon} alt='upload' />
                <div className='w-full text-center'>
                  <p className='font-[400] leading-6 text-[15px] opacity-[80%]'>Click to upload or drag and drop</p>
                  <p className='opacity-[50%] text-sm leading-6'>PDF & TXT</p>
                  <p className='opacity-[50%] text-sm leading-6'>Max Size 1MB</p>
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
                <Dialog open={d_open} onOpenChange={() => { setSelectedDoc(documentSet[0]?.cc_pair_id?.length > 0 ? documentSet[0]?.cc_pair_id : []); setD_open(!d_open) }} className='fixed max-h-52 overflow-x-scroll no-scrollbar' >
                  <DialogTrigger asChild>
                    <p className='font-[600] p-2 border w-[70%] m-auto rounded-sm shadow-sm bg-[#EFF5F5] hover:cursor-pointer' onClick={() => setD_open(true)}>Select From Existing Files</p>
                  </DialogTrigger>
                  <DialogContent>
                    <h1 className='font-[600] text-sm leading-5 m-2'>Select Documents</h1>
                    <div className='flex gap-2 flex-wrap'>
                      {userConnectors?.map((connector) =>
                        <div className='space-x-2 p-1 border flex items-center rounded-sm hover:bg-slate-100 w-fit break-all' key={connector?.cc_pair_id}>
                          <input type="checkbox" value={connector?.cc_pair_id} checked={selectedDoc?.includes(connector?.cc_pair_id)} id={connector?.cc_pair_id} className={`px-2 py-1 border rounded hover:cursor-pointer hover:bg-gray-100 `} onChange={(e) => handleDocSetID(e.target.value)} /><label htmlFor={connector?.cc_pair_id} >{connector?.name}</label></div>)
                      }
                    </div>
                    <DialogFooter className={cn('w-full')}>
                      <Button variant={'outline'} className={cn('bg-[#14B8A6] text-[#ffffff] m-auto')} onClick={() => uploadDocSetFiles()}>Update</Button>
                    </DialogFooter>

                  </DialogContent>
                </Dialog>
              </div>}
            </>
            :
            <div className='w-full text-center space-y-4'>
              <div className='w-full border flex justify-center items-center h-20 bg-[#EFF5F5] rounded-md relative'>

                {files?.map(file => <p key={file?.name} className='text-sm leading-6'>{file?.name}</p>)}
                <XCircle size={'1rem'} className='self-start absolute top-1 right-1 hover:cursor-pointer' onClick={() => setFiles([])} />
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