'use client'
import React, { useState, useEffect } from 'react'
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Button } from "../../../components/ui/button"
import temp_icon from '../../../public/assets/temp_icon.jpg'
import supabase from '../../../config/supabse'
import Image from "next/image";
import { darkModeAtom, isPostSignUpCompleteAtom, sessionAtom } from '../../store';
import { useAtom } from 'jotai'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '../../../components/ui/use-toast';
import { insertData, isUserExist } from '../../../config/lib'



const PostSignup = () => {
    const [darkMode] = useAtom(darkModeAtom);
    const [isPostSignUpComplete, setIsPostSignUpComplete] = useAtom(isPostSignUpCompleteAtom);
    const [session, setSession] = useAtom(sessionAtom);
    const [onBoard, setOnBoard] = useState(false);
    const [name, setName] = useState('');
    const [userExist, setUserExist] = useState(false);

    const router = useRouter();
    const {toast} = useToast();


    async function updateUserName(name) {
        if (name === '') return toast({
                    variant: "destructive",
                    title: "Uh oh! Name cannot be empty.",
                });
        
        try {
            await updateUsersTable(name);
            const { user, error } = await supabase.auth.updateUser({
                data: { full_name: name }
            });
            if (error) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                  })
                throw error
            };
            setName('');
            setIsPostSignUpComplete(true);
            
        } catch (error) {
            console.log(error)
        };

    };

    async function checkIfUserExist(){
        try {
            const id = await isUserExist('users', 'email', 'email', session.user.email);
            if(id.length > 0){
                setUserExist(id[0].email)
            }else{
                setUserExist(false)
            }
            console.log(id)
        } catch (error) {
            console.log(error)
        }
    };

    async function updateUsersTable(name){
        if(userExist == false){
            try {
                const { data, error } = await supabase
                .from('users')
                .insert([
                { name: name, email: session.user.email, email_verified: true },
                ])
                .select()
                console.log(data)
            } catch (error) {
                console.log(error)
            }
        }else{
            try {

            const { data, error } = await supabase
            .from('users')
            .update({ name: name })
            .eq('email', userExist)
            .select()

            console.log(data)
            } catch (error) {
                console.log(error)
            }
        }
    }
    useEffect(() => {
        checkIfUserExist()
        if (session?.user?.user_metadata?.onBoarding) {
            router.push('/chat')
        }
    }, [session]);

    if (session?.user?.user_metadata?.onBoarding) {
        return <Loader2 className='animate-spin' />
    }
    return (
        <div className={`flex flex-col w-[22rem] gap-5 items-center box-border ${darkMode ? '' : 'text-white'}`}>

            <div className='w-full text-center'>
                <h1 className='font-[600] text-[20px]'>Welcome to <span className='text-[#14B8A6]'>folder.chat</span></h1>
                <p className='text-xs opacity-90'>First things first, tell us about yourself.</p>
            </div>

            <div className='w-full flex flex-col items-center gap-4 justify-center mt-4'>

                <div className='w-full'>
                    <Label htmlFor='profile-img' className='flex flex-col items-center justify-center'><Image src={temp_icon} alt="user_img" className='h-20 w-20 block rounded-full' /><p className='text-[12px] font-[300] opacity-70 mt-2 -ml-1'>Add a photo</p>
                    </Label>
                    <input type='file' id='profile-img' accept="image/png, image/jpeg" style={{ display: 'none' }}
                        onChange={(e) => uploadImage(e.target.files[0])}
                    />
                </div>

                <div className='w-full text-start'>
                    <Label htmlFor="name" className='text-[14px] font-[500] leading-[20px]'>What should we call you?</Label>
                    <Input type='text' id="name" name='name' placeholder='eg: Ada Lovelase' className='text-black mt-1 border-[#CBD5E1] text-[14px] font-[500] leading-[20px]' onChange={(e) => setName(e.target.value)} />
                </div>

                <Button variant="outline" className={`w-full mt-2 text-sm text-white font-[400] bg-[#14B8A6] border-[#14B8A6] leading-[24px] flex items-center justify-center ${false ? 'opacity-5' : ''}`} disabled={name == ''}
                    onClick={() => updateUserName(name)}
                >Continue</Button>

                <div className='w-[33rem] text-xs opacity-60 text-center mt-4 leading-[20px] font-[300]'>You may unsubscribe from receiving marketing communications at any time. Folder.chat&apos;s websites and communications are subjects to our Privacy Policy</div>
            </div>


        </div>
    )
}

export default PostSignup