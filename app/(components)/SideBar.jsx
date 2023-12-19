import React, { useState } from 'react'
import { folderOptions } from '../../config/constants';
import Image from 'next/image';
import threeDot from '../../public/assets/more-horizontal.svg'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { Account, NewFolder } from '../chat/(dashboard)'
import { useAtom } from 'jotai';
import { folderAtom, fileNameAtom, openMenuAtom } from '../store';
import docIcon from '../../public/assets/doc.svg';
import xlsIcon from '../../public/assets/xls.svg';
import pdfIcon from '../../public/assets/pdf.svg';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { X, ChevronRightCircle } from 'lucide-react';

import { Danswer } from './index'



const FolderCard = (props) => {
    const { title } = props.fol

    const [fileName, setFileName] = useAtom(fileNameAtom)
    const [popOpen, setPopOpen] = useState(false)
    const [data, setData] = useState([
        {
            title: 'Document 001.pdf',
            icon: pdfIcon
        },
        {
            title: 'Document 002.doc',
            icon: docIcon
        },
        {
            title: 'Document 003.xls',
            icon: xlsIcon
        }
    ]);

    return (

        <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className='rounded-lg bg-[#ffffff] py-3 px-2 gap-2 flex flex-col'>
                <div className='w-full flex justify-between'>
                    <AccordionTrigger className='flex-row-reverse items-center gap-2 w-full '>
                        <h2 className='text-sm leading-5 font-[600]'>{title}</h2>
                    </AccordionTrigger>
                    <Popover open={popOpen} onOpenChange={setPopOpen}>
                        <PopoverTrigger asChild>
                            <Image src={threeDot} alt={'options'} className='w-4 h-4 hover:cursor-pointer' />
                        </PopoverTrigger>
                        <PopoverContent className="w-full flex flex-col p-1 gap-[2px]">
                            {folderOptions.map((option, idx) => {
                                return (
                                    <div key={option.id} className="inline-flex p-2 items-center font-[400] text-sm leading-5 hover:bg-[#F1F5F9] rounded-md hover:cursor-pointer" onClick={() => { option.id === 'upload' && setFileName(option.id); setPopOpen(false) }}>
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
                        data.length === 0 ?
                            <div>
                                <span >Upload Document</span>
                                <Image src={threeDot} alt={'options'} className='w-4 h-4 hover:cursor-pointer' />
                            </div>
                            :
                            data.map((data, idx) => {
                                return (
                                    <div key={idx} className='flex justify-between items-center h-fit bg-[#EFF5F5] rounded-lg p-2 hover:cursor-pointer' onClick={() => setFileName(`${data.title}`)}>
                                        <div className='inline-flex gap-1 items-center'>
                                            <Image src={data.icon} alt={'icon'} className='w-4 h-4 hover:cursor-pointer' />
                                            <span className='font-[500] text-sm leading-5'>{data.title}</span>
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


    return (
        <div className='w-full bg-[#EFF5F5] flex flex-col py-[19px] px-[18px] gap-5 font-Inter relative '>

            <X size={20} className='top-2 absolute right-2 sm:hidden' onClick={() => setOpenMenu(false)} />
            <div className='w-full overflow-x-scroll no-scrollbar px-2'>
            <Account />
            </div>

            <div className='w-full h-fit bg-[#0EA5E9] text-[#FFFFFF] rounded-lg shadow-md'>
                <Danswer />
            </div>
            <div className='flex flex-col gap-2'>
                {folder.map((fol, idx) => {
                    return (
                        <FolderCard key={idx} fol={fol} />
                    )
                })}
            </div>
            <div>
                <NewFolder />
            </div>


        </div>

    )
}

export default SideBar