export async function getCredentials(accessToken) {
    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/credential`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify({
                "credential_json": {
                    "github_access_token": accessToken
                },
                "admin_public": true
            })
        });
        const json = await data.json();
        return json.id
    } catch (error) {
        throw error
    }
};


export async function connectorRequest(baseURL) {
    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/admin/connector`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "name": `WebConnector-${baseURL}`,
                "source": "web",
                "input_type": "load_state",
                "connector_specific_config": {
                    "base_url": baseURL
                },
                "refresh_freq": 86400,
                "disabled": false
            })
        }
            
        );
        const json = await data.json();
        return json.id
        
        
    } catch (error) {
        throw error
    }        
};


export async function sendURL(connectorId, credentialID, baseURL){
    console.log(connectorId, credentialID)
    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_INTEGRATION_IP}/api/manage/connector/${connectorId}/credential/${credentialID}`, {
        method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({'name':baseURL})
        });
        const json = await data.json();
       return json
    } catch (error) {
        throw error
        
    }
}