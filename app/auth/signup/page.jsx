
import { Signup } from '../../(components)/(common)/index'
import { useRouter } from 'next/navigation';
import {
  getCurrentUserSS,
  getAuthUrlSS,
  getAuthTypeMetadataSS,
} from "../../../lib/userSS";
import { redirect } from 'next/navigation';


const Page = async (
  searchParams) => {
  const autoRedirectDisabled = searchParams?.disableAutoRedirect === "true";

  let authTypeMetadata = null;
  let currentUser = null;

  try {
    [authTypeMetadata, currentUser] = await Promise.all([
      getAuthTypeMetadataSS(),
      getCurrentUserSS(),
    ]);
    // console.log(authTypeMetadata, currentUser)
  } catch (e) {
    console.log(`Some fetch failed for the login page - ${e}`);
  }
  console.log('user', currentUser)

  if (authTypeMetadata?.authType === "disabled") {
    return redirect("/");
  }

  if (currentUser && currentUser.is_active) {
    if (authTypeMetadata?.requiresVerification && !currentUser.is_verified) {
      return redirect("/auth/waiting-on-verification");
    }

    return redirect("/chat/new");
  }

  // get where to send the user to authenticate
  let authUrl = null;
  if (authTypeMetadata) {
    try {
      authUrl = await getAuthUrlSS(authTypeMetadata.authType);
    } catch (e) {
      console.log(`Some fetch failed for the login page - ${e}`);
    }
  }

  if (authTypeMetadata?.autoRedirect && authUrl && !autoRedirectDisabled) {
    return redirect(authUrl);
  }


  return (
    <Signup 
    isSignup
    shouldVerify={authTypeMetadata?.requiresVerification}
    />
   
  )
}

export default Page