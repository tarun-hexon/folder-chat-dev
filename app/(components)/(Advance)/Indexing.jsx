import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import threeLines from '../../../public/assets/Danswer-All-B.svg'
import gDriveIcon from '../../../public/assets/Danswer-google-B.svg'
import web from '../../../public/assets/Danswer-web-B.svg'
import slackIcon from '../../../public/assets/Danswer-slack-B.svg'
import confluenceIcon from '../../../public/assets/Danswer-confluence-B.svg'
import gitIcon from '../../../public/assets/Danswer-github-B.svg';
import fileIcon from '../../../public/assets/Danswer-doc-B.svg';
import check from '../../../public/assets/check-circle.svg';
import { Dialog, DialogTrigger, DialogContent } from '../../../components/ui/dialog';

import { timeAgo } from '../../../config/time';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "../../../components/ui/table";
import { cn } from '../../../lib/utils';
import EditIndex from './EditIndex';
  

const Indexing = () => {
    const [tableData, setTableData] = useState([]);
    const [ccPairId, setCcPairId] = useState(null);
    const [open, setOpen] = useState(ccPairId !== null);
    async function indexingStatus(){
        try {
            const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/connector/indexing-status`);
            const json = await data.json();
            setTableData(json);
            console.log(tableData);
        } catch (error) {
            console.log(error)
        }

    };

    function iconSelectore(icon){
        if(icon === "web"){
            return web
        }else if(icon === "file"){
            return fileIcon
        }else if(icon === "github"){
            return gitIcon
        }else if(icon === "slack"){
            return slackIcon
        }else if(icon === "confluence"){
            return confluenceIcon
        }else{
            return gDriveIcon
        }
    };
    function statusBackGround(status){
        if(status === "success"){
            return ('text-[#22C55E]')
        }else if(status === "failed"){
            return ('text-[#eb3838]')
        }else if(status === "in_progress"){
            return ('text-[#FF5737]')
        }
    }
    function dialogTrgr(id){
        setCcPairId(id)
        const dialog = document.getElementById('dialog');
        dialog.click()
    }
    useEffect(()=> {
        indexingStatus()
        const int = setInterval(()=> {
            indexingStatus()
        }, 5000);
        return ()=> {
            clearInterval(int)
        }
    }, [])

    
    return (
        <>

            <div className='w-[80%] rounded-[6px] flex flex-col box-border space-y-2 gap-2'>
                <div className='flex justify-start items-center gap-2'>
                    <Image src={threeLines} alt='more' className='w-5 h-5' />
                    <h1 className='font-[600] text-[20px] leading-7 tracking-[-0.5%] text-start'>Indexing Status</h1>
                </div>
                <hr />
                <Table className='w-full text-sm'>
                    <TableHeader className='p-2 w-full'>
                        <TableRow className='border-b p-2 hover:bg-transparent'>
                            <TableHead className="text-left p-2">Connector</TableHead>
                            <TableHead className='text-center '>Status</TableHead>
                            <TableHead className='text-center '>Last Indexed</TableHead>
                            <TableHead className="text-center ">Docs Indexed</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className='w-full'>
                        {tableData?.map((item) => {
                            return (
                                
                                    <TableRow key={item?.cc_pair_id} className='border-b hover:cursor-pointer hover:bg-[#eaeaea]' onClick={()=> dialogTrgr(item?.cc_pair_id)}>
                                        
                                            <TableCell className="font-medium flex text-left justify-start p-2 py-3 gap-2 overflow-hidden pr-1 ">
                                                <Image src={iconSelectore(item?.connector?.source)} alt={item?.connector?.source} />{item?.name}
                                            </TableCell>
                                            <TableCell className=''>
                                                <div className={`flex justify-center items-center gap-1 ${statusBackGround(item?.latest_index_attempt?.status)}`}>
                                                    {`${item?.latest_index_attempt?.status || 'Processsing'}`}
                                                </div>
                                            </TableCell>
                                            <TableCell className=''>{timeAgo(item?.latest_index_attempt?.time_updated)}</TableCell>
                                            <TableCell className="text-center ">{`${item?.docs_indexed} ${item?.docs_indexed > 1 ?'documents' : 'document'}`} </TableCell>
                                        
                                    </TableRow>
                               
                            )
                        })}
                    </TableBody>
                </Table>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild >
                        <div id='dialog'></div>
                    </DialogTrigger>
                        <DialogContent>
                                <EditIndex cc_pair_id={ccPairId}/>
                        </DialogContent>
                    </Dialog>
            </div>
        </>
    )
}

export default Indexing