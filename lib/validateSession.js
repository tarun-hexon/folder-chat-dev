import {
    getCurrentUserSS,
    getAuthTypeMetadataSS,
} from "./userSS";
import { redirect } from "next/navigation";
export default async function validateSession(path){
    let authTypeMetadata = null;
    let currentUser = null;
    try {
        [authTypeMetadata, currentUser] = await Promise.all([
            getAuthTypeMetadataSS(),
            getCurrentUserSS(),
        ]);
    } catch (e) {
        console.log(`Some fetch failed for the login page - ${e}`);
    }
    // simply take the user to the home page if Auth is disabled
    if (authTypeMetadata?.authType === "disabled") {
        return redirect("/");
    }
    if (currentUser && currentUser.is_active) {
        return redirect(path);
    }
    if (currentUser && currentUser.is_active) {
        return redirect(path);
    }
}