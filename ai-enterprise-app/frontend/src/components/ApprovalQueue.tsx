import { useEffect, useState } from "react";


interface Request {
  id: number;
  title: string;
  department: string;
  status: string;
  ai_score: number;
  requested_amount: number;
}


export default function ApprovalQueue() {


  const [requests, setRequests] = useState<Request[]>([]);



  useEffect(() => {

    fetch("http://127.0.0.1:8001/procurement/requests")
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(error => console.log(error));

  }, []);




  const approveRequest = async (id:number) => {

    try {

      const response = await fetch(
        `http://127.0.0.1:8001/procurement/requests/${id}/approve`,
        {
          method:"POST"
        }
      );


      if(!response.ok){
        throw new Error("Approval failed");
      }



      setRequests((prev)=>


        prev.map((r)=>

          r.id === id

          ?
          {
            ...r,
            status:"approved"
          }

          :
          r

        )

      );



      alert("✅ Request Approved Successfully");



    }
    catch(error){

      console.log(error);

      alert("❌ Approval Failed");

    }

  };





return (

<div className="bg-white rounded-xl shadow p-6 mt-8">


<h2 className="text-2xl font-bold mb-5">
Approval Queue
</h2>



<table className="w-full">


<thead>

<tr className="border-b">

<th className="p-3 text-left">
Request
</th>

<th>
Department
</th>

<th>
AI Score
</th>

<th>
Status
</th>

<th>
Action
</th>


</tr>

</thead>




<tbody>


{
requests.map((r)=>(


<tr key={r.id} className="border-b">


<td className="p-3">
{r.title}
</td>


<td>
{r.department}
</td>


<td>
{r.ai_score}
</td>


<td>
{r.status}
</td>


<td>


<button

type="button"

disabled={r.status==="approved"}

onClick={()=>approveRequest(r.id)}

className={`
px-4 py-2 rounded text-white

${
r.status==="approved"
?
"bg-gray-400 cursor-not-allowed"
:
"bg-green-600 hover:bg-green-700"
}

`}

>


{
r.status==="approved"
?
"Approved"
:
"Approve"
}


</button>


</td>


</tr>


))

}


</tbody>


</table>


</div>


);


}