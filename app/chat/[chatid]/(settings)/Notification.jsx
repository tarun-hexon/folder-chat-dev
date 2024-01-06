import React, { useState } from 'react'
import { Switch } from '../../../../components/ui/switch'
const Notification = () => {
    const [switchValues, setSwitchValues] = useState({
        pushNoti: true,
        emailNoti: true,
        emailUpdates: false
    })
    return (
        <div className='w-full py-5 font-Inter flex flex-col'>
            <div className='flex flex-col gap-6'>
                <h2 className='font-[600] text-[18px] leading-7'>Management</h2>
                <div className='w-full flex justify-between items-center'>
                    <div className='font-[400] text-sm leading-6'>
                        <p className='opacity-[50%]'>Mobile push notifications</p>
                        <p className='font-[500]'>Receive push notifications</p>
                    </div>
                    <Switch id='push-notification' checked={switchValues.pushNoti} onCheckedChange={() => setSwitchValues({
                        ...switchValues,
                        pushNoti: !switchValues.pushNoti
                    })} />
                </div>
                <div className='w-full flex justify-between items-center'>
                    <div className='font-[400] text-sm leading-6'>
                        <p className='opacity-[50%]'>Email notifications</p>
                        <p className='font-[500]'>Receive email updates</p>
                    </div>
                    <Switch id='email-notification' checked={switchValues.emailNoti} onCheckedChange={() => setSwitchValues({
                        ...switchValues,
                        emailNoti: !switchValues.emailNoti
                    })} />
                </div>
                <div className='w-full flex justify-between items-center'>
                    <div className='font-[400] text-sm leading-6'>
                        <p className='opacity-[50%]'>Always send email notifications</p>
                        <p className='font-[500]'>Receive updates by email, even when you’re active on the app</p>
                    </div>
                    <Switch id='email-updates' checked={switchValues.emailUpdates} onCheckedChange={() => setSwitchValues({
                        ...switchValues,
                        emailUpdates: !switchValues.emailUpdates
                    })} />
                </div>

            </div>
        </div>
    )
}

export default Notification