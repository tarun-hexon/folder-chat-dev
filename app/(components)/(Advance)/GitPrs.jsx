import React, { useEffect, useState } from 'react'
import Image from 'next/image';

import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

import gitIcon from '../../../public/assets/Danswer-github-B.svg';

import check from '../../../public/assets/check-circle.svg';
import trash from '../../../public/assets/trash-2.svg';
import { useToast } from '../../../components/ui/use-toast';

const GitPrs = () => {

    const [git_token, setGitToken] = useState('');
    const [tokenValue, setTokenValue] = useState('');
    const [repos, setRepos] = useState([]);
    const [repoOwner, setRepoOwner] = useState('');
    const [repoName, setRepoName] = useState('');
    const [tokenStatus, setTokenStatus] = useState(false);
    const [connectorId, setConnectorId] = useState(null);
    const [credentialID, setCredentialID] = useState(null);
    const [adminCredential, setAdminCredential] = useState([])
    const { toast } = useToast();


    async function getAdminCredentials(){
        try {
            const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/credential`);
            const json = await data.json();
            const currentToken = json.filter(res => res.credential_json.github_access_token !== undefined)
            setAdminCredential(currentToken[0]);
            console.log(currentToken[0])
        } catch (error) {
            console.log(error)
        }
    }


    async function getCredentials(accessToken) {
        try {
            const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/credential`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
    
                },
                body: JSON.stringify({
                    "credential_json": {
                        "github_access_token": accessToken
                    },
                    "admin_public": true
                })
            });
            const json = await data.json();
            console.log(json.id)
            setCredentialID(json.id);
            
        } catch (error) {
            throw error
        }
    };

    async function connectorRequest(owner_name, repo_name ,id1) {
        const full_name = `${owner_name}/${repo_name}`
        try {
            const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/connector`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "name": `GithubConnector-${owner_name}/${repo_name}`,
                    "source": "github",
                    "input_type": "poll",
                    "connector_specific_config": {
                        "repo_owner": `${owner_name}`,
                        "repo_name": `${repo_name}`,
                        "include_prs": true,
                        "include_issues": true
                    },
                    "refresh_freq": 600,
                    "disabled": false
                })
            }
                
            );
            const json = await data.json();
            console.log(json.id)
            setConnectorId(json.id);
            sendURL(json.id, id1, full_name);
        } catch (error) {
            throw error
        }        
    };

    async function sendURL(connectorId, credentialID, baseName){
        console.log(connectorId, credentialID)
        try {
            const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/connector/${connectorId}/credential/${credentialID}`, {
            method: 'PUT',
            headers: {
                    "Content-Type": "application/json",   
                },
            body: JSON.stringify({'name': baseName})
            });
            const json = await data.json();
            setRepos([`${baseName}`, ...repos]);
           console.log(json)
        } catch (error) {
            throw error
            
        }
    }


    async function validateGitHubAccessToken(accessToken) {
        const apiUrl = 'https://api.github.com';
        const userEndpoint = '/user';

        const headers = {
            Authorization: `Bearer ${accessToken}`,

        };

        try {
            const response = await fetch(apiUrl + userEndpoint, { headers });

            if (response.status === 200) {
                setTokenStatus(true);
                setTokenValue('') 
                setGitToken(accessToken);
                getCredentials(accessToken)

            } else {
                setGitToken('')
                toast({
                    variant: 'destructive',
                    title: 'Token validation failed.'
                })

            }
        } catch (error) {
            console.error(`Error validating GitHub access token: ${error.message}`);
        }
    };

    
    async function addRepo() {
        if (!tokenStatus) return toast({
            variant: 'destructive',
            title: 'Please Provide a token for validation.'
        })
        if (repoName === '' || repoOwner === '') {
            return toast({
                title: 'Please provide some valid name and repo'
            })
        }
        try {
            const headers = {
                Authorization: `Bearer ${git_token}`,
            };
            const data = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}`, { headers });
            const json = await data.json();
            if (json.message === 'Not Found') {
                throw new Error('Not Found')
            }

            if (json) {
                
                connectorRequest(repoOwner , repoName , credentialID)
                setRepoName('');
                setRepoOwner('');
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Repo Not Found'
            })

        }
    };


    useEffect(()=> {
        // getAdminCredentials()
    }, [])
    return (
        <>
            <div className='w-[80%] rounded-[6px] flex flex-col box-border space-y-2 gap-4'>
                <div className='flex justify-start items-center gap-2'>
                    <Image src={gitIcon} alt='github' className='w-5 h-5' />
                    <h1 className='font-[600] text-[20px] leading-7 tracking-[-0.5%] text-start'>Github PRs</h1>
                </div>
                <hr className='w-full' />
                <div className='self-start text-sm leading-5 flex flex-col gap-2 w-full'>
                    <h2 className='font-[600]  text-start'>Step 1: Provide your access token</h2>
                    {git_token !== '' ? <span className='font-[400] inline-flex items-center'>Existing Access Token: {'****...*** ' + git_token.slice(0, 5)} <Image src={trash} alt='remove' className='w-4 h-4 inline hover:cursor-pointer' onClick={() => setGitToken('')} /></span>
                        :
                        <div className='w-full space-y-2 text-start'>
                            <Input type='password' className='w-full' value={tokenValue} placeholder='Github Access Token' onChange={(e) => setTokenValue(e.target.value)} />
                            <Button onClick={() => { validateGitHubAccessToken(tokenValue); }}>Add</Button>
                        </div>
                    }

                </div>
                <div className='self-start text-sm leading-5 flex flex-col gap-2'>
                    <h2 className='font-[600]  text-start'>Step 2: Which repositories do you want to make searchable?</h2>
                    <span className='font-[400]'>We pull the latest Pull Requests from each Repository listed below every <span className='font-[600]'>10</span> minutes</span>
                </div>
                {repos.length > 0 && <table className='w-full text-sm'>
                    <thead className='p-2 w-full'>
                        <tr className='border-b p-2'>
                            <th className="text-left p-2">Repository</th>
                            <th className='text-center'>Status</th>
                            <th className='text-center'>Credential</th>
                            <th className="text-center">Remove</th>
                        </tr>
                    </thead>
                    <tbody className='w-full'>
                        {repos.map((item, idx) => {
                            return (
                                <tr className='border-b hover:cursor-pointer w-full' key={idx}>
                                    <td className="font-medium text-left justify-start p-2 py-3">{item}</td>
                                    <td className=''>
                                        <div className='flex justify-center items-center gap-1 text-[#22C55E]'>
                                            <Image src={check} alt='checked' className='w-4 h-4' />Enabled
                                        </div>
                                    </td>
                                    <td className=''>{'****...*** ' + git_token.slice(0, 5)}</td>
                                    <td><Image src={trash} alt='remove' className='m-auto hover:cursor-pointer' /></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>}
                <div className='w-full self-start p-5 border rounded-lg'>
                    <div className='text-start flex flex-col gap-4'>
                        <h2 className='font-[500] text-[16px] leading-6 text-[#0F172A]'>Connect to a New Repository</h2>
                        <Input placeholder='Repository Owner' type='text' value={repoOwner} onChange={(e) => setRepoOwner(e.target.value)} />
                        <Input placeholder='Repository Name' type='text' value={repoName} onChange={(e) => setRepoName(e.target.value)} />
                        <Button className='w-20' onClick={() => {
                            addRepo()
                        }}>Connect</Button>
                    </div>
                </div>

            </div>

        </>
    )
}

export default GitPrs