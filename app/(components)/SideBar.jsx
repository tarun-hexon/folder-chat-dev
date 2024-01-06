import React, { useEffect, useState } from 'react'
import { folderOptions } from '../../config/constants';
import Image from 'next/image';
import threeDot from '../../public/assets/more-horizontal.svg'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { Account, NewFolder } from '../chat/[chatid]/(dashboard)'
import { useAtom } from 'jotai';
import { folderAtom, fileNameAtom, openMenuAtom, showAdvanceAtom, folderIdAtom, sessionAtom, folderAddedAtom } from '../store';
import docIcon from '../../public/assets/doc.svg';
import xlsIcon from '../../public/assets/xls.svg';
import pdfIcon from '../../public/assets/pdf.svg';
import rightArrow from '../../public/assets/secondary icon.svg';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { X, ChevronRightCircle, MessageSquare } from 'lucide-react';

import { Advance } from './index'
import supabase from '../../config/supabse';
import { isUserExist } from '../../config/lib';
import { useRouter } from 'next/navigation';



const FolderCard = (props) => {

    const { name, id  } = props.fol
    const [folderFiles, setFlderFiles] = useState([])
    const[files, setFiles] = useState([])
    const [fileName, setFileName] = useAtom(fileNameAtom);
    const [folderId, setFolderId] = useAtom(folderIdAtom)
    const router = useRouter()
    const [popOpen, setPopOpen] = useState(false)

    function iconName(file){
        if(file === 'pdf'){
            return pdfIcon
        }else if (file === 'doc'){
            return docIcon
        }else{
            return xlsIcon
        }
    }

    async function getChatFiles(){
        try {
            const { data, error } = await supabase
                .from('chats')
                .select('*');
                if(data){
                    setFiles(data);
                    console.log(data)
                }else{
                    throw error
                }
        } catch (error) {
            console.log(error)
        }
      };

    function handleOptionsOnclick(id){
        id === 'new-chat' && router.push('/chat/new'); 
        setFolderId(id); 
        setPopOpen(false)
    }
    useEffect(()=> {
        console.log('i am calling');
        getChatFiles()
    }, []);
    return (

        <Accordion type="single" collapsible defaultValue='1'>
            <AccordionItem value="item-1" className='rounded-lg bg-[#ffffff] py-3 px-2 gap-2 flex flex-col' >
                <div className='w-full flex justify-between'>
                    <AccordionTrigger className='flex-row-reverse items-center gap-2 w-full ' onClick={()=> console.log(id)}>
                        <h2 className='text-sm leading-5 font-[600]'>{name}</h2>
                    </AccordionTrigger>
                    <Popover open={popOpen} onOpenChange={setPopOpen}>
                        <PopoverTrigger asChild>
                            <Image src={threeDot} alt={'options'} className='w-4 h-4 hover:cursor-pointer' />
                        </PopoverTrigger>
                        <PopoverContent className="w-full flex flex-col p-1 gap-[2px]">
                            {folderOptions.map((option, idx) => {
                                return (
                                    <div key={option.id} className="inline-flex p-2 items-center font-[400] text-sm leading-5 hover:bg-[#F1F5F9] rounded-md hover:cursor-pointer" onClick={() => { handleOptionsOnclick(option.id) }}>
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
                            <div className='flex justify-between bg-[#EFF5F5] hover:cursor-pointer hover:bg-slate-200 p-2 rounded-lg' onClick={()=> {setFileName('chat'); setFolderId(id)}}>
                                <span className='text-sm font-[500] leading-5 '>New Chat</span>
                                
                            </div>
                            :
                            files.map((data, idx) => {
                                return (
                                    <div key={data.id} className='flex justify-between items-center h-fit bg-[#EFF5F5] rounded-lg p-2 hover:cursor-pointer' onClick={() => router.push('/chat/'+data.session_id)}>
                                        <div className='inline-flex gap-1 items-center'>
                                            <MessageSquare className='w-4 h-4 hover:cursor-pointer' />
                                            <span className='font-[500] text-sm leading-5'>{data.chat_title}</span>
                                        </div>
                                        <Image src={threeDot} alt={'options'} className='w-4 h-4 hover:cursor-pointer' />
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

    async function getFolders(){
        try {
            
            const wkID = await isUserExist('workspaces', 'id', 'created_by', session.user.id);
            let { data: folders, error } = await supabase
                .from('folders')
                .select('*')
                .eq('workspace_id', wkID[0].id);
                if(folders){
                    const lastFolder = folders[folders.length-1];
                    localStorage.setItem('lastFolderId', lastFolder.id)
                    setFolder([...folders]);
                    return
                };
                throw error
        } catch (error) {
            console.log(error)
        }
    };


    useEffect(()=> {
        getFolders();
    }, [folderAdded]);


    return (
        <div className='w-full bg-[#EFF5F5] flex flex-col py-[19px] px-[18px] gap-4 font-Inter relative h-full'>
            
            <div className='w-full overflow-x-scroll no-scrollbar px-2'>
            <Account />
            </div>

            {!showAdvance ? 
            <div className='w-full flex justify-between items-center bg-[#DEEAEA] p-3 rounded-md hover:cursor-pointer' onClick={ ()=> setShowAdvance(true) }>
                <div className='flex items-center gap-2'>
                    
                    <h1 className='font-[600] text-sm leading-5'>Advance</h1>
                </div>
                <Image src={rightArrow} alt='open' />
            </div> 
            :
            <div className='w-full h-fit bg-[#14B8A6] text-[#FFFFFF] rounded-lg shadow-md'>
                <Advance />
            </div>}
            <h1 className='w-full text-sm font-[400] text-white bg-[#14B8A6] border-[#14B8A6] leading-[24px] flex items-center justify-between p-2 px-4 rounded-md hover:bg-[#DEEAEA] hover:text-black hover:cursor-pointer' onClick={()=> setFileName('chat')}>New Chat</h1>
            {folder.length > 0 && <div className='flex flex-col gap-2'>
                {folder.map((fol, idx) => {
                    return (
                        <FolderCard key={idx} fol={fol} />
                    )
                })}
            </div>}
            <div>
                <NewFolder setFolderAdded={setFolderAdded} openMenu={false}/>
            </div>


        </div>

    )
}

export default SideBar