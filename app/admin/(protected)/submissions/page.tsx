import Link from "next/link"
import { requireAdmin } from "@/lib/supabase/server"
export const dynamic="force-dynamic"
export default async function S({searchParams}:{searchParams:{q?:string;from?:string;to?:string}}){
 const s=await requireAdmin(),q=(searchParams.q||"").replace(/[^\w\s@.-]/g,"").trim()
 let query=s.from("submissions").select("id,ref,created_at,status,organizations(name,founder_name,category),contacts(email,mobile),products(count)").order("created_at",{ascending:false}).limit(200)
 if(searchParams.from)query=query.gte("created_at",searchParams.from);if(searchParams.to)query=query.lte("created_at",searchParams.to+"T23:59:59")
 if(q){const [o,c]=await Promise.all([s.from("organizations").select("id").or(`name.ilike.%${q}%,founder_name.ilike.%${q}%`),s.from("contacts").select("submission_id").or(`email.ilike.%${q}%,mobile.ilike.%${q}%`)])
  const oi=(o.data||[]).map(x=>x.id),si=(c.data||[]).map(x=>x.submission_id)
  query=query.or([`ref.ilike.%${q}%`,oi.length&&`organization_id.in.(${oi})`,si.length&&`id.in.(${si})`].filter(Boolean).join(","))}
 const {data}=await query
 return <div className="space-y-6"><div className="flex flex-wrap items-end justify-between gap-3"><h1 className="font-serif text-4xl text-forest-deep">Submissions</h1><a className="btn" href="/api/admin/export">Export to Excel</a></div>
 <form className="card flex flex-wrap gap-3 p-4"><input name="q" defaultValue={q} placeholder="Search name, founder, email, mobile or ID" className="input min-w-[16rem] flex-1"/><input type="date" name="from" defaultValue={searchParams.from} className="input w-auto" aria-label="From date"/><input type="date" name="to" defaultValue={searchParams.to} className="input w-auto" aria-label="To date"/><button className="btn">Search</button></form>
 <div className="card overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-forest-mist text-forest-deep"><tr>{["Submission ID","Organization","Founder","Email","Products","Submitted"].map(h=><th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead><tbody>
 {(data||[]).map((x:any)=><tr key={x.id} className="border-t border-beige-dark hover:bg-beige/50"><td className="px-4 py-3 font-mono"><Link className="text-forest underline" href={`/admin/submissions/${x.id}`}>{x.ref}</Link></td><td className="px-4 py-3">{x.organizations?.name}</td><td className="px-4 py-3">{x.organizations?.founder_name}</td><td className="px-4 py-3">{x.contacts?.email}</td><td className="px-4 py-3">{x.products?.[0]?.count}</td><td className="px-4 py-3">{new Date(x.created_at).toLocaleDateString("en-IN")}</td></tr>)}
 {!data?.length&&<tr><td colSpan={6} className="px-4 py-8 text-center text-forest-deep/70">No submissions match. Clear the search to see all.</td></tr>}</tbody></table></div></div>}
