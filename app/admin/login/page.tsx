"use client"
import { useState } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { login } from "../actions"
const Btn=()=>{const {pending}=useFormStatus();return <button className="btn w-full" disabled={pending}>{pending?"Signing in…":"Secure Login"}</button>}
export default function Login(){
 const [st,act]=useFormState(login,null as any),[show,setShow]=useState(false)
 return <main className="grid min-h-screen place-items-center bg-forest-deep px-4"><form action={act} className="card w-full max-w-sm space-y-5 p-8">
  <img src="/logo.jpeg" alt="InsightFlux Analytics" className="mx-auto h-28 w-auto rounded-xl"/>
  <h1 className="text-center font-serif text-3xl text-forest-deep">Admin Portal</h1>
  <div><label className="lbl" htmlFor="u">Username</label><input id="u" name="username" autoComplete="username" required className="input"/></div>
  <div><label className="lbl" htmlFor="p">Password</label><div className="relative"><input id="p" name="password" type={show?"text":"password"} autoComplete="current-password" required className="input pr-16"/>
   <button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-2.5 text-sm text-forest">{show?"Hide":"Show"}</button></div></div>
  {st?.error&&<p role="alert" className="text-sm text-red-700">{st.error}</p>}
  <Btn/></form></main>}
