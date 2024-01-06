import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../../components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../components/ui/select"
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Button } from "../../../../components/ui/button";
import plus from '../../../../public/assets/plus - light.svg'
import Image from 'next/image';
import { useAtom } from 'jotai';
import { folderAtom, sessionAtom } from '../../../store';
import { Folder } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { isUserExist } from '../../../../config/lib';
import supabase from '../../../../config/supabse';

const NewFolder = ( {setFolderAdded, openMenu, setOpenMenu}) => {
    const [folder, setFolder] = useAtom(folderAtom);
    const [open, setOpen] = useState(openMenu);
    const [inputError, setInputError] = useState(false);
    const [session, setSession] = useAtom(sessionAtom)
    const id = uuidv4()
    const [fol, setFol] = useState({
        id: id,
        title: '',
        description: '',
        function: 'General',
        files:[]
    });

    async function addFolder(data) {
        
        if (data.title === '') {
            setInputError('Write some valid folder name');
            return null
        } else if (data.description === '') {
            setInputError('Write some valid folder description');
            return null
        } else {
            await createFolder(data); 
            
        }
    };

    async function createFolder(folderData){
        try {
            
            const wkID = await isUserExist('workspaces', 'id', 'created_by',session.user.id);
            
            const { data, error } = await supabase
                .from('folders')
                .insert([
                    { workspace_id: wkID[0].id, user_id: session.user.id, name:folderData.title, description:folderData.description, function:folderData.function, is_active:true, chat_enabled:true},
                ])
                .select();
                if(data){
                    console.log(data);
                    setFolder([...folder, data]);
                    setFolderAdded(prev => !prev)
                    setOpen(false)
                    return 
                }
                throw error
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={() => {
            setOpen(!open); 
            setInputError(false); setFol({
                id:id,
                title: '',
                description: '',
                function: 'General',
                files: []
            });
            setOpenMenu && setOpenMenu(false)
        }}>
            <DialogTrigger className='w-full'>
                {!openMenu && <div variant={'outline'} className='w-full text-sm font-[400] text-white bg-[#14B8A6] border-[#14B8A6] leading-[24px] flex items-center justify-between p-2 px-4 rounded-md hover:bg-[#DEEAEA] hover:text-black'>
                    New Folder
                    <Image src={plus} alt={'add'} className='w-4 h-4' />
                </div>}
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='font-[600] text-[18px] leading-[18px] text-[#0F172A]'>Create New Folder</DialogTitle>
                    <DialogDescription className='font-[400] text-[14px] leading-5'>
                        Workplace is where you & your team organize documents
                    </DialogDescription>
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
                    <div className="flex flex-col items-start gap-4">
                        <Label htmlFor="description" className="font-[500] text-sm leading-5">
                            Function
                        </Label>
                        <Select id="function">
                            <SelectTrigger className="w-full text-black flex justify-between">
                                <SelectValue
                                    placeholder="Select an option"
                                    className='font-[400] text-[12px] leading-[20px]'
                                    value={fol.function}
                                />
                            </SelectTrigger>
                            <SelectContent className="full">
                                <SelectItem value="General" ><Folder className='inline-flex mr-1'/> General</SelectItem>
                                <SelectItem value="option 1">option 2</SelectItem>
                                <SelectItem value="option 2">option 3</SelectItem>
                                <SelectItem value="option 3">option 4</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <p className='tracking-tight text-xs text-red-400 -mt-1'>{inputError}</p>
                </div>
                <DialogFooter>
                    <Button variant={'outline'} type="submit" className='text-sm font-[400] text-white bg-[#14B8A6] border-[#14B8A6] leading-[24px]' onClick={() => addFolder(fol)}>Create Folder</Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}

export default NewFolder