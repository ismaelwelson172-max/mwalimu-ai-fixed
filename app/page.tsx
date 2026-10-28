"use client"
import { useState } from "react"

export default function Home(){
  const [q,setQ]=useState("")
  const [a,setA]=useState("")
  const [loading,setLoading]=useState(false)
  async function ask(){
    if(!q.trim()) return
    setLoading(true); setA("")
    try{
      const res=await fetch("/api/answer",{method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({question:q, subject:"Mathematics"})})
      const data=await res.json()
      if(data.error) setA("Error: "+data.error)
      else setA(data.answer || JSON.stringify(data))
    }catch(e:any){ setA("Error: "+e.message) }
    setLoading(false)
  }
  return (
    <main style={{maxWidth:700, margin:"40px auto", padding:20}}>
      <h1 style={{fontSize:32, fontWeight:800}}>Mwalimu AI - Homework Helper</h1>
      <p>Uliza swali lolote la shule</p>
      <textarea value={q} onChange={e=>setQ(e.target.value)} placeholder="Andika swali hapa... eg: Solve 2x+5=15" style={{width:"100%", height:120, padding:12, marginTop:16, border:"1px solid #ccc", borderRadius:8}}/>
      <button onClick={ask} disabled={loading} style={{marginTop:12, padding:"12px 20px", background:"black", color:"white", borderRadius:8, width:"100%"}}>{loading?"Inatafuta...":"Uliza Mwalimu"}</button>
      {a && <div style={{marginTop:20, padding:16, background:"#f5f5f5", borderRadius:8, whiteSpace:"pre-wrap"}}>{a}</div>}
    </main>
  )
}
