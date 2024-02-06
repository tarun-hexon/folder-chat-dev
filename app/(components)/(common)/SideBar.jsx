'use client'
import React, { useEffect, useState } from 'react'
import { folderOptions, docsOptions } from '../../../config/constants';
import Image from 'next/image';
import threeDot from '../../../public/assets/more-horizontal.svg'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion";
import { Account, NewFolder } from '../(dashboard)'
import { useAtom } from 'jotai';
import { folderAtom, showAdvanceAtom, chatTitleAtom, chatSessionIDAtom, folderIdAtom, sessionAtom, folderAddedAtom, chatHistoryAtom, tempAtom } from '../../store';
import rightArrow from '../../../public/assets/secondary icon.svg';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import { Pencil, Trash2, Check, X, MessageSquare, LogOut } from 'lucide-react';
import { AdvanceMenu } from './index'
import supabase from '../../../config/supabse';
import { isUserExist } from '../../../config/lib';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '../../../components/ui/input';
import fileIcon from '../../../public/assets/Danswer-doc-B.svg';
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../../../components/ui/alert-dialog'
import { Label } from '../../../components/ui/label';
import { cn } from '../../../lib/utils';
import Link from 'next/link';
import { sidebarOptions } from '../../../config/constants';
import { Setting } from '../(settings)'
import { logout } from '../../../lib/user';

const FolderCard = ({ fol }) => {
    // console.log(fol)
    const { name, id } = fol
    const [chatHistory, setChatHistory] = useAtom(chatHistoryAtom)
    const [files, setFiles] = useState([])
    const [chatTitle, setChatTitle] = useAtom(chatTitleAtom);

    const [folderAdded, setFolderAdded] = useAtom(folderAddedAtom);
    const [popOpen, setPopOpen] = useState(false)
    const [isRenamingChat, setIsRenamingChat] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [chatSessionID, setChatSessionID] = useAtom(chatSessionIDAtom)
    const [folderId, setFolderId] = useAtom(folderIdAtom);
    const [inputChatName, setInputChatName] = useState('');
    const [folNewName, setFolNewName] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [documentSet, setDocumentSet] = useState([]);
    const [temp, setTemp] = useAtom(tempAtom)

    // const [documentSet, setDocumentSet] = useAtom(documentSetAtom);

    const router = useRouter();

    const current_url = window.location.href;

    const chat_id = current_url.split("/chat/")[1];

    async function getChatFiles() {
        // let ID = id === undefined ? props.fol[0].id : id
        try {
            const { data, error } = await supabase
                .from('chats')
                .select('*')
                .eq('folder_id', fol.id);
            if (data) {
                setFiles(data);

            } else {
                throw error
            }
        } catch (error) {
            console.log(error)
        }
    };


    function handleOptionsOnclick(id, fol_id) {


        if (id === 'new-chat') {

            localStorage.removeItem('chatSessionID')
            localStorage.removeItem('lastFolderId')
            setChatSessionID('new')
            setFolderId(fol_id);
            router.push('/chat/new')

        } else if (id === 'upload') {
            setFolderId(fol_id)
            router.push('/chat/upload')
        }

        setPopOpen(false)
    };


    async function deleteFolder(fol_id) {
        for (let i = 0; i < files?.length; i++) {
            await deleteChatsBySessionId(files[i]?.session_id)
        }

        if (documentSet[0]?.doc_set_id) {
            await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/document-set/${documentSet[0]?.doc_set_id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }
        await supabase
            .from('document_set')
            .delete()
            .eq('folder_id', fol_id);

        const { error } = await supabase
            .from('folders')
            .delete()
            .eq('id', fol_id)

        if (!error) {

            setFolderAdded(!folderAdded)
            setPopOpen(false)
        }

    };

    function handleFilessOnclick(data) {

        setChatSessionID(data.session_id)
        setFolderId(data.folder_id)
    };


    async function updateTitle(value, id, originalTitle) {
        if (value === originalTitle) {
            setIsRenamingChat(false)
            return null
        }
        try {

            const { data, error } = await supabase
                .from('chats')
                .update({ 'chat_title': value })
                .eq('session_id', id)
                .select()
            // console.log(data)
            if (data.length > 0) {
                setIsRenamingChat(false)
                setChatHistory(data[0]);
                setChatRename(!chatTitle)

            } else if (error) {
                throw error
            }
        } catch (error) {
            console.log(error)
        }
    };

    async function deleteChatsBySessionId(id) {
        await deleteChatsFromServer(id);
        const { error } = await supabase
            .from('chats')
            .delete()
            .eq('session_id', id)
        if (!error) {
            await getChatFiles();
            router.push('/chat/new')
        }

    };

    async function deleteChatsFromServer(chat_session_id) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/chat/delete-chat-session/${chat_session_id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json"
                },
            })
        } catch (error) {
            console.log(error)
        }
    };

    async function updateFolderName(name, id) {

        const { data, error } = await supabase
            .from('folders')
            .update({ name: name })
            .eq('id', id)
            .select()
        setFolderAdded(!folderAdded)
        setDialogOpen(false);
        setPopOpen(false);
    };

    async function deleteDocSetFile(ccID, fol_id) {
        // console.log(ccID, fol_id)

        const allPairIds = [...documentSet[0]?.cc_pair_id]
        const allNames = [...documentSet[0]?.files_name]
        const idxOfID = documentSet[0]?.cc_pair_id.indexOf(ccID);
        // const idxOfName = documentSet[0]?.files_name.indexOf(c_name);

        allPairIds.splice(idxOfID, 1)
        allNames.splice(idxOfID, 1)

        // console.log(allPairIds)

        // console.log(allNames)
        // return null


        if (allPairIds?.length > 0) {

            const { data, error } = await supabase
                .from('document_set')
                .update({ 'cc_pair_id': allPairIds, "files_name": allNames })
                .eq('folder_id', fol_id)
                .select()

            if (data.length > 0) {
                setDocumentSet(data)
            } else {
                setDocumentSet([])
            };

            await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/document-set`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "id": documentSet[0]?.doc_set_id,
                    "description": '',
                    "cc_pair_ids": allPairIds
                })
            })

        } else if (allPairIds?.length === 0) {

            const { data, error } = await supabase
                .from('document_set')
                .delete()
                .eq('folder_id', fol_id);

            setDocumentSet([])

            await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/document-set/${documentSet[0]?.doc_set_id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            router.push('/chat')
        }


    }

    async function getDocSetDetails() {
        if (!fol.id) {
            return null
        }
        let { data: document_set, error } = await supabase
            .from('document_set')
            .select("*")
            .eq('folder_id', fol.id)

        if (document_set?.length > 0) {
            setDocumentSet(document_set)

        } else {
            setDocumentSet([])

        }

    }

    useEffect(() => {
        getChatFiles();
        getDocSetDetails();

    }, [chatHistory, chatTitle, id]);


    useEffect(() => {

        getDocSetDetails()
    }, [chat_id, temp])

    useEffect(() => {
        setIsSelected(chat_id);
        if (chat_id !== 'new' && chat_id) {
            //getFolderId(chat_id);
        }
    }, [chat_id]);

    return (

        <Accordion type="single" collapsible defaultValue={folderId}>
            <AccordionItem value={id} className='rounded-lg bg-[#ffffff] py-3 px-2 gap-2 flex flex-col' >
                <div className='w-full flex justify-between'>
                    <AccordionTrigger className='flex-row-reverse items-center gap-2 w-full'>
                        <h2 className='text-sm leading-5 font-[600]'>{name}</h2>
                    </AccordionTrigger>
                    <Popover open={popOpen} onOpenChange={setPopOpen}>
                        <PopoverTrigger asChild>
                            <Image src={threeDot} alt={'options'} className='w-4 h-4 hover:cursor-pointer' />
                        </PopoverTrigger>
                        <PopoverContent className="w-full flex flex-col p-1 gap-[2px]">
                            {folderOptions.map((option, idx) => {
                                return (
                                    option.id !== 'delete' ?
                                        option.id !== 'edit' ?
                                            <div key={option.id} className="inline-flex p-2 items-center font-[400] text-sm leading-5 hover:bg-[#F1F5F9] rounded-md hover:cursor-pointer" onClick={() => { handleOptionsOnclick(option.id, id) }}>
                                                <option.icon className="mr-2 h-4 w-4" />
                                                <span>{option.title}</span>
                                            </div> :
                                            <Dialog key={option.id} open={dialogOpen} onOpenChange={setDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <div key={option.id} className="inline-flex p-2 items-center font-[400] text-sm leading-5 hover:bg-[#F1F5F9] rounded-md hover:cursor-pointer" onClick={() => { setFolNewName(name); setDialogOpen(true); }}>
                                                        <option.icon className="mr-2 h-4 w-4" />
                                                        <span>{option.title}</span>
                                                    </div>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader className='mb-2'>
                                                        <DialogTitle>
                                                            Update Name
                                                        </DialogTitle>
                                                    </DialogHeader>
                                                    <Label htmlFor='doc-name'>New Name</Label>
                                                    <Input
                                                        id='doc-name'
                                                        type='text'
                                                        placeholder='new name'
                                                        value={folNewName}
                                                        autoComplete='off'
                                                        className='text-black'
                                                        onChange={(e) => setFolNewName(e.target.value)}
                                                    />


                                                    <DialogFooter className={cn('w-full')}>
                                                        <Button variant={'outline'} className={cn('bg-[#14B8A6] text-[#ffffff] m-auto')} onClick={() => updateFolderName(folNewName, id)}>Update</Button>
                                                    </DialogFooter>

                                                </DialogContent>
                                            </Dialog>

                                        :
                                        <AlertDialog key={option.id}>
                                            <AlertDialogTrigger asChild>
                                                <div className="inline-flex p-2 items-center font-[400] text-sm leading-5 hover:bg-[#F1F5F9] rounded-md hover:cursor-pointer" >
                                                    <option.icon className="mr-2 h-4 w-4" />
                                                    <span>{option.title}</span>
                                                </div>
                                            </AlertDialogTrigger>

                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Are you sure?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction className='bg-[#14B8A6] hover:bg-[#14B8A6] hover:opacity-75' onClick={() => deleteFolder(id)}>Continue</AlertDialogAction>
                                                </AlertDialogFooter>

                                            </AlertDialogContent>
                                        </AlertDialog>
                                )
                            })}
                        </PopoverContent>
                    </Popover>
                </div>
                <AccordionContent className='flex flex-col gap-2 p-1'>
                    {
                        files?.length === 0 ?
                            <Link href={'/chat/new'} className='flex justify-between bg-[#EFF5F5] hover:cursor-pointer hover:bg-slate-200 p-2 rounded-lg' onClick={() => { setFolderId(id) }}>
                                <span className='text-sm font-[500] leading-5 '>Create First Chat</span>

                            </Link>
                            :
                            files?.map((data, idx) => {

                                return (
                                    <Link href={`/chat/${data?.session_id}`} key={data?.id} className={`flex justify-between items-center h-fit rounded-lg p-2 hover:cursor-pointer hover:bg-slate-100 ${chat_id === data.session_id ? 'bg-slate-200' : ''}`} onClick={() => handleFilessOnclick(data)}>
                                        <div className='inline-flex gap-1 items-center'>
                                            <div>
                                                <MessageSquare color='#14B8A6' size={'1rem'} className='hover:cursor-pointer' />
                                            </div>
                                            <span className={`w-full font-[500] text-sm leading-5 text-ellipsis break-all line-clamp-1 mr-3 text-emphasis ${isRenamingChat && chat_id === data.session_id ? 'hidden' : ''} `} >{data?.chat_title || 'New Chat'}</span>
                                            {isRenamingChat ?
                                                chat_id === data.session_id && <input type='text' value={inputChatName} onChange={(e) => setInputChatName(e.target.value)} className='rounded-md px-1 w-[90%]' />
                                                : null
                                            }
                                        </div>
                                        {chat_id === data.session_id &&
                                            (isRenamingChat ? (
                                                <div className="ml-auto my-auto flex">
                                                    <div
                                                        onClick={() => updateTitle(inputChatName, data.session_id, data?.chat_title)}
                                                        className={`hover:bg-black/10 p-1 -m-1 rounded`}
                                                    >
                                                        <Check size={16} />
                                                    </div>
                                                    <div
                                                        onClick={() => {
                                                            // setChatName(data?.chat_title);
                                                            setIsRenamingChat(false);
                                                        }}
                                                        className={`hover:bg-black/10 p-1 -m-1 rounded ml-2`}
                                                    >
                                                        <X size={16} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="ml-auto my-auto flex">
                                                    <div
                                                        title='Edit Name'
                                                        onClick={() => { setInputChatName(data?.chat_title); setIsRenamingChat(true) }}
                                                        className={`hover:bg-black/10 p-1 -m-1 rounded`}
                                                    >
                                                        <Pencil size={16} />
                                                    </div>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <div
                                                                title='Delete Chat File'
                                                                className={`hover:bg-black/10 p-1 -m-1 rounded ml-2`}
                                                            >
                                                                <Trash2 size={16} />
                                                            </div>
                                                        </AlertDialogTrigger>

                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Are you sure?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction className='bg-[#14B8A6] hover:bg-[#14B8A6] hover:opacity-75' onClick={() => deleteChatsBySessionId(data.session_id)}>Continue</AlertDialogAction>
                                                            </AlertDialogFooter>

                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            ))}
                                    </Link>
                                )
                            })
                    }
                    {
                        documentSet[0]?.files_name?.map((data, idx) => {

                            return (

                                <div key={data} className={`flex justify-between items-center h-fit rounded-lg p-2 hover:cursor-pointer hover:bg-slate-100`}>
                                    <div className='inline-flex gap-1 items-center'>
                                        <Image src={fileIcon} alt='file' />
                                        <span className={`font-[500] text-sm leading-5 text-ellipsis break-all line-clamp-1 mr-3 text-emphasis`} >{data}</span>

                                    </div>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Image src={threeDot} alt={'options'} className='w-4 h-4 hover:cursor-pointer' />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full flex flex-col p-1 gap-[2px]">
                                            {docsOptions?.map((option, idx) => {
                                                return (

                                                    <AlertDialog key={option.id}>
                                                        <AlertDialogTrigger asChild>
                                                            <div className="inline-flex p-2 items-center font-[400] text-sm leading-5 hover:bg-[#F1F5F9] rounded-md hover:cursor-pointer" >
                                                                <option.icon className="mr-2 h-4 w-4" />
                                                                <span>{option.title}</span>
                                                            </div>
                                                        </AlertDialogTrigger>

                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Are you sure?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction className='bg-[#14B8A6] hover:bg-[#14B8A6] hover:opacity-75' onClick={() => deleteDocSetFile(data, documentSet[0]?.folder_id)}>Continue</AlertDialogAction>
                                                            </AlertDialogFooter>

                                                        </AlertDialogContent>
                                                    </AlertDialog>

                                                )
                                            })}
                                        </PopoverContent>
                                    </Popover>

                                </div>
                            )
                        })
                    }
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

const SideBar = () => {
    const [folder, setFolder] = useAtom(folderAtom);
    const [showAdvance, setShowAdvance] = useAtom(showAdvanceAtom);
    const [open, setOpen] = useState(false);
    const [item, setItem] = useState('profile')
    const [session, setSession] = useAtom(sessionAtom);
    const [folderAdded, setFolderAdded] = useAtom(folderAddedAtom);
    const [folderId, setFolderId] = useAtom(folderIdAtom);
    const [workSpaces, setWorkSpaces] = useState([])
    const router = useRouter()
    const param = useParams()

    // async function getFolders() {
    //     try {
    //         const wkID = await isUserExist('workspaces', 'id', 'created_by', session?.user?.id);
    //         let { data: folders, error } = await supabase
    //             .from('folders')
    //             .select('*')
    //             .eq('workspace_id', wkID[0]?.id);
    //         if (folders.length > 0) {

    //             const lastFolder = folders[folders.length - 1];
    //             // if (folder?.length === 0) {
    //             //     setFolderId(lastFolder?.id)
    //             // }
    //             setFolderId(lastFolder?.id)
    //             if (!folderId && !localStorage.getItem('chatSessionID')) {
    //                 localStorage.setItem('lastFolderId', lastFolder?.id)
    //             }
    //             // console.log(folders)
    //             setFolder(folders);
    //             return null
    //         } else {
    //             setFolderId(null)
    //             setFolder([])
    //             localStorage.removeItem('lastFolderId')
    //         }
    //         if (error) {
    //             throw error
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // };

    async function getWorkSpace(){
        const res = await fetch('/api/workspace/list-workspace');
        if(res.ok){
            const json = await res.json()
            setWorkSpaces(json.data)
        }else{
            setWorkSpaces([])
        }
    }
    async function getFolders(){
        
        const res = await fetch(`/api/workspace/list-folder?workspace_id=${param.workspaceid}`);
        if(res.ok){
            const json = await res.json()
            
            if(json.data.length > 0){
                console.log(json?.data)
                setFolder(json?.data)
            }else{
                setFolder([])
            }
        }else{
            setFolder([])
        }
    }

    useEffect(() => {
        getFolders()
        
    }, [folderAdded, param.workspaceid]);
    useEffect(()=> {
        getWorkSpace()
    }, [])

    return (
        <div className='w-full bg-[#EFF5F5] flex flex-col py-[19px] px-[18px] gap-4 font-Inter relative min-h-screen'>

            <Account/>

            <div className='flex flex-col gap-2 w-full p-2'>
                <div className='flex flex-col gap-2 w-full'>

                    {sidebarOptions.map(option => {
                        return (
                            option.id !== 'settings' ?
                                <div key={option.id} className='inline-flex gap-2 hover:cursor-pointer hover:bg-[#d9dada] w-full p-2 rounded-md' onClick={() => { setItem(option.id); setOpen(true); }}>
                                    <Image src={option.icon} alt={option.title} />
                                    <span className='text-sm leading-5 font-[500]'>{option.title}</span>
                                </div>
                                :
                                <Dialog open={open} onOpenChange={() => { setOpen(!open); setItem(option.id) }} key={option.id}>

                                    <DialogTrigger asChild className='self-start'>

                                        <div key={option.title} className='inline-flex gap-2 hover:cursor-pointer hover:bg-[#d9dada] w-full p-2 rounded-md' >
                                            <Image src={option.icon} alt={option.title} />
                                            <span className='text-sm leading-5 font-[500]'>{option.title}</span>
                                        </div>

                                    </DialogTrigger>
                                    <Setting item={item} setItem={setItem} />
                                </Dialog>
                        )
                    })}
                </div>
                <div className='flex items-center gap-2 hover:cursor-pointer hover:bg-[#d9dada] w-full p-2 rounded-md' onClick={async () => {
                    const res = await logout();
                    if (res.ok) {
                        router.push('/auth/login')
                    }
                }}>
                    <LogOut className='w-4 h-4' color='#14B8A6' /><span className='font-[500] leading-5 text-sm hover:cursor-pointer'>Log Out</span>
                    {/* <Image src={threeDot} alt={'options'} className='w-4 h-4 hover:cursor-pointer' /> */}
                </div>
            </div>

            {!showAdvance ?
                <Link href={'/advance'} className='w-full flex justify-between items-center bg-[#DEEAEA] p-3 rounded-md hover:cursor-pointer' onClick={() => { setShowAdvance(!showAdvance) }}>
                    <h1 className='font-[600] text-sm leading-5'>Advanced</h1>
                    <Image src={rightArrow} alt='open' />
                </Link>
                :
                <div className='w-full h-fit bg-[#14B8A6] text-[#FFFFFF] rounded-lg shadow-md'>
                    <AdvanceMenu />
                </div>}


            {folder?.length > 0 && <div className='flex flex-col gap-2'>
                {folder?.map((fol, idx) => {
                    return (
                        <FolderCard key={idx} fol={fol} />
                    )
                })}
            </div>}
            <div>
                <NewFolder setFolderAdded={setFolderAdded} openMenu={false} />
            </div>


        </div>

    )
}

export default SideBar