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

import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import plus from '../../../public/assets/plus - light.svg';
import Image from 'next/image';
import { useAtom } from 'jotai';
import { folderAtom, sessionAtom, folderIdAtom } from '../../store';
import { Folder } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { isUserExist } from '../../../config/lib';
import supabase from '../../../config/supabse';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '../../../lib/user';

const Workspace = ({ openMenu, setOpenMenu }) => {
    
    const [open, setOpen] = useState(openMenu);
    const [inputError, setInputError] = useState(false);

    const [currentUser, setCurrentUser] = useState({})

    const router = useRouter()

    const [userInput, setUserInput] = useState({
        name: '',
        domain: ''
    });


    async function createWorkspace() {
        if (userInput.name === '') {
            setInputError('Write some valid workspace name');
            return null
        } else if (userInput.domain === '') {
            setInputError('Write some valid domain');
            return null
        };

        try {
            const res = await fetch('/api/workspace/create-workspace', {
                method: 'POST',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "name": userInput.name,
                    "created_by": currentUser?.id,
                    "is_active": true,
                    "domain": userInput.domain
                })
            });
            if (res.ok) {
                setOpen(false);
            }
        } catch (error) {
            console.log(error)
        }
    };
    async function fetchCurrentUser() {
        const user = await getCurrentUser();
        setCurrentUser(user)
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);


    return (
        <Dialog open={open} onOpenChange={() => {
            setOpen(!open);
            setInputError(false); 
            setUserInput({
                name: '',
                domain: ''
            });
            setOpenMenu && setOpenMenu(false)
        }}>
            {!openMenu && <DialogTrigger className='w-full'>
                <Button className='w-full bg-[#14B8A6] hover:bg-[#14B8A6] opacity-75 hover:opacity-100 shadow-lg'>
                    Add Workspace
                </Button>
            </DialogTrigger>}

            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='font-[600] text-[18px] leading-[18px] text-[#0F172A]'>Create New Workspace</DialogTitle>
                    <DialogDescription className='font-[400] text-[14px] leading-5'>
                        Workplace is where you & your team organize documents
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <div className="flex flex-col items-start gap-4">
                        <Label htmlFor="name" className="font-[500] text-sm leading-5">
                            Workplace Name
                        </Label>
                        <Input
                            id="name"
                            placeholder='Type workplace name'
                            className="col-span-3"
                            value={userInput.name}
                            onChange={(e) => setUserInput({
                                ...userInput,
                                name: e.target.value
                            })}
                            autoComplete='off'
                        />
                    </div>
                    <div className="flex flex-col items-start gap-4">
                        <Label htmlFor="description" className="font-[500] text-sm leading-5">
                            Domain Name
                        </Label>
                        <Input
                            id="description"
                            placeholder='workspace@xyz.com'
                            className="col-span-3"
                            value={userInput.domain}
                            required
                            onChange={(e) => setUserInput({
                                ...userInput,
                                domain: e.target.value
                            })}
                            autoComplete='off'
                        />
                    </div>

                    <p className='tracking-tight text-xs text-red-400 -mt-1'>{inputError}</p>
                </div>
                <DialogFooter>
                    <Button variant={'outline'} type="submit" className='text-sm font-[400] text-white bg-[#14B8A6] border-[#14B8A6] leading-[24px]' onClick={createWorkspace}>Create Workspace</Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}

export default Workspace