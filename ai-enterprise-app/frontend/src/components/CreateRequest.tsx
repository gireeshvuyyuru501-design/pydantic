import { useEffect, useState } from "react";
import VendorManagement from "./VendorManagement";
import ApprovalQueue from "./ApprovalQueue";
import CreateRequest from "./CreateRequest";


interface Vendor {
  id:number;
  name:string;
  category:string;
  score:number;
  lead_time_days:number;
  compliance_status:string;
}


interface Request {
  id:number;
  status:string;
}



export function Dashboard(){


const [vendors,setVendors]=useState<Vendor[]>([]);

const [requests,setRequests]=useState<Request[]>([]);



useEffect(()=>{


fetch("http://127.0.0.1:8001/procurement/vendors")
.then(res=>res.json())
.then(data=>setVendors(data));



fetch("http://127.0.0.1:8001/procurement/requests")
.then(res=>res.json())
.then(data=>setRequests(data));


},[]);




const pendingRequests =
requests.filter(
r=>r.status==="pending"
).length;



const approvedRequests =
requests.filter(
r=>r.status==="approved"
).length;




return(

<div className="min-h-screen bg-gray-100 p-8">


<h1 className="text-4xl font-bold text-blue-700 mb-2">
AI Procurement Workspace
</h1>


<p className="text-gray-600 mb-8">
Manage vendors, approvals, and AI-guided procurement decisions.
</p>




<div className="grid grid-cols-4 gap-6 mb-8">



<div className="bg-white shadow rounded-xl p-6">

<h2>Total Vendors</h2>

<p className="text-3xl font-bold">
{vendors.length}
</p>

</div>




<div className="bg-white shadow rounded-xl p-6">

<h2>Total Requests</h2>

<p className="text-3xl font-bold">
{requests.length}
</p>

</div>





<div className="bg-white shadow rounded-xl p-6">

<h2>Approved</h2>

<p className="text-3xl font-bold text-green-600">
{approvedRequests}
</p>

</div>





<div className="bg-white shadow rounded-xl p-6">

<h2>Pending</h2>

<p className="text-3xl font-bold text-orange-500">
{pendingRequests}
</p>

</div>



</div>





<div className="bg-white rounded-xl shadow p-6">


<h2 className="text-2xl font-bold mb-5">
Vendor Scorecard
</h2>



<table className="w-full">

<thead>

<tr className="border-b">

<th className="text-left p-3">
Vendor
</th>

<th>
Category
</th>

<th>
Score
</th>

<th>
Lead Time
</th>

<th>
Status
</th>

</tr>

</thead>



<tbody>


{vendors.map(v=>(

<tr key={v.id} className="border-b">


<td className="p-3">
{v.name}
</td>


<td>
{v.category}
</td>


<td>
{v.score}
</td>


<td>
{v.lead_time_days} days
</td>


<td className="text-green-600">
{v.compliance_status}
</td>



</tr>


))}



</tbody>


</table>


</div>






<div className="mt-8 bg-white rounded-xl shadow p-6">


<h2 className="text-2xl font-bold">
AI Insights
</h2>


<p className="mt-3 text-lg">

AI Recommendation:
Approve Cloud Infrastructure Purchase with Microsoft

</p>


<p className="mt-3">

Risk:
<span className="text-green-600 font-bold">
 Low
</span>

</p>


<p>

Estimated Savings:
<span className="text-green-600 font-bold">
 $2000
</span>

</p>


</div>





<div className="mt-8">

<CreateRequest/>

</div>



<div className="mt-8">

<VendorManagement/>

</div>



<div className="mt-8">

<ApprovalQueue/>

</div>



</div>


);


}