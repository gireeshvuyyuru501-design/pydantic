const API_URL = "http://127.0.0.1:8001";


export async function getVendors(){

    const res = await fetch(
        `${API_URL}/procurement/vendors`
    );

    return await res.json();

}



export async function createVendor(data:any){
    const res = await fetch(
        `${API_URL}/procurement/vendors`,
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        }
    );


    return await res.json();

}



export async function getRequests(){

    const res = await fetch(
        `${API_URL}/procurement/requests`
    );

    return await res.json();

}



export async function approveRequest(id:number){

    const res = await fetch(
        `${API_URL}/procurement/requests/${id}/approve`,
        {
            method:"POST"
        }
    );

    return await res.json();

}