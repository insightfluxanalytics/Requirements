"use client"
import { useState, useMemo } from "react"
import { STEPS, PRODUCT_FIELDS, F } from "@/lib/form"
type P={[k:string]:any;files:File[]}
const blank=():P=>({files:[]})
const val=(d:any,f:F)=>d[f.g]?.[f.k]
const Field=({f,v,on}:{f:F;v:any;on:(x:any)=>void})=>{
 const id=`${f.g}-${f.k}`
 if(f.t==="multi") return <fieldset className="sm:col-span-2"><legend className="lbl">{f.l}</legend><div className="grid gap-2 sm:grid-cols-2">{f.o!.map(o=>{const a:string[]=v||[];const c=a.includes(o);return <label key={o} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 text-[15px] transition ${c?"border-forest bg-forest-mist":"border-beige-dark bg-white"}`}><input type="checkbox" className="accent-[#2c5a3a]" checked={c} onChange={()=>on(c?a.filter(x=>x!==o):[...a,o])}/>{o}</label>})}</div></fieldset>
 return <div className={f.t==="textarea"?"sm:col-span-2":""}><label htmlFor={id} className="lbl">{f.l}{f.r&&<span className="text-red-700"> *</span>}</label>
 {f.t==="textarea"?<textarea id={id} rows={3} className="input" value={v||""} onChange={e=>on(e.target.value)}/>
 :f.t==="select"?<select id={id} className="input" value={v||""} onChange={e=>on(e.target.value)}><option value="">Select</option>{f.o!.map(o=><option key={o}>{o}</option>)}</select>
 :<input id={id} type={f.t||"text"} className="input" value={v||""} onChange={e=>on(e.target.value)}/>}</div>}
const Files=({files,on,multi,label}:{files:File[];on:(f:File[])=>void;multi?:boolean;label:string})=>{
 const urls=useMemo(()=>files.map(f=>URL.createObjectURL(f)),[files])
 return <div className="sm:col-span-2"><span className="lbl">{label}</span>
 <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-forest/40 bg-beige/50 px-4 py-6 text-sm text-forest transition hover:bg-forest-mist">Choose {multi?"images":"an image"} (JPG, PNG or WebP, up to 5 MB each)
 <input type="file" hidden accept="image/jpeg,image/png,image/webp" multiple={multi} onChange={e=>{const n=Array.from(e.target.files||[]);on(multi?[...files,...n]:n.slice(0,1));e.target.value=""}}/></label>
 {!!files.length&&<div className="mt-3 flex flex-wrap gap-3">{urls.map((u,i)=><div key={u} className="relative"><img src={u} alt="" className="h-20 w-20 rounded-xl object-cover"/><button type="button" aria-label="Remove image" onClick={()=>on(files.filter((_,j)=>j!==i))} className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-forest-deep text-xs text-white">×</button></div>)}</div>}</div>}
export default function Wizard(){
 const [i,setI]=useState(0),[d,setD]=useState<any>({}),[prods,setProds]=useState<P[]>([blank()]),[logo,setLogo]=useState<File[]>([])
 const [err,setErr]=useState<Record<string,string>>({}),[busy,setBusy]=useState(false),[done,setDone]=useState<string>(""),[fail,setFail]=useState(""),[hp,setHp]=useState("")
 const total=STEPS.length+1,last=i===total-1,pct=Math.round(((i+1)/total)*100)
 const set=(f:F,x:any)=>setD((p:any)=>({...p,[f.g]:{...p[f.g],[f.k]:x}}))
 const setP=(n:number,k:string,x:any)=>setProds(ps=>ps.map((p,j)=>{if(j!==n)return p;const q={...p,[k]:x};const o=parseFloat(q.original_price),s=parseFloat(q.selling_price);q.discount_pct=o>0&&s>=0&&s<=o?Math.round(((o-s)/o)*1000)/10:"";return q}))
 function validate(n:number){
  const e:Record<string,string>={}
  if(n===2){prods.forEach((p,j)=>{if(!p.name?.trim())e[`p${j}name`]="Product name is required";if(p.selling_price===undefined||p.selling_price==="")e[`p${j}selling_price`]="Selling price is required"})}
  else STEPS[n]?.fields.forEach(f=>{const v=val(d,f);if(f.r&&!String(v||"").trim())e[`${f.g}${f.k}`]=`${f.l} is required`
   else if(v&&f.t==="email"&&!/^\S+@\S+\.\S+$/.test(v))e[`${f.g}${f.k}`]="Enter a valid email address"
   else if(v&&f.t==="tel"&&String(v).replace(/\D/g,"").length<10)e[`${f.g}${f.k}`]="Enter a valid phone number"})
  setErr(e);return !Object.keys(e).length}
 const next=()=>{if(validate(i)){setI(i+1);window.scrollTo({top:document.getElementById("start")!.offsetTop-8,behavior:"smooth"})}}
 const jump=(n:number)=>{for(let k=0;k<n;k++)if(!validate(k)){setI(k);return}setI(n)}
 async function submit(){
  for(let k=0;k<STEPS.length;k++)if(!validate(k)){setI(k);return}
  setBusy(true);setFail("")
  const fd=new FormData();fd.set("hp",hp)
  fd.set("payload",JSON.stringify({data:d,products:prods.map(({files,...p})=>p)}))
  if(logo[0])fd.set("logo",logo[0]);prods.forEach((p,j)=>p.files.forEach(f=>fd.append(`img_${j}`,f)))
  try{const r=await fetch("/api/submit",{method:"POST",body:fd});const j=await r.json();if(!r.ok)throw new Error(j.error||"Submission failed");setDone(j.ref)}
  catch(x:any){setFail(x.message)}finally{setBusy(false)}}
 if(done)return <div className="card p-10 text-center"><h2 className="font-serif text-3xl text-forest-deep">Thank you. We have your requirements.</h2><p className="mt-3">Your submission ID is</p><p className="mt-1 font-mono text-2xl text-forest">{done}</p><p className="mt-4 text-sm text-forest-deep/70">Keep this ID for reference. The InsightFlux team will be in touch soon.</p></div>
 const E=({k}:{k:string})=>err[k]?<p role="alert" className="mt-1 text-sm text-red-700">{err[k]}</p>:null
 return <div className="card p-5 sm:p-9">
  <div className="mb-2 flex items-center justify-between text-sm text-forest-deep/80"><span>Step {i+1} of {total}: {last?"Review":STEPS[i].title}</span><span>{pct}% complete</span></div>
  <div className="h-2 overflow-hidden rounded-full bg-beige-dark" role="progressbar" aria-valuenow={pct}><div className="h-full rounded-full bg-forest transition-all duration-500" style={{width:`${pct}%`}}/></div>
  <div key={i} className="step-in mt-8">
  <h2 className="font-serif text-3xl text-forest-deep">{last?"Review your details":STEPS[i].title}</h2>
  <p className="mb-6 mt-1 text-forest-deep/70">{last?"Check everything, then submit.":STEPS[i].hint}</p>
  {i===2?<div className="space-y-5">{prods.map((p,j)=><div key={j} className="rounded-2xl border border-beige-dark bg-beige/40 p-5">
    <div className="mb-4 flex items-center justify-between"><h3 className="font-serif text-xl text-forest-deep">Product {j+1}</h3>{prods.length>1&&<button type="button" className="text-sm text-red-700 underline" onClick={()=>setProds(ps=>ps.filter((_,k)=>k!==j))}>Remove product</button>}</div>
    <div className="grid gap-4 sm:grid-cols-2">{PRODUCT_FIELDS.map(f=><div key={f.k} className={f.t==="textarea"?"sm:col-span-2":""}><Field f={f} v={p[f.k]} on={x=>setP(j,f.k,x)}/><E k={`p${j}${f.k}`}/></div>)}
    <div><label className="lbl">Discount (%)</label><input className="input bg-beige/60" readOnly value={p.discount_pct??""} placeholder="Calculated automatically"/></div>
    <Files label="Product images" multi files={p.files} on={f=>setP(j,"files",f)}/></div></div>)}
   <button type="button" className="btn-ghost" onClick={()=>setProds(p=>[...p,blank()])}>Add Another Product</button></div>
  :last?<div className="space-y-5">{STEPS.map((s,n)=><div key={n} className="rounded-2xl border border-beige-dark p-5"><div className="mb-2 flex justify-between"><h3 className="font-serif text-lg text-forest-deep">{s.title}</h3><button className="text-sm text-forest underline" onClick={()=>setI(n)}>Edit</button></div>
    {n===2?prods.map((p,j)=><p key={j} className="text-sm">{p.name||"Unnamed"} · ₹{p.selling_price||"–"} · {p.files.length} image(s)</p>)
    :<dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">{s.fields.filter(f=>f.t!=="logo").map(f=>{const v=val(d,f);return v&&(v.length)?<div key={f.g+f.k}><dt className="text-forest-deep/60">{f.l}</dt><dd className="mb-2">{Array.isArray(v)?v.join(", "):v}</dd></div>:null})}</dl>}</div>)}
   <input tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={hp} onChange={e=>setHp(e.target.value)} name="website_hp"/>
   {fail&&<p role="alert" className="text-red-700">{fail}</p>}</div>
  :<div className="grid gap-4 sm:grid-cols-2">{STEPS[i].fields.map(f=>f.t==="logo"?<Files key="logo" label={f.l} files={logo} on={setLogo}/>:<div key={f.g+f.k} className={f.t==="multi"||f.t==="textarea"?"sm:col-span-2":""}><Field f={f} v={val(d,f)} on={x=>set(f,x)}/><E k={`${f.g}${f.k}`}/></div>)}</div>}
  </div>
  <div className="mt-8 flex justify-between"><button className="btn-ghost" disabled={i===0} onClick={()=>setI(i-1)}>Previous</button>
   {last?<button className="btn" disabled={busy} onClick={submit}>{busy?"Submitting…":"Submit requirements"}</button>:<button className="btn" onClick={next}>{i===total-2?"Review":"Next"}</button>}</div></div>}
