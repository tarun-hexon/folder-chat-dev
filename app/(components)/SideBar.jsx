import React, { useEffect, useState } from 'react'
import { folderOptions } from '../../config/constants';
import Image from 'next/image';
import threeDot from '../../public/assets/more-horizontal.svg'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { Account, NewFolder } from './(dashboard)'
import { useAtom } from 'jotai';
import { folderAtom, fileNameAtom, openMenuAtom, showAdvanceAtom, chatTitleAtom, folderIdAtom, sessionAtom, folderAddedAtom, chatHistoryAtom } from '../store';
import rightArrow from '../../public/assets/secondary icon.svg';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Pencil, Trash2, Check, X, MessageSquare, Loader2 } from 'lucide-react';
import { Advance } from './index'
import supabase from '../../config/supabse';
import { isUserExist } from '../../config/lib';
import { useRouter } from 'next/navigation';
import { Input } from '../../components/ui/input';



const FolderCard = (props) => {

    const { name, id } = props.fol
    const [chatHistory, setChatHistory] = useAtom(chatHistoryAtom)
    const [files, setFiles] = useState([])
    const [fileName, setFileName] = useAtom(fileNameAtom);
    const [folderId, setFolderId] = useState('')
    const router = useRouter()
    const [popOpen, setPopOpen] = useState(false)
    const [isRenamingChat, setIsRenamingChat] = useState(false);
    const [isSelected, setIsSelected] = useState(true);
    const [chatName, setChatName] = useState('')

    const current_url = window.location.href;
    const chat_id = current_url.split("/chat/")[1];

    async function getChatFiles() {
        try {
            const { data, error } = await supabase
                .from('chats')
                .select('*')
                .eq('folder_id', id);
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
        
        if(id === 'new-chat'){
            localStorage.setItem('folderId', fol_id);
            setFolderId(fol_id);
            setFileName('chat')
            router.push('/chat/new')
        }else if(id === 'upload'){
            setFileName('upload')
        }
        
        setPopOpen(false)
    };

    async function getFolderId(chatid){
        try {
            const { data, error } = await supabase
                .from('chats')
                .select('folder_id')
                .eq('session_id', chatid);
            if(data){
                localStorage.setItem('folderId', data[0].folder_id)
                setFolderId(data[0].folder_id)
                
            }else{
                throw error
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    useEffect(() => {
        getChatFiles();
        
    }, [chatHistory, chatTitleAtom]);

    useEffect(() => {
        setIsSelected(chat_id);
        if(chat_id !== 'new'){
            getFolderId(chat_id);
        }
    }, [chat_id]);

    // useEffect(() => {
        
    //     if(chat_id !== 'new'){
    //         getFolderId(chat_id);
    //     }
    // }, [folderId]);
    return (

        <Accordion type="single" collapsible defaultValue={localStorage.getItem('folderId')}>
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
                                    <div key={option.id} className="inline-flex p-2 items-center font-[400] text-sm leading-5 hover:bg-[#F1F5F9] rounded-md hover:cursor-pointer" onClick={() => { handleOptionsOnclick(option.id, id) }}>
                                        <option.icon className="mr-2 h-4 w-4" />
                                        <span>{option.title}</span>
                                    </div>
                                )
                            })}

                        </PopoverContent>
                    </Popover>

                </div>
                <AccordionContent className='flex flex-col gap-2 p-1'>
                    {
                        files.length === 0 ?
                            <div className='flex justify-between bg-[#EFF5F5] hover:cursor-pointer hover:bg-slate-200 p-2 rounded-lg' onClick={() => { setFileName('chat')}}>
                                <span className='text-sm font-[500] leading-5 '>No Chats to display</span>

                            </div>
                            :
                            files.map((data, idx) => {
                                return (
                                    <div key={data.id} className={`flex justify-between items-center h-fit rounded-lg p-2 hover:cursor-pointer ${chat_id === data.session_id ? 'bg-slate-200':''}`} onClick={() => {router.push('/chat/' + data.session_id); localStorage.setItem('folderId', data.folder_id); setFileName('chat')}}>
                                        <div className='inline-flex gap-1 items-center'>
                                            {/* <MessageSquare size={'1rem'} className='hover:cursor-pointer' /> */}
                                            <span className='font-[500] text-sm leading-5 text-ellipsis break-all line-clamp-1 mr-3 text-emphasis' onClick={()=> setFileName('chat')}>{data?.chat_title || 'New Chat'}</span> 
                                            {/* {isRenamingChat ? 
                                                <input type='text' value={chatName} onChange={(e)=> setChatName(e.target.value)} className='rounded-md px-1 w-[90%]'/>
                                                :
                                                   
                                        } */}
                                        </div>
                                        {/* {chat_id === data.session_id &&
                                            (isRenamingChat ? (
                                                <div className="ml-auto my-auto flex">
                                                    <div
                                                        // onClick={onRename}
                                                        className={`hover:bg-black/10 p-1 -m-1 rounded`}
                                                    >
                                                        <Check size={16} />
                                                    </div>
                                                    <div
                                                        onClick={() => {
                                                            // setChatName(chatSession.name);
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
                                                        onClick={() => setIsRenamingChat(true)}
                                                        className={`hover:bg-black/10 p-1 -m-1 rounded`}
                                                    >
                                                        <Pencil size={16} />
                                                    </div>
                                                    <div
                                                        onClick={() => setIsDeletionModalVisible(true)}
                                                        className={`hover:bg-black/10 p-1 -m-1 rounded ml-2`}
                                                    >
                                                        <Trash2 size={16} />
                                                    </div>
                                                </div>
                                            ))} */}
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
    const [openMenu, setOpenMenu] = useAtom(openMenuAtom)
    const [folder, setFolder] = useAtom(folderAtom);
    const [showAdvance, setShowAdvance] = useAtom(showAdvanceAtom);
    const [fileName, setFileName] = useAtom(fileNameAtom);
    const [session, setSession] = useAtom(sessionAtom);
    const [folderAdded, setFolderAdded] = useAtom(folderAddedAtom);

    async function getFolders(ses) {
        try {

            const wkID = await isUserExist('workspaces', 'id', 'created_by', ses.user.id);
            let { data: folders, error } = await supabase
                .from('folders')
                .select('*')
                .eq('workspace_id', wkID[0].id);
            if (folders) {
                const lastFolder = folders[folders.length - 1];
                localStorage.setItem('lastFolderId', lastFolder.id)
                setFolder([...folders]);
                return
            };
            throw error
        } catch (error) {
            console.log(error)
        }
    };


    useEffect(() => {
        getFolders(session)
    }, [folderAdded]);

    return (
        <div className='w-full bg-[#EFF5F5] flex flex-col py-[19px] px-[18px] gap-4 font-Inter relative h-full'>

            <div className='w-full overflow-x-scroll no-scrollbar px-2'>
                <Account />
            </div>

            {!showAdvance ?
                <div className='w-full flex justify-between items-center bg-[#DEEAEA] p-3 rounded-md hover:cursor-pointer' onClick={() => setShowAdvance(true)}>
                    <div className='flex items-center gap-2'>

                        <h1 className='font-[600] text-sm leading-5'>Advance</h1>
                    </div>
                    <Image src={rightArrow} alt='open' />
                </div>
                :
                <div className='w-full h-fit bg-[#14B8A6] text-[#FFFFFF] rounded-lg shadow-md'>
                    <Advance />
                </div>}
            {/* <h1 className='w-full text-sm font-[400] text-white bg-[#14B8A6] border-[#14B8A6] leading-[24px] flex items-center justify-between p-2 px-4 rounded-md hover:bg-[#DEEAEA] hover:text-black hover:cursor-pointer' onClick={() => setFileName('chat')}>New Chat</h1> */}
            {folder.length > 0 && <div className='flex flex-col gap-2'>
                {folder.map((fol, idx) => {
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