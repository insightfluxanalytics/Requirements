"use server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { createHash, timingSafeEqual } from "crypto"
import { sb, svc } from "@/lib/supabase/server"
const h=(s:string)=>createHash("sha256").update(s).digest()
export async function login(_:any,fd:FormData){
 const ip=headers().get("x-forwarded-for")?.split(",")[0].trim()||"unknown",db=svc()
 const since=new Date(Date.now()-15*60e3).toISOString()
 const {count}=await db.from("login_attempts").select("*",{count:"exact",head:true}).eq("ip",ip).gte("created_at",since)
 if((count||0)>=5)return {error:"Too many attempts. Try again in 15 minutes."}
 const fail=async()=>{await db.from("login_attempts").insert({ip});return {error:"Invalid credentials."}}
 const u=String(fd.get("username")||"").trim(),p=String(fd.get("password")||"")
 if(!process.env.ADMIN_USERNAME||!process.env.ADMIN_EMAIL||!timingSafeEqual(h(u),h(process.env.ADMIN_USERNAME)))return fail()
 const s=sb();const {error}=await s.auth.signInWithPassword({email:process.env.ADMIN_EMAIL,password:p})
 if(error)return fail()
 const {data:ok}=await s.rpc("is_admin");if(!ok){await s.auth.signOut();return fail()}
 await db.from("login_attempts").delete().eq("ip",ip)
 redirect("/admin/dashboard")
}
export async function logout(){await sb().auth.signOut();redirect("/admin/login")}
