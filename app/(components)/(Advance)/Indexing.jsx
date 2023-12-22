import React from 'react'
import Image from 'next/image';
import threeLines from '../../../public/assets/Danswer-All-B.svg'
import gDriveIcon from '../../../public/assets/Danswer-google-B.svg'
import webIcon from '../../../public/assets/Danswer-web-B.svg'
import slackIcon from '../../../public/assets/Danswer-slack-B.svg'
import confluenceIcon from '../../../public/assets/Danswer-confluence-B.svg'
import gitIcon from '../../../public/assets/Danswer-github-B.svg';
import fileIcon from '../../../public/assets/Danswer-doc-B.svg';
import check from '../../../public/assets/check-circle.svg';


const Indexing = () => {

    const tableData = [{
        id: 'drive',
        title: 'Google Drive',
        icon: gDriveIcon,
        status: 'Enabled',
        lastIndex: '2 minutes ago',
        docsIndex: '6'
    },
    {
        id: 'git',
        title: 'Git PRs',
        icon: gitIcon,
        status: 'Enabled',
        lastIndex: '2 minutes ago',
        docsIndex: '6'
    },
    {
        id: 'confluence',
        title: 'Confluence',
        icon: confluenceIcon,
        status: 'Enabled',
        lastIndex: '2 minutes ago',
        docsIndex: '6'
    },
    {
        id: 'slack',
        title: 'Slack',
        icon: slackIcon,
        status: 'Enabled',
        lastIndex: '2 minutes ago',
        docsIndex: '6'
    },
    {
        id: 'web',
        title: 'Web',
        icon: webIcon,
        status: 'Enabled',
        lastIndex: '2 minutes ago',
        docsIndex: '6'
    },
    {
        id: 'file',
        title: 'Files',
        icon: fileIcon,
        status: 'Enabled',
        lastIndex: '2 minutes ago',
        docsIndex: '6'
    }]
    return (
        <>

            <div className='w-[80%] h-[30rem] rounded-[6px] flex flex-col box-border space-y-2 gap-2'>
                <div className='flex justify-start items-center gap-2'>
                    <Image src={threeLines} alt='more' className='w-5 h-5' />
                    <h1 className='font-[600] text-[20px] leading-7 tracking-[-0.5%] text-start'>Indexing Status</h1>
                </div>
                <hr />
                <table className='w-full text-sm'>
                    <thead className='p-2 w-full'>
                        <tr className='border-b p-2'>
                            <th className="text-left p-2">Connector</th>
                            <th className='text-center'>Status</th>
                            <th className='text-center'>Last Indexed</th>
                            <th className="text-center">Docs Indexed</th>
                        </tr>
                    </thead>
                    <tbody className='w-full'>
                        {tableData.map((item, idx) => {
                            return (
                                <tr className='border-b hover:cursor-pointer w-full' key={item.id}>
                                    <td className="font-medium flex text-left justify-start p-2 py-3 gap-2"><Image src={item.icon} alt={item.id} />{item.title}</td>
                                    <td className=''>
                                        <div className='flex justify-center items-center gap-1 text-[#22C55E]'>
                                            <Image src={check} alt='checked' className='w-4 h-4' />{item.status}
                                        </div>
                                    </td>
                                    <td>{item.lastIndex}</td>
                                    <td className="text-center">{item.docsIndex} documents</td>
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