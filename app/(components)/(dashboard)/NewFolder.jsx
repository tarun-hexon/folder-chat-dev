'use client'
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select"
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import plus from '../../../public/assets/plus - light.svg'
import Image from 'next/image';
import { useAtom } from 'jotai';
import { folderAtom, sessionAtom, folderIdAtom } from '../../store';
import { Folder } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { isUserExist } from '../../../config/lib';
import supabase from '../../../config/supabse';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '../../../lib/user';

const NewFolder = ( {setFolderAdded, openMenu, setOpenMenu}) => {
    // const [folder, setFolder] = useAtom(folderAtom);
    const [folderId, setFolderId] = useAtom(folderIdAtom);
    const [open, setOpen] = useState(openMenu);
    const [inputError, setInputError] = useState(false);
    // const [session, setSession] = useAtom(sessionAtom);

    //danswer user data

    const [currentUser, setCurrentUser] = useState({})
    
    const router = useRouter()
    
    const [fol, setFol] = useState({
        "title": '',
        "description": '',
        "type":[],
        "function": '',
    });


    // async function createFolder(folderData){
    //     if (folderData.title === '' || folderData.description === '' || folderData.function === '' || folderData.permissions.type.length === 0) {
    //         setInputError('select all the field first');
    //         return null
    //     } 

    //     try {
            
    //         const wkID = await isUserExist('workspaces', 'id', 'created_by',session.user.id);
            
    //         const { data, error } = await supabase
    //             .from('folders')
    //             .insert([
    //                 { 
    //                     'workspace_id': wkID[0].id, 
    //                     'user_id': currentUser?.id, 
    //                     'name' : folderData.title, 
    //                     'description': folderData.description, 
    //                     'function': folderData.function, 
    //                     'is_active': true, 
    //                     'chat_enabled': true 
    //                 }
    //             ])
    //             .select();
    //             if(data){
    //                 // console.log(data);
    //                 // setFolder([...folder, data]);
    //                 setFolderAdded(prev => !prev)
    //                 setOpen(false);
    //                 setFolderId(data[0].id)
                    
    //                 router.push(`/chat/upload`)
    //                 // window.history.replaceState('', '', `/chat/new`);
    //                 return 
    //             }
    //             if(error){
    //                 throw error
    //             }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // };

    async function createFolder(folderData){
        if (folderData.title === '' || folderData.description === '' || folderData.function === '' || folderData.type.length === 0) {
            setInputError('select all the field first');
            return null
        } 

        try {
            
            const wkID = await isUserExist('workspaces', 'id', 'created_by',session.user.id);
            const response = await fetch('/workspace/create-folder', {
                method:'POST',
                credentials:'include',
                headers:{
                    
                },
                body: JSON.stringify({
                    "workspace_id":1,
                    "user_id": currentUser?.id,
                    "name": folderData.title,
                    "description": folderData.description,
                    "function": folderData,description,
                    "is_active":true,
                    "chat_enabled":true,
                    "permissions":{
                        "type": folderData.type
                    }
                })
            });

            if(response?.ok){
                router.push(`/chat/upload`)
                return 
            }
            
        } catch (error) {
            console.log(error)
        }
    };

    async function fetchCurrentUser(){
        const user = await getCurrentUser();
        setCurrentUser(user)
      };
  
      useEffect(() => {
          fetchCurrentUser();
      }, []);
   

    return (
        <Dialog open={open} onOpenChange={() => {
            setOpen(!open); 
            setInputError(false); setFol({
                title: '',
                description: '',
                function: ''
            });
            setOpenMenu && setOpenMenu(false)
        }}>
            <DialogTrigger className='w-full'>
                {!openMenu && <div variant={'outline'} className='w-full text-sm font-[400] text-white bg-[#14B8A6] border-[#14B8A6] leading-[24px] flex items-center justify-between p-2 px-4 rounded-md hover:bg-[#DEEAEA] hover:text-black shadow-md'>
                    New Folder
                    <Image src={plus} alt={'add'} className='w-4 h-4' />
                </div>}
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='font-[600] text-[18px] leading-[18px] text-[#0F172A]'>Create New Folder</DialogTitle>
                    {/* <DialogDescription className='font-[400] text-[14px] leading-5'>
                        Workplace is where you & your team organize documents
                    </DialogDescription> */}
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <div className="flex flex-col items-start gap-4">
                        <Label htmlFor="name" className="font-[500] text-sm leading-5">
                            Folder Name
                        </Label>
                        <Input
                            id="name"
                            placeholder='Folder 1'
                            className="col-span-3"
                            value={fol.title}
                            onChange={(e) => setFol({
                                ...fol,
                                title: e.target.value
                            })}
                            autoComplete='off'
                        />
                    </div>
                    <div className="flex flex-col items-start gap-4">
                        <Label htmlFor="description" className="font-[500] text-sm leading-5">
                            Description
                        </Label>
                        <Input
                            id="description"
                            placeholder='Details about your folder'
                            className="col-span-3"
                            value={fol.description}
                            required
                            onChange={(e) => setFol({
                                ...fol,
                                description: e.target.value
                            })}
                            autoComplete='off'
                        />
                    </div>
                    {/* <div className="flex flex-col items-start gap-4">
                        <Label htmlFor="permission" className="font-[500] text-sm leading-5">
                            Permissions
                        </Label>
                        <Select 
                            
                            id="permission" 
                            onValueChange={(e) => setFol({
                                ...fol,
                                "type" : e === 'both' ? ["editor", "basic"] : [e]
                            })}>

                            <SelectTrigger className="w-full text-black flex justify-between">
                                <SelectValue
                                    placeholder="select an option"
                                    className='font-[400] text-[12px] leading-[20px]'
                                />
                            </SelectTrigger>
                            <SelectContent className="full">
                                <SelectItem value="editor" >Editor</SelectItem>
                                <SelectItem value="viewer">Viewer</SelectItem>
                                <SelectItem value="both">Both</SelectItem>
                                
                            </SelectContent>
                        </Select>
                    </div> */}
                    <div className="flex flex-col items-start gap-4">
                        <Label htmlFor="description" className="font-[500] text-sm leading-5">
                            Function
                        </Label>
                        <Select 
                            id="function" 
                            value={fol.function}
                            onValueChange={(e) => setFol({
                                ...fol,
                                function: e
                            })}>

                            <SelectTrigger className="w-full text-black flex justify-between">
                                <SelectValue
                                    placeholder="Select an option"
                                    className='font-[400] text-[12px] leading-[20px]'
                                    
                                />
                            </SelectTrigger>
                            <SelectContent className="full">
                                <SelectItem value="General" >General</SelectItem>
                                <SelectItem value="Sales and Marketing">Sales and Marketing</SelectItem>
                                <SelectItem value="Legal">Legal</SelectItem>
                                <SelectItem value="Finance">Finance</SelectItem>
                                <SelectItem value="HR">HR</SelectItem>
                                <SelectItem value="Docs">Docs</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <p className='tracking-tight text-xs text-red-400 -mt-1'>{inputError}</p>
                </div>
                <DialogFooter>
                    <Button variant={'outline'} type="submit" className='text-sm font-[400] text-white bg-[#14B8A6] border-[#14B8A6] leading-[24px]' onClick={() => createFolder(fol)}>Create Folder</Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}

export default NewFolder