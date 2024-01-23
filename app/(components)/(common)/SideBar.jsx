'use client'
import React, { useEffect, useState } from 'react'
import { folderOptions, docsOptions } from '../../../config/constants';
import Image from 'next/image';
import threeDot from '../../../public/assets/more-horizontal.svg'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion";
import { Account, NewFolder } from '../(dashboard)'
import { useAtom } from 'jotai';
import { folderAtom, documentSetAtom, showAdvanceAtom, chatTitleAtom, chatSessionIDAtom, folderIdAtom, sessionAtom, folderAddedAtom, chatHistoryAtom, userConnectorsAtom } from '../../store';
import rightArrow from '../../../public/assets/secondary icon.svg';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import { Pencil, Trash2, Check, X, MessageSquare, Loader2 } from 'lucide-react';
import { AdvanceMenu } from './index'
import supabase from '../../../config/supabse';
import { isUserExist } from '../../../config/lib';
import { useRouter } from 'next/navigation';
import { Input } from '../../../components/ui/input';
import { getSess } from '../../../lib/helpers';
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../../../components/ui/alert-dialog'
import { Label } from '../../../components/ui/label';
import { cn } from '../../../lib/utils';
import Link from 'next/link';


const FolderCard = ({ fol, doc, folder }) => {
    // console.log(fol)
    const { name, id } = fol
    const [chatHistory, setChatHistory] = useAtom(chatHistoryAtom)
    const [files, setFiles] = useState([])
    const [chatTitle, setChatTitle] = useAtom(chatTitleAtom);
    const router = useRouter();
    const [folderAdded, setFolderAdded] = useAtom(folderAddedAtom);
    const [popOpen, setPopOpen] = useState(false)
    const [isRenamingChat, setIsRenamingChat] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [chatSessionID, setChatSessionID] = useAtom(chatSessionIDAtom)
    const [folderId, setFolderId] = useAtom(folderIdAtom);
    const [inputChatName, setInputChatName] = useState('');
    const [folNewName, setFolNewName] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [documentSet, setDocumentSet] = useAtom(documentSetAtom);
    const [docSet, setDocSet] = useState([]);
    const [dataById, setDataById] = useState([])
    const [userConnectors, setUserConnectors] = useAtom(userConnectorsAtom)
    
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
        await supabase
            .from('connectors')
            .delete()
            .eq('folder_id', fol_id);

        await supabase
            .from('document_set')
            .delete()
            .eq('folder_id', fol_id);

        if (documentSet[0]?.doc_set_id) {
            await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/document-set/${documentSet[0]?.doc_set_id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        const { error } = await supabase
            .from('folders')
            .delete()
            .eq('id', fol_id);
        if (!error) {
            setFolderAdded(!folderAdded)
            setPopOpen(false)
        }

    };


    function handleFilessOnclick(data) {
        setChatSessionID(data.session_id)
        setFolderId(data.folder_id)
    };

    //will delete this function
    async function getFolderId(chatid) {
        try {
            const { data, error } = await supabase
                .from('chats')
                .select('folder_id')
                .eq('session_id', chatid);
            if (data) {
                // localStorage.setItem('folderId', data[0]?.folder_id)
            } else {
                throw error
            }
        } catch (error) {
            console.log(error)
        }
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

    async function deleteDocSedFile(docName) {
        
        const allPairIds = docSet[0]?.cc_pair_id
        const allNames = docSet[0]?.c_name
        const currentID = userConnectors.filter(conn => conn?.name === docName);
        const idxOfID = allPairIds.indexOf(currentID[0]?.cc_pair_id);
        const idxOfName = allPairIds.indexOf(currentID[0]?.cc_pair_id);

        allPairIds.splice(idxOfID, 1)
        allNames.splice(idxOfName, 1)
        // console.log(allPairIds)
        // console.log(currentID)
        // console.log(idxOfID)
        // console.log(idxOfName, allNames)
        const { data, error } = await supabase
            .from('document_set')
            .update({ 'cc_pair_id': allPairIds, "c_name": allNames })
            .eq('folder_id', fol.id)
            .select()

            if(data.length > 0){
                setDocSet(data)
            }


    }

    
    async function getDocSet(fol) {
        // let ID = id === undefined ? props.fol[0].id : id
        try {
            const { data, error } = await supabase
                .from('document_set')
                .select('*')
                .eq('folder_id', fol);
            if (data) {
                // console.log(data)
                // setDocSet(data)
                setDataById(prevData => ({...prevData, [fol]: data[0]?.c_name }));
                // console.log(dataById)
                // return data[0]?.c_name

            } else {
                throw error
            }
        } catch (error) {
            console.log(error)
        }
    };

    async function allIds(){
        for(const ele of folder){
            await getDocSet(ele?.id)
        }
    }

    useEffect(() => {
        getChatFiles();
        // getDocSet()

    }, [chatHistory, chatTitle, id]);


    // useEffect(()=> {
    //     allIds()
    // }, [fol])

    useEffect(() => {
        setIsSelected(chat_id);
        if (chat_id !== 'new' && chat_id) {
            //getFolderId(chat_id);
        }
    }, [chat_id]);

    // useEffect(() => {
    //     console.log(chatSessionID)
    // }, [chatSessionID]);
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
                                    <Link href={`/chat/${data.session_id}`} key={data.id} className={`flex justify-between items-center h-fit rounded-lg p-2 hover:cursor-pointer hover:bg-slate-100 ${chat_id === data.session_id ? 'bg-slate-200' : ''}`} onClick={() => handleFilessOnclick(data)}>
                                        <div className='inline-flex gap-1 items-center'>
                                            {/* <MessageSquare size={'1rem'} className='hover:cursor-pointer' /> */}
                                            <span className={`font-[500] text-sm leading-5 text-ellipsis break-all line-clamp-1 mr-3 text-emphasis ${isRenamingChat && chat_id === data.session_id ? 'hidden' : ''} `} >{data?.chat_title || 'New Chat'}</span>
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
                    {/* {
                        doc?.map((data, idx) => {
                                
                            return (

                                <div key={idx} className={`flex justify-between items-center h-fit rounded-lg p-2 hover:cursor-pointer hover:bg-slate-100`}>
                                    <div className='inline-flex gap-1 items-center'>
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
                                                                    Are you absolutely sure?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. This will delete all chat files inside this folder.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction className='bg-[#14B8A6] hover:bg-[#14B8A6] hover:opacity-75' onClick={() => deleteDocSedFile(data)}>Continue</AlertDialogAction>
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
                    } */}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

const SideBar = () => {
    const [folder, setFolder] = useAtom(folderAtom);
    const [showAdvance, setShowAdvance] = useAtom(showAdvanceAtom);

    const [session, setSession] = useAtom(sessionAtom);
    const [folderAdded, setFolderAdded] = useAtom(folderAddedAtom);
    const [folderId, setFolderId] = useAtom(folderIdAtom);
    const current_url = window.location.href;
    const chat_id = current_url.split("advance");
    const router = useRouter();

    async function getFolders() {
        try {

            const wkID = await isUserExist('workspaces', 'id', 'created_by', session?.user?.id);
            let { data: folders, error } = await supabase
                .from('folders')
                .select('*')
                .eq('workspace_id', wkID[0]?.id);
            if (folders.length > 0) {

                const lastFolder = folders[folders.length - 1];
                // if (folder?.length === 0) {
                //     setFolderId(lastFolder?.id)
                // }
                setFolderId(lastFolder?.id)
                if (!folderId && !localStorage.getItem('chatSessionID')) {
                    localStorage.setItem('lastFolderId', lastFolder?.id)
                }
                // console.log(folders)
                setFolder(folders);
                return
            } else {
                setFolder([])
                localStorage.removeItem('lastFolderId')
            }
            if (error) {
                throw error
            }
        } catch (error) {
            console.log(error)
        }
    };


    


    useEffect(() => {
        getFolders()
    }, [folderAdded]);


    return (
        <div className='w-full bg-[#EFF5F5] flex flex-col py-[19px] px-[18px] gap-4 font-Inter relative min-h-screen'>

            <div className='w-full overflow-x-scroll no-scrollbar px-2'>
                <Account />
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
                        <FolderCard key={idx} fol={fol} folder={folder}/>
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