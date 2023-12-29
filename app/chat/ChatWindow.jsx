'use client'
import React, { useEffect, useState, useRef } from 'react'
import { Input } from '../../components/ui/input'
import sendIcon from '../../public/assets/send.svg'
import editIcon from '../../public/assets/edit-2.svg'
import Logo from "../../public/assets/Logo.svg"
import shareIcon from '../../public/assets/Navbar_Share.svg'
import openDocIcon from '../../public/assets/Navbar_OpenDoc.svg'
import xls from '../../public/assets/xls.svg'
import pdf from '../../public/assets/pdf.svg'
import doc from '../../public/assets/doc.svg'
import Image from 'next/image'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { useAtom } from 'jotai'
import { fileNameAtom, folderAtom, folderIdAtom, openMenuAtom, showAdvanceAtom } from '../store'
import ReactMarkdown from "react-markdown";

import { MoreHorizontal } from 'lucide-react';


const ChatWindow = () => {


    const [fileName, setFileName] = useAtom(fileNameAtom);
    const [userMsg, setUserMsg] = useState('');
    const [docName, setDocName] = useState('');
    const [showAdvance, setShowAdvance] = useAtom(showAdvanceAtom);
    const [folderId, setFolderId] = useAtom(folderIdAtom);
    const [folder, setFolder] = useAtom(folderAtom);
    const [rcvdMsg, setRcvdMsg] = useState('');
    const textareaRef = useRef(null);
    const [openMenu, setOpenMenu] = useAtom(openMenuAtom)
    const [chatMsgs, setChatMsgs] = useState(folder.filter(fol => fol.id === folderId));
    const currentFol = folder.filter(fol => fol.id === folderId);
    const [msgLoader, setMsgLoader] = useState(false);
    const [botMsg, setBotMsg] = useState('');
    const [chatMsg, setChatMsg] = useState([
        
    ]);

    function iconName(file) {
        if (file === 'pdf') {
            return pdf
        } else if (file === 'xls') {
            return xls
        } else {
            return doc
        }
    };

    async function sendMsg(data) {

        if (data === '') return null;

        if (rcvdMsg !== '') {

            setChatMsg((prev) => [{
                id: 'bot',
                message: rcvdMsg
            }, ...prev]);
            setMsgLoader(false);
            setRcvdMsg('')

        }
        setChatMsg((prev) => [{
            id: 'user',
            message: data
        }, ...prev]);


        setUserMsg('');

        setTimeout(() => {
            setMsgLoader(true)
        }, 1000);

        await handleMsgStream(data).then(() => {

            // console.log('rcvd', botMsg)

        });


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

    async function sendChatMsgs(userMsg) {
        try {
            const sendMessageResponse = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/chat/send-message`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "chat_session_id": 7,
                    "parent_message_id": null,
                    "message": userMsg,
                    "prompt_id": 0,
                    "search_doc_ids": null,
                    "retrieval_options": {
                        "run_search": "auto",
                        "real_time": true,
                        "filters": {
                            "source_type": null,
                            "document_set": null,
                            "time_cutoff": null
                        }
                    }
                })
            });
    
            if (!sendMessageResponse.ok) {
                const errorJson = await sendMessageResponse.json();
                const errorMsg = errorJson.message || errorJson.detail || "";
                throw new Error(`Failed to send message - ${errorMsg}`);
            }
    
            await handleStream(
                sendMessageResponse
            )
        } catch (error) {
            setMsgLoader(false)
        }
    };

    async function handleStream(streamingResponse) {
        const reader = streamingResponse.body?.getReader();
        const decoder = new TextDecoder("utf-8");

        let previousPartialChunk = null;
        while (true) {
            const rawChunk = await reader?.read();
            if (!rawChunk) {
                throw new Error("Unable to process chunk");
            }
            const { done, value } = rawChunk;
            if (done) {

                break;
            }

            const [completedChunks, partialChunk] = processRawChunkString(
                decoder.decode(value, { stream: true }),
                previousPartialChunk
            );
            if (!completedChunks.length && !partialChunk) {

                break;
            }
            previousPartialChunk = partialChunk;

            const response = await Promise.resolve(completedChunks);
            //   console.log(response)
            if (response.length > 0) {

                for (const obj of response) {
                    if (obj.answer_piece) {
                        setRcvdMsg(prev => prev + obj.answer_piece);
                    }
                }
            };

        }
    };

    const processRawChunkString = (rawChunkString, previousPartialChunk) => {
        if (!rawChunkString) {
            return [[], null];
        }

        const chunkSections = rawChunkString
            .split("\n")
            .filter((chunk) => chunk.length > 0);

        let parsedChunkSections = [];
        let currPartialChunk = previousPartialChunk;

        chunkSections.forEach((chunk) => {
            const [processedChunk, partialChunk] = processSingleChunk(
                chunk,
                currPartialChunk
            );

            if (processedChunk) {
                parsedChunkSections.push(processedChunk);
                currPartialChunk = null;
            } else {
                currPartialChunk = partialChunk;
            }
        });

        return [parsedChunkSections, currPartialChunk];
    };

    const processSingleChunk = (chunk, currPartialChunk) => {
        const completeChunk = (currPartialChunk || "") + chunk;

        try {
            // every complete chunk should be valid JSON
            const chunkJson = JSON.parse(completeChunk);
            return [chunkJson, null];
        } catch (err) {
            // if it's not valid JSON, then it's probably an incomplete chunk
            return [null, completeChunk];
        }
    };


    async function handleMsgStream(userMsg) {
        await sendChatMsgs(userMsg)

    };


    useEffect(() => {
        setBotMsg(prev => prev + rcvdMsg)
    }, [rcvdMsg])
    useEffect(() => {
        resizeTextarea();

    }, [userMsg]);

    useEffect(() => {
        setShowAdvance(false);
        setChatMsgs(currentFol);

    }, [folder])


    return (
        <div className='w-full flex flex-col rounded-[6px] gap-5 items-center no-scrollbar box-border h-screen pb-2'>
            <div className='w-full flex justify-between px-4 py-2'>
                <div className='flex gap-2 justify-center items-center hover:cursor-pointer'>
                    <Image src={Logo} alt='folder.chat'/>
                    {/* <p className='text-sm font-[500] leading-5'>{chatMsgs[0]?.files[0]?.name || 'New Doc 001'}</p>
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
                    </Dialog> */}
                </div>
                
                <div className='flex gap-4 '>
                    <div className='flex gap-2 justify-center items-center hover:cursor-pointer opacity-[60%] hover:opacity-100 text-[12px] font-[600] text-[#334155]'>
                        <Image src={shareIcon} alt='share' />
                        <p>Share</p>

                    </div>
                    <div className='flex gap-2 justify-center items-center hover:cursor-pointer text-[12px] font-[600] opacity-[60%] hover:opacity-100 text-[#334155]'>
                        <Image src={openDocIcon} alt='open' />
                        <p className=''>Open Document</p>

                    </div>
                </div>
            </div>
            <div className='w-[70%] h-[90%] rounded-[6px] flex flex-col justify-between box-border'  >
                {chatMsg.length == 0 ?
                    <div>
                        <p className='font-[600] text-[20px] tracking-[.25%] text-[#0F172A] opacity-[50%] leading-7'>The chat is empty</p>
                        <p className='font-[400] text-sm tracking-[.25%] text-[#0F172A] opacity-[50%] leading-8'>Ask your document a question using message panel ...</p>
                    </div> :
                    <div className='flex w-full flex-col-reverse gap-2 overflow-y-scroll no-scrollbar px-3' >
                        <hr className='w-full bg-transparent border-transparent' />

                        {msgLoader &&
                            <p className='font-[400] text-sm leading-6 self-start float-left border-2 max-w-[70%] bg-transparent py-2 px-4 rounded-lg text-justify rounded-tl-[0px]'>
                                {rcvdMsg === '' ? <MoreHorizontal className='m-auto animate-pulse' /> :
                                    <ReactMarkdown
                                        className='w-full'
                                        components={{
                                            a: ({ node, ...props }) => (
                                                <a
                                                    {...props}
                                                    className="text-blue-500 hover:text-blue-700"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                />
                                            ),
                                            pre: ({ node, ...props }) => (
                                                <div className="overflow-auto  max-w-[18rem] w-full text-white my-2 bg-[#121212] p-2 rounded-lg">
                                                    <pre {...props} />
                                                </div>
                                            ),
                                            code: ({ node, ...props }) => (
                                                <code className="bg-[#121212] text-white rounded-lg p-1 w-full" {...props} />
                                            ),
                                            ul: ({ node, ...props }) => (
                                                <ul className="md:pl-10 leading-8 list-disc" {...props} />
                                            ),
                                            ol: ({ node, ...props }) => (
                                                <ol className="md:pl-10 leading-8 list-decimal" {...props} />
                                            ),
                                            menu: ({ node, ...props }) => (
                                                <p className="md:pl-10 leading-8" {...props} />
                                            ),
                                        }}
                                    >
                                        {rcvdMsg.replaceAll("\\n", "\n")}
                                    </ReactMarkdown>}
                            </p>}

                        {chatMsg.map((msg, idx) => msg.id === 'user' ?
                            <p key={idx} className='font-[400] text-sm leading-6 self-end float-right  text-left max-w-[70%] min-w-[40%] bg-[#14B8A6] py-2 px-4 text-[#ffffff] rounded-[6px] rounded-tr-[0px]'>{msg.message}</p>
                            :
                            <p key={idx} className='font-[400] text-sm leading-6 self-start float-left border-2 max-w-[70%] bg-transparent py-2 px-4 rounded-lg text-justify rounded-tl-[0px]'>{
                                <ReactMarkdown
                                    className='w-full'
                                    components={{
                                        a: ({ node, ...props }) => (
                                            <a
                                                {...props}
                                                className="text-blue-500 hover:text-blue-700"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            />
                                        ),
                                        pre: ({ node, ...props }) => (
                                            <div className="overflow-auto  max-w-[18rem] w-full text-white my-2 bg-[#121212] p-2 rounded-lg">
                                                <pre {...props} />
                                            </div>
                                        ),
                                        code: ({ node, ...props }) => (
                                            <code className="bg-[#121212] text-white p-1 w-full" {...props} />
                                        ),
                                        ul: ({ node, ...props }) => (
                                            <ul className="md:pl-10 leading-8" {...props} />
                                        ),
                                        ol: ({ node, ...props }) => (
                                            <ol className="md:pl-10 leading-8" {...props} />
                                        ),
                                        menu: ({ node, ...props }) => (
                                            <p className="md:pl-10 leading-8" {...props} />
                                        ),
                                    }}
                                >
                                    {msg.message.replaceAll("\\n", "\n")}
                                </ReactMarkdown>
                            }</p>
                        )}

                    </div>
                }

                <div className="w-full flex justify-center sm:bg-transparent p-2 pt-0 bg-white" >
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