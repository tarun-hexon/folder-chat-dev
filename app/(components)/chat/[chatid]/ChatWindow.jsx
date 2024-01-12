'use client'
import React, { useEffect, useState, useRef } from 'react'
import sendIcon from '../../../../public/assets/send.svg'
import Logo from "../../../../public/assets/Logo.svg"
import editIcon from "../../../../public/assets/edit-2.svg"
import shareIcon from '../../../../public/assets/Navbar_Share.svg'
import openDocIcon from '../../../../public/assets/Navbar_OpenDoc.svg'
import Image from 'next/image'
import { iconSelector } from '../../../../config/constants'
import { Folder, Loader2, Plus, MoreHorizontal } from 'lucide-react';
import { useAtom } from 'jotai'
import { chatHistoryAtom, chatTitleAtom, fileNameAtom, chatSessionIDAtom, folderAddedAtom, folderAtom, folderIdAtom, sessionAtom, showAdvanceAtom, documentSetAtom, existConnectorDetailsAtom, allConnectorsAtom } from '../../../store'
import ReactMarkdown from "react-markdown";
import supabase from '../../../../config/supabse'
import { useToast } from '../../../../components/ui/use-toast'
import { NewFolder } from '../../(dashboard)'
import { useRouter } from 'next/navigation'
import { fetchCCPairId, getSess } from '../../../../lib/helpers'
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../../components/ui/dialog'
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { Label } from '../../../../components/ui/label'
import { cn } from '../../../../lib/utils'
import plus from '../../../../public/assets/plus.svg'
import { usePathname } from 'next/navigation'




const ChatWindow = () => {


    const [session, setSession] = useAtom(sessionAtom);
    const [allConnectors, setAllConnectors] = useAtom(allConnectorsAtom);
    const [loading, setLoading] = useState(true)
    const [userMsg, setUserMsg] = useState('');
    const [chatHistory, setChatHistory] = useAtom(chatHistoryAtom);
    const [showAdvance, setShowAdvance] = useAtom(showAdvanceAtom);
    const [folderId, setFolderId] = useAtom(folderIdAtom);
    const [folder, setFolder] = useAtom(folderAtom);
    const [folderAdded, setFolderAdded] = useAtom(folderAddedAtom);
    const [open, setOpen] = useState(false)
    const [rcvdMsg, setRcvdMsg] = useState('');
    const textareaRef = useRef(null);
    const [responseObj, setResponseObj] = useState(null)
    const [msgLoader, setMsgLoader] = useState(false);

    const [chatMsg, setChatMsg] = useState([]);
    const [parentMessageId, setParentMessageId] = useState(null);
    const [chatTitle, setChatTitle] = useState('')
    const [chatRenamed, setChatRename] = useAtom(chatTitleAtom);
    const [fileName, setFileName] = useAtom(fileNameAtom);
    const [textFieldDisabled, setTextFieldDisabled] = useState(false);
    const [chatSessionID, setChatSessionID] = useAtom(chatSessionIDAtom);
    const [existConnectorDetails, setExistConnectorDetails] = useAtom(existConnectorDetailsAtom);
    const [documentSet, setDocumentSet] = useAtom(documentSetAtom);
    const [inputDocDes, setInputDocDes] = useState('');
    
    const ccIDS = useRef([]);
    const newDocSet = new Set();

    const botResponse = useRef('');

    const current_url = window.location.href;
    const pathname = usePathname()

    const chat_id = current_url.split("/chat/")[1];

    const router = useRouter();
    const { toast } = useToast();

    async function createChatSessionId(userMsgdata) {
        setRcvdMsg('')
        botResponse.current = ''
        try {
            const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/chat/create-chat-session`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "persona_id": 0
                })
            });
            const json = await data.json();
            localStorage.setItem('chatSessionID', json?.chat_session_id)
            setChatSessionID(json?.chat_session_id)
            // router.push(`/chat/${json.chat_session_id}`, undefined, {shallow: true});
            window.history.replaceState('', '', `/chat/${json.chat_session_id}`);

            await insertChatInDB(null, json?.chat_session_id, folderId);

            await sendChatMsgs(userMsgdata, json.chat_session_id, parentMessageId);
            await createChatTitle(json.chat_session_id, null, userMsgdata)
        } catch (error) {
            
            console.log('error while creating chat id:', error)
        }
    }
    async function sendMsg(data) {

        if (data && data.trim() === '') return null;

        setTextFieldDisabled(true);
        setResponseObj(null)
        if (rcvdMsg !== '') {


            setRcvdMsg('')

            setMsgLoader(false);

            setResponseObj(null)

        }
        setChatMsg((prev) => [{

            user: data
        }, ...prev]);


        setUserMsg('');

        setTimeout(() => {
            setMsgLoader(true)
        }, 1000);

        if (chatSessionID === 'new') {
            await createChatSessionId(data)
        } else {

            await sendChatMsgs(data, chatSessionID, parentMessageId)
        }

    };

    async function createChatTitle(session_id, name, userMessage) {
        // console.log(session_id, name, userMessage)
        try {
            const data = await fetch('https://danswer.folder.chat/api/chat/rename-chat-session', {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "chat_session_id": session_id,
                    "name": name || null,
                    "first_message": userMessage
                })
            });
            const json = await data.json();
            // console.log(json.new_name);
            await updateTitle(json.new_name, session_id)
            setChatTitle(json.new_name)
        } catch (error) {
            console.log(error)
        }
    }
    async function insertChatInDB(chatTitle, chatID, folderID) {
        
        try {
            const id = await getSess();
            const { data, error } = await supabase
                .from('chats')
                .insert({
                    folder_id: folderID,
                    user_id: id,
                    chats: null,
                    chat_title: chatTitle,
                    is_active: true,
                    session_id: chatID,
                    sharable: false
                });
            if (error) {
                throw error
            }

        } catch (error) {
            console.log(error)
        }
    };
    async function updateTitle(value, id) {
        
        try {
            
            const { data, error } = await supabase
                .from('chats')
                .update({ 'chat_title': value })
                .eq('session_id', id)
                .select()
            if (data.length) {
                setChatHistory(data[0]);
                setChatRename(!chatTitleAtom)
            } else if (error) {
                throw error
            }
        } catch (error) {
            console.log(error)
        }
    };


    async function updateChats(bot, user, oldChat, msgID) {
        var newMsg = [bot, user, ...oldChat]

        try {

            const { data, error } = await supabase
                .from('chats')
                .update({ 'chats': JSON.stringify(newMsg), 'message_id':msgID })
                .eq('session_id', localStorage.getItem('chatSessionID'))
                .select()
            if (data.length) {
                
                if (data[0].chats) {
                    setParentMessageId(data[0]?.message_id)
                    const msgs = JSON.parse(data[0]?.chats)

                    setChatMsg(msgs);
                }
                setChatHistory(data[0])
            } else if (error) {
                throw error
            }
        } catch (error) {
            console.log(error)
        }
    };

    const resizeTextarea = () => {
        if (folder.length) {
            const { current } = textareaRef;
            current.style.height = "auto";
            current.style.height = `${current.scrollHeight}px`;
        } else {
            return
        }
    };

    function resize() {
        const { current } = textareaRef;
        current.style.minHeight = "35px";
    };

    async function sendChatMsgs(userMsg, chatID, parent_ID) {
        
        try {
            const sendMessageResponse = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/chat/send-message`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "chat_session_id": chatID,
                    "parent_message_id": parent_ID,
                    "message": userMsg,
                    "prompt_id": 0,
                    "search_doc_ids": null,
                    "retrieval_options": {
                        "run_search": "auto",
                        "real_time": true,
                        "filters": {
                            "source_type": null,
                            "document_set": documentSet.length === 0 ? null : [documentSet[0]?.doc_set_name],
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
                sendMessageResponse, userMsg
            );
            setTextFieldDisabled(false)

        } catch (error) {
            console.log(error)
            setMsgLoader(false)
            setTextFieldDisabled(false)
        }
    };

    async function handleStream(streamingResponse, userMsg) {
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

            if (response.length > 0) {

                for (const obj of response) {
                    if (obj.answer_piece) {

                        botResponse.current += obj.answer_piece;

                        setRcvdMsg(prev => prev + obj.answer_piece);

                    } else if (obj.parent_message) {

                        setResponseObj(obj);
                        console.log(obj)

                        await updateChats({ 'bot': botResponse.current }, { 'user': userMsg }, chatMsg, obj.message_id)
                        botResponse.current = ''
                        setMsgLoader(false)
                    }else if (obj.error) {
                        setMsgLoader(false);
                        return toast({
                            variant: 'destructive',
                            description: 'Something Went Wrong!'
                        })
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

    async function getChatHistory(id) {
        try {
            console.log(id)
            const { data, error } = await supabase
                .from('chats')
                .select('*')
                .eq('session_id', id);
                // console.log(data, 'data')
            if (data[0]?.chats) {
                // console.log(data)
                if(folderId === ''){
                    setFolderId(data[0].folder_id)
                }
                // console.log(data[0].folder_id, '400')

                const ccPairs = await isDocSetExist(data[0]?.folder_id)
                // console.log(isTrue)
                if(ccPairs.length > 0){
                    
                    const msgs = JSON.parse(data[0]?.chats)
                    setChatMsg(msgs);
                    setChatHistory(data[0])
                    setChatTitle(data[0].chat_title);
                }                
            }
            else if(data.length === 0){
                
                setChatMsg([]);
                // window.history.replaceState('', '', `/chat/new`);
                // throw new Error('Chat session ID is Invalid')
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    };
    
    async function updateDocumentSet(ccID, des){
        const db_connectors = [...documentSet[0].cc_pair_id, ...ccID]
        if(!documentSet[0]?.doc_set_id){
          return null
        }
        
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/document-set`, {
            method:'PATCH',
            headers: {
              "Content-Type": "application/json",
            },
            body:JSON.stringify({
              "id": documentSet[0]?.doc_set_id,
              "description": des,
              "cc_pair_ids": db_connectors
            })
          });
          
          await updateDataInDB(ccID)
          setInputDocDes('')
          if(res === null){
            return toast({
                variant: 'default',
                title: "Document Update!"
              });
          }
        } catch (error) {
          console.log(error)
        }
    }

    async function updateDataInDB(ccID){
        const db_connectors = [...documentSet[0].cc_pair_id, ...ccID]
        
        const fol_id = folderId || localStorage.getItem('folderId')
        
        const { data, error } = await supabase
        .from('document_set')
        .update(
          { 'cc_pair_id': db_connectors},
        )
        .eq('folder_id', fol_id)
        .select()

        if(data?.length){
            setDocumentSet(data)
        }
    };
    function handleDocSet(id) {
        
        if(newDocSet.has(id)){
            newDocSet.delete(id)
        }else{
            newDocSet.add(id)
        }
        ccIDS.current = ([...newDocSet])
        console.log([...newDocSet])
    }

    async function isDocSetExist(folder_id){
        console.log(folder_id)
        if(!folder_id || folder_id === 'undefined'){
            return false
            
        };
        // if(folderId === ''){
        //     setFolderId(folder_id)
        // }
        try {
            let { data: document_set, error } = await supabase
                .from('document_set')
                .select('*')
                .eq('folder_id', folder_id);
                if(error){
                    console.log(error)
                    return toast({
                        variant: 'destructive',
                        title: "Some Error Occured While Fetching Context List"
                      });
                }
                
                if(document_set.length === 0){
                    router.push('/chat/upload')
                }else {
                    setLoading(false);
                    setDocumentSet(document_set);
                    return document_set[0]?.cc_pair_id
                    
                }
        } catch (error) {
            console.log(error)
        }
    };

    async function indexingStatus(f_id){
        console.log(f_id)
        if(!f_id || f_id === 'undefined'){
            return false
            
        };
        try {
            const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/connector/indexing-status`);
            const json = await data.json();
            // const isId = json.filter(da => da.credential.credential_json.id.includes(12));
            
            const allConID = await isDocSetExist(f_id);
            console.log(allConID)
            var cc_p_id = []
            for(const cc_id of json){
              if(allConID?.includes(cc_id?.cc_pair_id)){
                cc_p_id.push(cc_id)
              }
            };
            setExistConnectorDetails(cc_p_id)
            return cc_p_id
        } catch (error) {
            console.log(error)
            
        }
    
    };
    
    
    useEffect(() => {
        resizeTextarea();

    }, [userMsg]);

    useEffect(() => {
        setShowAdvance(false);
        
        if (chat_id !== 'new' && chat_id) {
            // console.log(chat_id)
            getChatHistory(chat_id)
            setChatSessionID(chat_id);
            localStorage.setItem('chatSessionID', chat_id)
        } else {
            setRcvdMsg('')
            setChatMsg([])
            setLoading(false);
            setParentMessageId(null)
            
            setChatSessionID('new');
            localStorage.removeItem('chatSessionID');
        }

        if(folderId === '' || folderId === null){
            setTimeout(()=> {
                console.log(folderId)
            // isDocSetExist(localStorage.getItem('lastFolderId'));
            indexingStatus(localStorage.getItem('lastFolderId'))
            }, 1000)
        }else{
            // isDocSetExist(folderId);
            indexingStatus(folderId)
        }


        
    }, [chat_id, folderId]);

    useEffect(()=> {
        if(chatSessionID === 'new'){
            setChatMsg([])
        }
    }, [chatSessionID])


    return (
        <div className='w-full flex flex-col rounded-[6px] gap-5 items-center no-scrollbar box-border h-screen pb-2 text-center'>
            <div className='w-full flex justify-between px-4 py-2 h-fit '>
                <div className='flex gap-2 justify-center items-center hover:cursor-pointer'>
                    {folder.length === 0 ?<Image src={Logo} alt='folder.chat'/> :
                    <span className='text-sm leading-5 font-[500] opacity-[60%] hover:opacity-100'>Context : {documentSet[0]?.doc_set_name || 'No Doc Uploaded'}</span>}

                    {!documentSet[0]?.doc_set_id ? folder.length !==0 && <Image src={plus} alt='add' title='Add Documents' onClick={() => setFileName('upload')} /> :
                        <Dialog onOpenChange={() => { setInputDocDes(''); }}>
                            <DialogTrigger asChild>
                                <Image src={editIcon} alt='edit' />
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader className='mb-2'>
                                    <DialogTitle>
                                        Update Context
                                    </DialogTitle>
                                </DialogHeader>
                                <Label htmlFor='doc-name'>Name</Label>
                                <Input
                                    id='doc-name'
                                    type='text'
                                    placeholder='document new name'
                                    value={documentSet[0]?.doc_set_name}
                                    disabled
                                    autoComplete='off'
                                    className='text-black bg-gray-200'
                                />
                                <Label htmlFor='doc-des'>Description</Label>
                                <Input
                                    id='doc-des'
                                    type='text'
                                    placeholder='document description'
                                    value={inputDocDes}
                                    onChange={(e) => setInputDocDes(e.target.value)}
                                    autoComplete='off'
                                />
                                <h1 className='font-[600] text-sm leading-5 m-2'>Select Documents</h1>
                                <div className='flex w-full flex-wrap gap-1'>

                                    {existConnectorDetails?.length > 0 &&
                                        existConnectorDetails?.map((connector) => <div key={connector.name} className={`px-2 py-1 border rounded hover:cursor-pointer hover:bg-gray-100 ${ccIDS.current.includes(connector.cc_pair_id) ? 'bg-gray-100' : ''}`} onClick={() => handleDocSet(connector.cc_pair_id)}>{connector.name}</div>)}
                                </div>
                                <DialogFooter className={cn('w-full')}>
                                    <Button variant={'outline'} className={cn('bg-[#14B8A6] text-[#ffffff] m-auto')}onClick={()=> updateDocumentSet([...newDocSet], inputDocDes)}>Update</Button>
                                </DialogFooter>

                            </DialogContent>
                        </Dialog>}
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
            {folder.length === 0 ?
                <div className='w-full h-full flex flex-col justify-center items-center gap-4'>
                    <Folder color='#14B8A6' size={'3rem'} className='block' />
                    <p className='text-[16px] leading-5 font-[400]'><span className='font-[500] hover:underline hover:cursor-pointer' onClick={() => setOpen(true)}>Create</span> a Folder First Before Start Chating...</p>
                    {open && <NewFolder setFolderAdded={setFolderAdded} openMenu={open} setOpenMenu={setOpen} />}
                </div>
                :
                <div className='w-[70%] h-[88%] rounded-[6px] flex flex-col justify-between box-border '>
                    {loading && <div className='w-full p-2 h-full items-center justify-center '><Loader2 className='m-auto animate-spin' /></div>}
                    {
                        chatMsg?.length == 0 && loading === false ?
                            <div>
                                <p className='font-[600] text-[20px] tracking-[.25%] text-[#0F172A] opacity-[50%] leading-7'>The chat is empty</p>
                                <p className='font-[400] text-sm tracking-[.25%] text-[#0F172A] opacity-[50%] leading-8'>Ask your document a question using message panel ...</p>
                            </div> :
                            <div className='flex w-full flex-col-reverse gap-2 overflow-y-scroll no-scrollbar px-3' >
                                <hr className='w-full bg-transparent border-transparent' />

                                
                                    <>
                                        {responseObj?.context_docs?.top_documents.length > 0 && 
                                        <div className='max-w-[70%] self-start float-left text-justify '>
                                            {responseObj?.context_docs?.top_documents[0]?.source_type !== 'file' ?
                                                <>
                                                    <h1 className='font-[600] text-sm leading-6'>Sources:</h1>
                                                    <a href={responseObj?.context_docs?.top_documents[0]?.link} target='_blank' className='w-full border p-1 text-[13px] hover:bg-gray-100 text-gray-700 rounded-md hover:cursor-pointer flex gap-1'><Image src={iconSelector(responseObj?.context_docs?.top_documents[0]?.source_type)} alt={responseObj?.context_docs?.top_documents[0]?.source_type} />{responseObj?.context_docs?.top_documents[0]?.semantic_identifier}</a> </> :
                                                <>
                                                    <h1 className='font-[600] text-sm leading-6'>Sources:</h1>
                                                    <a href={responseObj?.context_docs?.top_documents[0]?.link} target='_blank' className='w-full border p-1 text-[13px] hover:bg-gray-100 text-gray-700 rounded-md hover:cursor-pointer flex gap-1'><Image src={iconSelector(responseObj?.context_docs?.top_documents[0]?.source_type)} alt={responseObj?.context_docs?.top_documents[0]?.source_type} />{responseObj?.context_docs?.top_documents[0]?.semantic_identifier}</a> </>
                                            }
                                        </div>}

                                        {msgLoader && <p className='font-[400] text-sm leading-6 self-start float-left border-2 max-w-[70%] bg-transparent py-2 px-4 rounded-lg text-justify rounded-tl-[0px]'>
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
                                                    {rcvdMsg?.replaceAll("\\n", "\n")}
                                                </ReactMarkdown>}
                                        </p>}

                                    </>

                                {chatMsg?.map((msg, idx) => msg.user ?
                                    <p key={idx} className='font-[400] text-sm leading-6 self-end float-right  text-left max-w-[70%] min-w-[40%] bg-[#14B8A6] py-2 px-4 text-[#ffffff] rounded-[6px] rounded-tr-[0px]'>{msg.user}</p>
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
                                            {msg?.bot?.replaceAll("\\n", "\n")}
                                        </ReactMarkdown>
                                    }</p>
                                )}

                            </div>
                    }

                    <div className="w-full flex justify-center sm:bg-transparent p-2 pt-0 bg-white" >
                        <div className="flex bg-[#F7F7F7] w-full justify-around rounded-xl border-2 border-transparent "
                            style={{ boxShadow: '0 0 2px 0 rgb(18, 18, 18, 0.5)' }}>

                            <textarea className={`w-full bg-transparent outline-none self-center py-[10px] resize-none px-2 no-scrollbar max-h-[150px] min-h-[35px] ${textFieldDisabled ? 'hover:cursor-not-allowed' : ''}`}
                                id="textarea"
                                ref={textareaRef}
                                disabled={textFieldDisabled}
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
                </div>}
        </div>
    )
}

export default ChatWindow