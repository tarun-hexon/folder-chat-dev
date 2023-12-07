'use client'
import { useAtom } from 'jotai'
import React from 'react'
import { darkModeAtom, isPostNameCompleteAtom, isPostUserCompleteAtom } from '../store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import { Button } from '../../components/ui/button'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { useRouter } from 'next/navigation'



const SelectCard = (props) => {
  return (
    <div className='w-full flex flex-col text-start gap-1'>
      <label htmlFor="option1" className='text-[14px] leading-[20px] font-[400] opacity-[50%]'>{props.title}</label>
      <Select id="option1">
        <SelectTrigger className="w-full text-black flex justify-between">
          <SelectValue placeholder="Select a option" className='font-[400] text-[12px] leading-[20px]'/>
        </SelectTrigger>
        <SelectContent className="w-[382px] ">
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
  const router = useRouter()
  return (
    <div className={`flex flex-col w-96 gap-5 items-center box-border ${darkMode ? '' : 'text-white'}`}>
      <div className='w-[90%] text-center mb-5'>
        <h1 className='font-[600] text-[20px] leading-[28px]'>Create a workplace</h1>
        <p className='font-[400] text-[12px] leading-[28px]'>Fill in some details</p>
      </div>
      <div className='w-full text-start space-y-2'>
        <Label htmlFor="workplace" className='text-[14px] leading-[20px] font-[500]'>Workplace name</Label>
        <Input type='text' id="workplace" placeholder='Type workplace name' className='text-black'/>
        <p className='font-[400] text-[14px] leading-[20px]'>The name of your company or organization</p>
      </div>
      <Button variant="outline" className={`w-full text-sm font-[400] bg-[#14B8A6] border-[#14B8A6] leading-[24px] flex items-center justify-center text-white`} onClick={()=> router.push('/')}>Continue</Button>
    </div>
  )
}
const UserDetails = () => {

  const selectOptions = [
    {
      title: 'What kind of work you do?'
    },
    {
      title: 'What is your role?'
    },
    {
      title: 'Roughly how many people work at your company?'
    },
    {
      title: 'What are you planning to use folder.chat for?'
    }
  ]

  const [darkMode] = useAtom(darkModeAtom);
  const [isPostUserComplete, setIsPostUserComplete] = useAtom(isPostUserCompleteAtom);
  const [isPostNameComplete, setIsPostNameComplete] = useAtom(isPostNameCompleteAtom);

  return (
    <>
    <div className={`flex flex-col w-96 gap-10 items-center box-border ${darkMode ? '' : 'text-white'}`}>
    {!isPostUserComplete ? 
    <>
      <div className='w-full text-center'>
                <h1 className='font-[600] text-[20px]'>Tell us about <span className='text-[#14B8A6]'>yourself</span></h1>
                <p className='text-[12px] leading-[20px] opacity-90 font-[300]'>We’ll customize your folder.chat experience based on your choices</p>
      </div>
      <div className='w-full flex flex-col gap-5'>
        {selectOptions.map(item => <SelectCard key={item.title} title={item.title} />)}
      </div>
      <div className='w-full'>

      <Button variant="outline" className={`w-full text-sm font-[400] bg-[#14B8A6] border-[#14B8A6] leading-[24px] flex items-center justify-center text-white`} onClick={()=>setIsPostUserComplete(true)}>Continue</Button>

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