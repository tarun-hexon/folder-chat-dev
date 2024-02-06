import { useEffect } from 'react';
import ChatAuth from './chatAuth';

export default async function RootLayout({ children }) {
    async function getWorkSpace(){
        const res = await fetch('/api/workspace/list-workspace');
        
    }

    useEffect(()=> {
        getWorkSpace()
    }, [])

return await ChatAuth({children})
}
