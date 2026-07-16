const API_URL = "http://127.0.0.1:8001";

const token =
"YOUR_BEARER_TOKEN_HERE";


async function request(endpoint:string, options:any={}) {

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`,
                ...options.headers
            }
        }
    );

    return response.json();
}


export const procurementAPI = {

    getVendors(){
        return request("/procurement/vendors");
    },


    createRequest(data:any){

        return request(
            "/procurement/requests",
            {
                method:"POST",
                body:JSON.stringify(data)
            }
        );

    },


    approveRequest(id:number){

        return request(
            `/procurement/requests/${id}/approve`,
            {
                method:"POST"
            }
        );

    },


    getInsights(id:number){

        return request(
            `/procurement/insights/${id}`
        );

    }

};