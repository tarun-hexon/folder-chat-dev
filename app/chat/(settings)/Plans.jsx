import React from 'react'
import Image from 'next/image';
import Plan1 from '../../../public/assets/Plan1.svg';
import Plan2 from '../../../public/assets/Plan2.svg';
import Plan3 from '../../../public/assets/Plan3.svg';
import checkIcon from '../../../public/assets/Use_Checkmark.svg';
import { plans } from '../../../config/constants';
import { Button } from '../../../components/ui/button';
const Plans = () => {
    return (
        <div className='w-full flex flex-col gap-20 py-5'>
            <div className='w-full pt-2 font-Inter flex gap-4 justify-center'>
                <div className='w-[30%]'>

                    <Image src={Plan3} alt='plan-1' className='mb-5 w-32 h-32' />
                    <p className='font-[500] text-[12px] leading-5'>Current plan</p>
                    <h1 className='font-[600] text-[20px] leading-7 tracking-[-0.5%]'>Pro</h1>

                </div>
                <div className='w-[35%] -ml-8 mr-5 flex flex-col gap-1'>
                    <h2 className='font-[500] text-sm leading-6 mb-4'>Includes</h2>

                    {plans.map((plan, idx) => <p key={idx} className='font-[500] text-[12px] leading-5 opacity-[50%] inline-flex'><Image src={checkIcon} alt='check'/>{plan}</p>)}

                </div>
                <div className='w-[30%]'>
                    <h2 className='font-[400] text-sm leading-6 mb-4'><span className='font-[700]'>$18</span> / member / month</h2>
                    <p className='font-[500] text-[12px] leading-5 opacity-[50%]'>Subscription ends in 2 months</p>

                </div>
                
            </div>
            <hr className='w-full'/>
            <div className='w-full pt-2 font-Inter flex gap-4 justify-center'>
                <div className='w-[30%]'>

                    <Image src={Plan2} alt='plan-2' className='mb-5 w-32 h-32' />
                    {/* <p className='font-[500] text-[12px] leading-5'>Plan Name</p> */}
                    <h1 className='font-[600] text-[20px] leading-7 tracking-[-0.5%]'>Home</h1>

                </div>
                <div className='w-[35%] -ml-8 mr-5 flex flex-col gap-1'>
                    <h2 className='font-[500] text-sm leading-6 mb-4'>Includes</h2>

                    {plans.map((plan, idx) => <p key={idx} className='font-[500] text-[12px] leading-5 opacity-[50%] inline-flex'><Image src={checkIcon} alt='check'/>{plan}</p>)}


                </div>
                <div className='w-[30%]'>
                    <h2 className='font-[400] text-sm leading-6 mb-4'><span className='font-[700]'>$0</span> / member / month</h2>
                    <Button variant={'outline'} className='bg-[#14B8A6] text-[#ffffff]'>Purchase</Button>

                </div>
            </div>
            <div className='w-full pt-2 font-Inter flex gap-4 justify-center'>
                <div className='w-[30%]'>

                    <Image src={Plan1} alt='plan-2' className='mb-5 w-32 h-32' />
                    {/* <p className='font-[500] text-[12px] leading-5'>Plan Name</p> */}
                    <h1 className='font-[600] text-[20px] leading-7 tracking-[-0.5%]'>Enterprize</h1>

                </div>
                <div className='w-[35%] -ml-8 mr-5 flex flex-col gap-1'>
                    <h2 className='font-[500] text-sm leading-6 mb-4'>Includes</h2>

                    {plans.map((plan, idx) => <p key={idx} className='font-[500] text-[12px] leading-5 opacity-[50%] inline-flex'><Image src={checkIcon} alt='check'/>{plan}</p>)}


                </div>
                <div className='w-[30%]'>
                    <h2 className='font-[400] text-sm leading-6 mb-4'><span className='font-[700]'>$0</span> / member / month</h2>
                    
                    <Button variant={'outline'} className='bg-[#14B8A6] text-[#ffffff]'>Purchase</Button>
                </div>
            </div>
        </div>

    )
}

export default Plans