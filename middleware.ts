import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
const IDLE=30*60*1000
export async function middleware(req:NextRequest){
  if(req.nextUrl.pathname==="/admin/login") return NextResponse.next()
  let res=NextResponse.next({request:req})
  const s=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{cookies:{getAll:()=>req.cookies.getAll(),setAll(l){l.forEach(({name,value})=>req.cookies.set(name,value));res=NextResponse.next({request:req});l.forEach(({name,value,options})=>res.cookies.set(name,value,options))}}})
  const {data:{user}}=await s.auth.getUser()
  const last=Number(req.cookies.get("ifx_last")?.value||0)
  if(!user||(last&&Date.now()-last>IDLE)){
    if(user) await s.auth.signOut()
    const r=NextResponse.redirect(new URL("/admin/login",req.url))
    res.cookies.getAll().forEach(c=>r.cookies.set(c))
    r.cookies.delete("ifx_last");return r}
  res.cookies.set("ifx_last",String(Date.now()),{httpOnly:true,sameSite:"lax",path:"/",secure:process.env.NODE_ENV==="production"})
  return res
}
export const config={matcher:["/admin/:path*"]}
