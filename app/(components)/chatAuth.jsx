import { SideBar } from './(common)';
import {
    getAuthTypeMetadataSS,
    getCurrentUserSS,
} from "../../lib/userSS";
import { redirect } from "next/navigation";

export default async function ChatAuth({ children }) {
    const darkMode = true

    
    let authTypeMetadata = null;
    let currentUser = null;

    try {
        [authTypeMetadata, currentUser] = await Promise.all([
            getAuthTypeMetadataSS(),
            getCurrentUserSS(),
        ]);
        // console.log(authTypeMetadata)
    } catch (e) {
        console.log(`Some fetch failed for the login page - ${e}`);
    }
    if (!currentUser) {
        return redirect("/auth/login");
    }
    async function getWorkSpace(){
        const res = await fetch('/api/workspace/list-workspace');
        const json = await res.json()
        return json.data
    }

    const workSpaces = getWorkSpace();
    if(!workSpaces){
        redirect('/workspace/new')
    }
    return (
        <div className='w-full flex font-Inter box-border'>
            <div className={`w-[28%] min-h-screen sticky top-0 self-start`}>
                <SideBar />
            </div>
            <div className='w-full sticky top-0 self-start'>
                {children}
            </div>
        </div>
    )
}
