import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
const URL_=process.env.NEXT_PUBLIC_SUPABASE_URL!, ANON=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export function sb(){const c=cookies();return createServerClient(URL_,ANON,{cookies:{getAll:()=>c.getAll(),setAll(l){try{l.forEach(({name,value,options})=>c.set(name,value,options))}catch{}}}})}
// Service-role client: server-only, used for public form inserts and login throttling.
export const svc=()=>createClient(URL_,process.env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{persistSession:false}})
// Verified on every protected page/route; returns a user-scoped client so RLS also applies.
export async function requireAdmin(){
  const s=sb();const {data:{user}}=await s.auth.getUser()
  if(!user) redirect("/admin/login")
  const {data}=await s.rpc("is_admin")
  if(!data) redirect("/admin/login")
  return s
}
