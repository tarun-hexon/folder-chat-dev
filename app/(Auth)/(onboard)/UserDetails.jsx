'use client'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { darkModeAtom, isPostNameCompleteAtom, isPostUserCompleteAtom, selectOptionAtom, sessionAtom } from '../../store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select"
import { Button } from '../../../components/ui/button'
import { Label } from '../../../components/ui/label'
import { Input } from '../../../components/ui/input'
import { useRouter } from 'next/navigation'
import { selectOptions } from '../../../config/constants';
import supabase from '../../../config/supabse'
import { useToast } from '../../../components/ui/use-toast'
import { isUserExist } from '../../../config/lib'


const SelectCard = (props) => {
  const {id} = props
  const [selectedValue, setSelectedValue] = useState("1");
  const [selectValue, setSelectValue] = useAtom(selectOptionAtom);

  const handleChange = (e) => {
    
    setSelectedValue(e);
    const currentName = selectValue.filter(item => item.name === props.id);
    currentName[0].value = e
    setSelectValue(selectValue)
  }

  // useEffect(()=> {
  //   console.log(selectValue)
  // }, [selectedValue])


  return (
    <div className='w-full flex flex-col text-start gap-1 select-none'>
      <Label htmlFor={props.id} className='text-[14px] leading-[20px] font-[400] opacity-[50%]'>{props.title}</Label>
      <Select id={props.id}  value={selectedValue} onValueChange={(e)=> handleChange(e)} className='select-none'>
        <SelectTrigger className="w-full text-black flex justify-between select-none">
          <SelectValue placeholder="Select an option" className='font-[400] text-[12px] leading-[20px]' />
        </SelectTrigger>
        <SelectContent className="w-full select-none" >
          <SelectItem value="1">option 1</SelectItem>
          <SelectItem value="2">option 2</SelectItem>
          <SelectItem value="3">option 3</SelectItem>
          <SelectItem value="4">option 4</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
};


const WorkPlace = () => {
  const [darkMode] = useAtom(darkModeAtom);
  const [workPlaceName, setWorkPlaceName] = useState('');
  const [session, setSession] = useAtom(sessionAtom);

  const router = useRouter();

  async function updateUser(){
    try {
      await createWorkPlace(workPlaceName)
      const { user, error } = await supabase.auth.updateUser({
        data:{
          onBoarding: true,
        }
      });
      if(error){
        throw error
      }
      router.push('/chat')
    } catch (error) {
      console.log(error)
    };
    
  };

  async function createWorkPlace(name){
    try {
      
      const { data, error } = await supabase
      .from('workspaces')
      .insert([
        { name: name, is_active: true, created_by:session.user.id, subscription_active:false },
      ])
      .select();
      if(data){
        console.log(data)
      }else{
        throw error
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={`flex flex-col w-96 gap-5 items-center box-border ${darkMode ? '' : 'text-white'}`}>
      <div className='w-[90%] text-center mb-5'>
        <h1 className='font-[600] text-[20px] leading-[28px]'>Create a workplace</h1>
        <p className='font-[400] text-[12px] leading-[28px]'>Fill in some details</p>
      </div>
      <div className='w-full text-start space-y-2'>
        <Label htmlFor="workplace" className='text-[14px] leading-[20px] font-[500]'>Workplace name</Label>
        <Input type='text' id="workplace" placeholder='Type workplace name' className='text-black' required onChange={(e) => {
          setWorkPlaceName(e.target.value)
        }}/>
        <p className='font-[400] text-[14px] leading-[20px]'>The name of your company or organization</p>
      </div>
      <Button variant="outline" className={`w-full text-sm font-[400] bg-[#14B8A6] border-[#14B8A6] leading-[24px] flex items-center justify-center text-white`} disabled={workPlaceName === ''} onClick={()=> {updateUser()}}>Continue</Button>
    </div>
  )
}
const UserDetails = () => {

  const [darkMode] = useAtom(darkModeAtom);
  const [isPostUserComplete, setIsPostUserComplete] = useAtom(isPostUserCompleteAtom);
  const [isPostNameComplete, setIsPostNameComplete] = useAtom(isPostNameCompleteAtom);
  const [selectValue, setSelectValue] = useAtom(selectOptionAtom);

  const [session, setSession] = useAtom(sessionAtom);

  const {toast} = useToast();


  async function updateProfile(){
    
    
    try {

        const checkIfUser = await isUserExist('profile', 'id', 'user_id', session.user.id);
        console.log(checkIfUser)
        if(checkIfUser.length === 0){
          const { data, error } = await supabase
        .from('profile')
        .insert([
        { is_for_personal: session?.user?.user_metadata?.is_for_personal, 
          user_id: session?.user?.id,
          department:selectValue[0].value,
          designation:selectValue[1].value,
          purpose:selectValue[3].value
        },
        ])
        .select();
        console.log(data)
        if(data){
          setIsPostUserComplete(true);
        }
        }else{
          const { data, error } = await supabase
        .from('profile')
        .update([
        { is_for_personal: session?.user?.user_metadata?.is_for_personal, 
          user_id: session.user.id,
          department:selectValue[0].value,
          designation:selectValue[1].value,
          purpose:selectValue[3].value
        },
        ])
        .eq('id', checkIfUser[0].id)
        .select();
        console.log(data)
        if(data){
          setIsPostUserComplete(true);
        }
        }
    } catch (error) {
        console.log(error)
    }
};

  async function submitOption(){
    const search = selectValue.filter(item => item.value === '');
    if(search.length === 0){
      
      await updateProfile()

    }else{
       toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please Select All the options",
      });
      return null
    }
  };


  return (
    <>
    <div className={`flex flex-col w-full gap-10 items-center box-border ${darkMode ? '' : 'text-white'}`}>
    {!isPostUserComplete ? 
    <>
      <div className='w-full text-center select-none'>
                <h1 className='font-[600] text-[20px]'>Tell us about <span className='text-[#14B8A6]'>yourself</span></h1>
                <p className='text-[12px] leading-[20px] opacity-90 font-[300]'>We’ll customize your folder.chat experience based on your choices</p>
      </div>
      <div className='w-full flex flex-col gap-5 select-none'>
        {selectOptions.map(item => <SelectCard key={item.id} title={item.title} id={item.id} className='select-none'/>)}
      </div>
      <div className='w-full select-none'>

      <Button variant="outline" className={`w-full text-sm font-[400] bg-[#14B8A6] border-[#14B8A6] leading-[24px] flex items-center justify-center text-white`} onClick={()=>submitOption()}>Continue</Button>

      <div className={`items-center w-full opacity-60 hover:cursor-pointer text-center mt-4 text-[14px]`} onClick={()=>setIsPostNameComplete(false)}>Back</div>
      </div>
      </>
     :
    <WorkPlace />}
    </div>
    </>
  )
}

export default UserDetails