'use client'
import React, { useEffect, useState, useRef } from 'react'
import { Input } from '../../components/ui/input'
import sendIcon from '../../public/assets/send.svg'
import editIcon from '../../public/assets/edit-2.svg'
import shareIcon from '../../public/assets/Navbar_Share.svg'
import openDocIcon from '../../public/assets/Navbar_OpenDoc.svg'
import xls from '../../public/assets/xls.svg'
import pdf from '../../public/assets/pdf.svg'
import doc from '../../public/assets/doc.svg'
import Image from 'next/image'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { useAtom } from 'jotai'
import { fileNameAtom, folderAtom, folderIdAtom, openMenuAtom, showAdvanceAtom } from '../store'
import { ChevronRightCircle } from 'lucide-react'

const ChatWindow = () => {
    
    // const [chatMsg, setChatMsg] = useState([
    // {
    //     id: 'bot',
    //     message: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    // },
    // {
    //     id: 'user',
    //     message: 'cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    // },
    // {
    //     id: 'bot',
    //     message: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    // },
    // {
    //     id: 'user',
    //     message: 'cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    // },
    // {
    //     id: 'bot',
    //     message: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    // },
    // {
    //     id: 'user',
    //     message: 'cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    // }

    // ]);
    
    const [fileName, setFileName] = useAtom(fileNameAtom);
    const [userMsg, setUserMsg] = useState('');
    const [docName, setDocName] = useState('');
    const [showAdvance, setShowAdvance] = useAtom(showAdvanceAtom);
    const [folderId, setFolderId] = useAtom(folderIdAtom);
    const [folder, setFolder] = useAtom(folderAtom);

    const textareaRef = useRef(null);
    const [openMenu, setOpenMenu] = useAtom(openMenuAtom)
    const [chatMsgs, setChatMsgs] = useState(folder.filter(fol => fol.id === folderId));
    const currentFol = folder.filter(fol => fol.id === folderId);
    const [chatMsg, setChatMsg] = useState([
        {
            id: 'bot',
            message: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
            id: 'user',
            message: 'cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
            id: 'bot',
            message: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
            id: 'user',
            message: 'cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
            id: 'bot',
            message: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
            id: 'user',
            message: 'cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        }
    
        ]);

    function iconName(file){
        if(file === 'pdf'){
            return pdf
        }else if (file === 'xls'){
            return xls
        }else{
            return doc
        }
    }
    function sendMsg(data) {
        if (data === '') return null
        setChatMsg([
            {
                id: 'user',
                message: data
            },
            ...chatMsg
        ]);
        setUserMsg('')
    };

    const resizeTextarea = () => {
        const { current } = textareaRef;
        current.style.height = "auto";
        current.style.height = `${current.scrollHeight}px`;
    };

    function resize() {
        const { current } = textareaRef;
        current.style.minHeight = "35px";
    }

    useEffect(() => {
        resizeTextarea();
        
    }, [userMsg]);

    useEffect(() => {
        setShowAdvance(false);
        setChatMsgs(currentFol);
        
    }, [folder])


    return (
        <div className='w-full flex flex-col rounded-[6px] gap-5 items-center no-scrollbar box-border h-screen pb-16'>
            <div className='w-full flex justify-between px-4 py-2'>
                <div className='flex gap-2 justify-center items-center hover:cursor-pointer'>
                    <ChevronRightCircle size={30} className='sm:hidden' onClick={()=> setOpenMenu(true)}/>
                    <Image src={iconName(fileName.split('.')[1])} alt='edit' className='w-6 h-6'/>
                    <p className='text-sm font-[500] leading-5'>{chatMsgs[0]?.files[0]?.name || 'New Doc 001'}</p>
                    <Dialog onOpenChange={() => setDocName('')}>
                        <DialogTrigger asChild>
                            <Image src={editIcon} alt='edit' />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader className='mb-2'>
                                <DialogTitle>
                                    Update Document Name
                                </DialogTitle>
                            </DialogHeader>
                            <Input
                                type='text'
                                placeholder='document new name'
                                
                                value={docName}
                                onChange={(e) => { setDocName(e.target.value) }}
                                autoComplete='off'
                            />
                            <DialogFooter>
                                <Button variant={'outline'} className='bg-[#14B8A6] text-[#ffffff]'>Update</Button>
                            </DialogFooter>

                        </DialogContent>
                    </Dialog>
                </div>
                <div className='flex gap-4 '>
                    <div className='flex gap-2 justify-center items-center hover:cursor-pointer opacity-[60%] hover:opacity-100 text-[12px] font-[600] text-[#334155]'>
                        <Image src={shareIcon} alt='share'/>
                        <p>Share</p>

                    </div>
                    <div className='flex gap-2 justify-center items-center hover:cursor-pointer text-[12px] font-[600] opacity-[60%] hover:opacity-100 text-[#334155]'>
                        <Image src={openDocIcon} alt='open' />
                        <p className=''>Open Document</p>

                    </div>
                </div>
            </div>
            <div className='w-[70%] h-full rounded-[6px] flex flex-col justify-between box-border'  >
                {chatMsg.length == 0 ?
                    <div className='border'>
                        <p className='font-[600] text-[20px] tracking-[.25%] text-[#0F172A] opacity-[50%] leading-7'>The chat is empty</p>
                        <p className='font-[400] text-sm tracking-[.25%] text-[#0F172A] opacity-[50%] leading-8'>Ask your document a question using message panel ...</p>
                    </div> :
                    <div className='flex w-full flex-col-reverse gap-2 overflow-y-scroll no-scrollbar px-3' >
                        <hr className='w-full bg-transparent border-transparent' />
                        {chatMsg.map((msg, idx) => msg.id === 'user' ?
                            <p key={idx} className='font-[400] text-sm leading-6 self-end float-right  text-left max-w-[70%] min-w-[40%] bg-[#14B8A6] py-2 px-4 text-[#ffffff] rounded-[6px] rounded-tr-[0px]'>{msg.message}</p>
                            :
                            <p key={idx} className='font-[400] text-sm leading-6 self-start float-left border-2 max-w-[70%] bg-transparent py-2 px-4 rounded-lg text-justify rounded-tl-[0px]'>{msg.message}</p>
                        )}

                    </div>
                }

                <div className="w-full sm:flex justify-center sm:bg-transparent p-2 pt-0 bg-white" >
                    <div className="flex bg-[#F7F7F7] w-full justify-around rounded-xl border-2 border-transparent "
                        style={{ boxShadow: '0 0 2px 0 rgb(18, 18, 18, 0.5)' }}>

                        <textarea className="w-full bg-transparent outline-none self-center py-[10px] resize-none px-2 no-scrollbar max-h-[150px] min-h-[35px] "
                            id="textarea"
                            ref={textareaRef}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    sendMsg(userMsg)
                                    e.preventDefault();
                                    resizeTextarea();
                                    resize()
                                }
                            }}
                            autoFocus={false}
                            name="userInput"
                            placeholder={"Send a message..."}
                            rows={1}
                            value={userMsg}
                            onChange={(e) => {
                                setUserMsg(e.target.value);
                                resizeTextarea();
                            }} />

                        <span onClick={() => {
                            sendMsg(userMsg)
                            resize()
                        }}  >
                            <Image className="h-6 w-6  mr-2 my-[10px] hover:cursor-pointer" alt='send' src={sendIcon} />
                        </span>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatWindow