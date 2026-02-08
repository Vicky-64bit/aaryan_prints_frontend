import { useState } from "react";

export default function CouponForm({ onCreate }){
  const [id,setId]=useState("");
  const [type,setType]=useState("percent");
  const [value,setValue]=useState(10);
  const [from,setFrom]=useState("2025-01-01");
  const [to,setTo]=useState("2025-12-31");
  const [limit,setLimit]=useState(100);
  const handle = ()=>{
    if(!id) return alert('Give ID');
    onCreate({ id, type, value: Number(value), validFrom: from, validTo: to, usageLimit: Number(limit), used:0 });
    setId("");
  };
  return (
    <div className="bg-white text-black p-3 rounded shadow">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <input placeholder="CODE" className="px-2 py-1 border rounded" value={id} onChange={e=>setId(e.target.value)} />
        <select value={type} onChange={e=>setType(e.target.value)} className="px-2 py-1 border rounded"><option value="percent">Percent</option><option value="fixed">Fixed</option></select>
        <input type="number" value={value} onChange={e=>setValue(e.target.value)} className="px-2 py-1 border rounded" />
        <input type="number" value={limit} onChange={e=>setLimit(e.target.value)} className="px-2 py-1 border rounded" />
        <input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="px-2 py-1 border rounded" />
        <input type="date" value={to} onChange={e=>setTo(e.target.value)} className="px-2 py-1 border rounded" />
      </div>
      <div className="mt-2 text-right"><button className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={handle}>Create</button></div>
    </div>
  );
}