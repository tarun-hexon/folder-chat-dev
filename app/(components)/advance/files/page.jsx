'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { Button } from '../../../../components/ui/button';
import fileIcon from '../../../../public/assets/Danswer-doc-B.svg';
import check from '../../../../public/assets/check-circle.svg';
import trash from '../../../../public/assets/trash-2.svg';
import { useDropzone } from 'react-dropzone';
import { Label } from '../../../../components/ui/label';
import { deleteConnectorFromTable, fetchAllConnector, getSess } from '../../../../lib/helpers';
import { useAtom } from 'jotai';
import { sessionAtom, userConnectorsAtom } from '../../../store';
import supabase from '../../../../config/supabse';
import { Loader } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "../../../../components/ui/table";

const Files = () => {

    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true)
    const [userConnectors, setUserConnectors] = useAtom(userConnectorsAtom);
    const [session, setSession] = useAtom(sessionAtom);
    const [existConnector ,setExistConnector] = useState([]);
    const [uploading, setUploading] = useState(false);

    async function uploadFile(file, name) {
        
        setUploading(true)
        try {
            const formData = new FormData();
            formData.append('files', file);
           
            const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/connector/file/upload`, {
                method: "POST",
                body: formData
            });
            const json = await data.json();
            
            // setFilePath(json.file_paths[0]);
            connectorRequest(json.file_paths[0], name, file)
        } catch (error) {
            console.log(error)
            setUploading(false)
        }
    };

    async function connectorRequest(path, name, file) {
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
            if(existConnector?.length === 0){
                await insertDataInConn([json?.id])
            }else{
                await updatetDataInConn(existConnector, json?.id)
            }
            // setConnectorId(json.id)
            // console.log(json.id)
            getCredentials(json?.id, name, file)
        } catch (error) {
            console.log('error while connectorRequest :', error)
            setUploading(false)
        }
    };

    async function insertDataInConn(newData){
               
        const { data, error } = await supabase
        .from('connectors')
        .insert(
          { 'connect_id': newData, 'user_id' : session.user.id },
        )
        .select()
        // console.log(data)
        // console.log(error)
        setExistConnector(data[0]?.connect_id);
        
        setUploading(false)
    };

    async function updatetDataInConn(exConn, newData){
        
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

    async function getCredentials(connectID, name, file) {
        try {
            const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/credential`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    
                },
                body: JSON.stringify({
                    "credential_json": {},
                    "admin_public": false
                })
            });
            const json = await data.json();
            // setCredentialID(json.id);
            sendURL(connectID, json.id, name, file)
        } catch (error) {
            console.log('error while getCredentials:', error);
            setUploading(false)
        }
    };

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            
            const fileType = file.name.split('.')[1]
            if(fileType !== 'pdf' && fileType !== 'txt'){
                toast({
                    variant:'destructive',
                    title: "This File type is not supported!"
                });
                return null
            }
            // setFileName(file.name)
            uploadFile(file, file.name);
        } else {
            // console.error('Invalid file. Please upload a PDF, DOC, or XLS file.');
        }
    };

    async function runOnce(conID, credID){
        try {
            const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/connector/run-once`,{
            method:'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                "connector_id": conID,
                "credentialIds": [
                    credID
                ]
            })
        })
        } catch (error) {
            console.log('error in runOnce :', error);
            setUploading(false);
        }
    };

    async function sendURL(connectID, credID, name, file){
        try {
            const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/connector/${connectID}/credential/${credID}`, {
            method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    
                },
                body: JSON.stringify({'name':name})
            });
            const json = await data.json();
            setLoading(true)
            await runOnce(connectID, credID);
            // await getAllExistingConnector();
           
        } catch (error) {
            console.log('error while sendURL:', error);
            
            setUploading(false)
        }
    };

    // async function getAllExistingConnector() {
    //     try {
    //         const data = await fetchAllConnector();

    //         //calling api bcoz soetimes local state is not updating
    //         //const allConID = await readData();

    //         const currentConnector = data.filter((item)=> { if(allConID?.includes(item?.id)) return item });

    //         const filData = currentConnector.filter((item)=> item.source === 'file');

    //         if(filData.length > 0){
    //             setFiles(filData)
    //         };
    //         setLoading(false)
            
    //     } catch (error) {
    //         console.log(error)
    //         setLoading(false)
    //     }
    // };

    // async function readData(){
    //     try {
    //         // const id = await getSess();
    //         const { data, error } = await supabase
    //         .from('connectors')
    //         .select('connect_id')
    //         .eq('user_id', session?.user?.id);
    //         if(error){
    //             throw error
    //         }else{
                
    //             if(data.length > 0){
    //                 setExistConnector(data[0]?.connect_id)
    //                 return data[0]?.connect_id
    //             }else{
    //                 setExistConnector([])
    //                 return []
    //             }
    //         }
            
    //     } catch (error) {
    //         setExistConnector([])
    //         console.log(error)
    //     }
    // };

    async function deleteConnector(id1, id2){
        return null
        try {
            const body = {
                "connector_id": id1,
    		    "credential_id": id2
            };
            const res = await deleteConnectorFromTable(body)
        } catch (error) {
            console.log(error)
        }
    };


    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });


    useEffect(()=> {
        // getAllExistingConnector();

        if(userConnectors !== null ){
            const filData = userConnectors?.filter((item)=> item?.connector?.source === 'file');
            if(filData.length > 0){
                setFiles(filData);
                const conn_ids = filData?.map(conn => {return conn?.connector?.id});
                
                setExistConnector(conn_ids)
            };
            setLoading(false)
        }
        
    }, [userConnectors]);

   
    return (
        <div className='w-full sticky top-0 self-start h-screen flex flex-col rounded-[6px] gap-5 items-center  box-border text-[#64748B] '>
             <div className='w-[80%] rounded-[6px] flex flex-col box-border space-y-2 gap-2 overflow-scroll no-scrollbar h-full px-4 py-10'>
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

                        {!uploading ? 
                            <div className={`w-full bg-slate-100 shadow-md border rounded-lg flex flex-col justify-center items-center p-5 gap-4 ${isDragActive && 'opacity-50'}`} {...getRootProps()}>
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
                            :
                            <div className={`w-full bg-slate-100 shadow-md border rounded-lg flex flex-col justify-center items-center p-8 gap-4 `}>
                                <Loader className='animate-spin' />
                            </div>
                        }

                    </div>
                </div>
                <Table className='w-full text-sm'>
                    <TableHeader className='p-2 '>
                        <TableRow className='border-b p-2 hover:bg-transparent'>
                            <TableHead className="w-96 text-left p-2">File Name</TableHead>
                            <TableHead className='text-center'>Status</TableHead>
                            {/* <TableHead className="text-center">Remove</TableHead> */}
                        </TableRow>
                    </TableHeader>    
                    <TableBody>
                    {loading && <div className='w-full text-start p-2'>Loading...</div>}
                        {files.map((item, idx) => {
                            // console.log(item)
                            return (
                                <TableRow className='border-b hover:cursor-pointer' key={idx}>
                                    <TableCell className="font-medium w-96 text-left p-2 py-3 text-ellipsis break-all text-emphasis overflow-hidden">{item?.name}</TableCell>
                                    <TableCell>
                                        <div className='flex justify-center items-center gap-1 text-[#22C55E]'>
                                            <Image src={check} alt='checked' className='w-4 h-4' />Enabled
                                        </div>
                                    </TableCell>
                                    {/* <TableCell><Image src={trash} alt='remove' className='m-auto hover:cursor-pointer'/></TableCell> */}
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>

        </div>
    )
}

export default Files