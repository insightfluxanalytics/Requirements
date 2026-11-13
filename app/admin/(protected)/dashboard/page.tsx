import Link from "next/link"
import { requireAdmin } from "@/lib/supabase/server"
export const dynamic="force-dynamic"
export default async function D(){
 const s=await requireAdmin()
 const [a,b,r]=await Promise.all([s.from("submissions").select("*",{count:"exact",head:true}),s.from("products").select("*",{count:"exact",head:true}),
  s.from("submissions").select("id,ref,created_at,organizations(name,founder_name),products(count)").order("created_at",{ascending:false}).limit(8)])
 return <div className="space-y-8"><h1 className="font-serif text-4xl text-forest-deep">Dashboard</h1>
 <div className="grid gap-4 sm:grid-cols-2">{[["Client submissions",a.count],["Products submitted",b.count]].map(([l,n]:any)=><div key={l} className="card p-6"><p className="text-sm text-forest-deep/70">{l}</p><p className="font-serif text-5xl text-forest">{n??0}</p></div>)}</div>
 <section className="card p-6"><div className="mb-3 flex justify-between"><h2 className="font-serif text-2xl text-forest-deep">Recent submissions</h2><Link className="text-forest underline" href="/admin/submissions">View all</Link></div>
 {!r.data?.length?<p className="text-forest-deep/70">No submissions yet. They appear here as soon as a client submits the form.</p>:<ul className="divide-y divide-beige-dark">{r.data.map((x:any)=><li key={x.id}><Link href={`/admin/submissions/${x.id}`} className="flex flex-wrap justify-between gap-2 py-3 hover:text-forest"><span className="font-medium">{x.organizations?.name}</span><span className="font-mono text-sm">{x.ref}</span><span className="text-sm text-forest-deep/70">{new Date(x.created_at).toLocaleString("en-IN")}</span></Link></li>)}</ul>}</section></div>}
