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
import { timeAgo } from '../../../config/time';

const Indexing = () => {
    const [tableData, setTableData] = useState([]);

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
    }

    useEffect(()=> {
        indexingStatus()
    }, [])

    // const tableData = [{
    //     id: 'drive',
    //     title: 'Google Drive',
    //     icon: gDriveIcon,
    //     status: 'Enabled',
    //     lastIndex: '2 minutes ago',
    //     docsIndex: '6'
    // },
    // {
    //     id: 'git',
    //     title: 'Git PRs',
    //     icon: gitIcon,
    //     status: 'Enabled',
    //     lastIndex: '2 minutes ago',
    //     docsIndex: '6'
    // },
    // {
    //     id: 'confluence',
    //     title: 'Confluence',
    //     icon: confluenceIcon,
    //     status: 'Enabled',
    //     lastIndex: '2 minutes ago',
    //     docsIndex: '6'
    // },
    // {
    //     id: 'slack',
    //     title: 'Slack',
    //     icon: slackIcon,
    //     status: 'Enabled',
    //     lastIndex: '2 minutes ago',
    //     docsIndex: '6'
    // },
    // {
    //     id: 'web',
    //     title: 'Web',
    //     icon: webIcon,
    //     status: 'Enabled',
    //     lastIndex: '2 minutes ago',
    //     docsIndex: '6'
    // },
    // {
    //     id: 'file',
    //     title: 'Files',
    //     icon: fileIcon,
    //     status: 'Enabled',
    //     lastIndex: '2 minutes ago',
    //     docsIndex: '6'
    // }]
    return (
        <>

            <div className='w-[80%] rounded-[6px] flex flex-col box-border space-y-2 gap-2'>
                <div className='flex justify-start items-center gap-2'>
                    <Image src={threeLines} alt='more' className='w-5 h-5' />
                    <h1 className='font-[600] text-[20px] leading-7 tracking-[-0.5%] text-start'>Indexing Status</h1>
                </div>
                <hr />
                <table className='w-full text-sm'>
                    <thead className='p-2 w-full'>
                        <tr className='border-b p-2'>
                            <th className="text-left p-2 max-w-[50%]">Connector</th>
                            <th className='text-center w-[16%]'>Status</th>
                            <th className='text-center w-[16%]'>Last Indexed</th>
                            <th className="text-center w-[16%]">Docs Indexed</th>
                        </tr>
                    </thead>
                    <tbody className='w-full'>
                        {tableData?.map((item, idx) => {
                            return (
                                <tr className='border-b hover:cursor-pointer w-full hover:bg-[#eaeaea]' key={item?.cc_pair_id}>
                                    <td className="font-medium flex text-left justify-start p-2 py-3 gap-2 overflow-hidden pr-1 max-w-[80%]"><Image src={iconSelectore(item?.connector?.source)} alt={item?.connector?.source} />{item?.name}</td>
                                    <td className='w-[16%]'>
                                        <div className={`flex justify-center items-center gap-1 ${item?.latest_index_attempt?.status === 'success' ? 'text-[#22C55E]' : "text-[#000]"}`}>
                                            {`${item?.latest_index_attempt?.status || 'Processsing'}`}
                                        </div>
                                    </td>
                                    <td className='w-[16%]'>{timeAgo(item?.latest_index_attempt?.time_updated)}</td>
                                    <td className="text-center w-[16%]">{`${item?.docs_indexed} ${item?.docs_indexed > 1 ?'documents' : 'document'}`} </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

            </div>
        </>
    )
}

export default Indexing