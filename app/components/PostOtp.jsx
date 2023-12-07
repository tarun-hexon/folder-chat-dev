'use client'
import React, { useEffect, useState } from 'react'
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Button } from "../../components/ui/button"
import user_icon from "../../public/assets/user_icon.png"
import eye_icon from "../../public/assets/eye_icon.svg"
import supabase from '../../config/supabse'
import Image from "next/image";
import { darkModeAtom, isPostOtpCompleteAtom } from '../store';
import { useAtom } from 'jotai'


const PostOtp = () => {
    const [darkMode] = useAtom(darkModeAtom);
    const [isPostOtpComplete, setIsPostOtpComplete] = useAtom(isPostOtpCompleteAtom);

    const [userData, setUserData] = useState({
        name: '',
        password: ''
    });

    function setUserInfo(e) {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
    }


    function showPassword(id) {
        var input = document.getElementById(id);
        if (input) {
            if (input.type === "text") {
                input.type = "password";
            } else {
                input.type = "text";
            }
        }
    };


    async function uploadImage(file) {
       
        if (file) {
          try {
            const { data, error } = await supabase.storage
              .from('profile_pic')
              .upload(file.name, file, { contentType: file.type });
  
            if (error) {
              console.error('Error uploading image:', error.message);
            } else {
              console.log('Image uploaded successfully:', data);
              // Optionally, you can do something with the uploaded data.
            }
          } catch (error) {
            console.error('An unexpected error occurred:', error.message);
          }
        } else {
          console.warn('No file selected.');
        }
      };
      
    async function updateDeatils(){
        const {data, error} = await supabase.auth.updateUser({ 
            password: userData.password, 
            name:userData.name 
        })
        if(error){
            alert(error.message)
        }else{
            setIsPostOtpComplete(true)
        }
    }

    return (
        <div className={`flex flex-col w-[22rem] gap-5 items-center box-border ${darkMode ? '' : 'text-white'}`}>

            <div className='w-full text-center'>
                <h1 className='font-[600] text-[20px]'>Welcome to <span className='text-[#14B8A6]'>folder.chat</span></h1>
                <p className='text-xs opacity-90'>First things first, tell us about yourself.</p>
            </div>

            <div className='w-full flex flex-col items-center gap-4 justify-center mt-4'>

                <div className='w-full'>
                    <Label htmlFor='profile-img' className='flex flex-col items-center justify-center'><Image src={false ? imgURL : user_icon} alt="user_img" className='h-20 w-20 block' /><p className='text-[12px] font-[300] opacity-70 mt-2 -ml-1'>Add a photo</p>
                    </Label>
                    <input type='file' id='profile-img' accept="image/png, image/jpeg" style={{ display: 'none' }} 
                    onChange={(e) => uploadImage(e.target.files[0])}
                    />
                </div>

                <div className='w-full text-start'>
                    <Label htmlFor="name" className='text-[14px] font-[500] leading-[20px]'>What should we call you?</Label>
                    <Input type='text' id="name" name='name' placeholder='eg: Ada Lovelase' className='text-black mt-1 border-[#CBD5E1] text-[14px] font-[500] leading-[20px]' onChange={(e) => setUserInfo(e)} />
                </div>

                <div className='w-full relative text-start'>

                    <Label htmlFor="password" className='text-[14px] font-[500] leading-[20px]'>Set a Password</Label>
                    <Input type='password' name='password' id="password" placeholder='New Password' className='mt-1 text-black border-[#CBD5E1] pr-12 font-[500]' onChange={(e) => setUserInfo(e)} />

                    {userData.password !== '' && <button id="togglePassword" className="absolute top-16 right-2 transform -translate-y-1/2 px-2 py-1" onClick={() => showPassword('password')}>
                        <Image src={eye_icon} alt='show-password' title='Show Password' />
                    </button>}
                </div>

                <Button variant="outline" className={`w-full mt-2 text-sm text-white font-[400] bg-[#14B8A6] border-[#14B8A6] leading-[24px] flex items-center justify-center ${false ? 'opacity-5' : ''}`} disabled={userData.password == '' || userData.name == ''} onClick={updateDeatils}>Continue</Button>
                
                <div className='w-[33rem] text-xs opacity-60 text-center mt-4 leading-[20px] font-[300]'>You may unsubscribe from receiving marketing communications at any time. Folder.chat&apos;s websites and communications are subjects to our Privacy Policy</div>
            </div>


        </div>
    )
}

export default PostOtp