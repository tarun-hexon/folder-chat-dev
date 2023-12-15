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
import { folderAtom } from '../../store';
import { Folder } from 'lucide-react';

const NewFolder = () => {
    const [folder, setFolder] = useAtom(folderAtom);
    const [open, setOpen] = useState(false);
    const [inputError, setInputError] = useState(false)
    const [fol, setFol] = useState({
        title: '',
        description: '',
        function: 'General',
    });

    function addFolder(data) {
        if (data.title === '') {
            setInputError('Write some valid folder name');
            return null
        } else if (data.description === '') {
            setInputError('Write some valid folder description');
            return null
        } else {
            setFolder([...folder, data]);
            console.log(folder)

            setOpen(false)
        }
    };


    return (
        <Dialog open={open} onOpenChange={() => {
            setOpen(!open); setInputError(false); setFol({
                title: '',
                description: '',
                function: 'General',
            })
        }}>
            <DialogTrigger className='w-full'>
                <Button variant={'outline'} className='w-full text-sm font-[400] text-white bg-[#14B8A6] border-[#14B8A6] leading-[24px] flex items-center justify-between'>
                    New Folder
                    <Image src={plus} alt={'add'} className='w-4 h-4' />
                </Button>
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