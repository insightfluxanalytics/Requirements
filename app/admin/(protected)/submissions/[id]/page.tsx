import { notFound } from "next/navigation"
import Link from "next/link"
import { requireAdmin } from "@/lib/supabase/server"
import { STEPS, TABLE } from "@/lib/form"
import PrintButton from "@/components/PrintButton"
export const dynamic="force-dynamic"
export default async function Detail({params}:{params:{id:string}}){
 const s=await requireAdmin()
 const {data:x}=await s.from("submissions").select("*,organizations(*),contacts(*),website_requirements(*),payment_requirements(*),delivery_requirements(*),design_preferences(*),technical_requirements(*),products(*,product_images(*))").eq("id",params.id).maybeSingle()
 if(!x)notFound()
 const rec:any={organizations:x.organizations,contacts:x.contacts,website:x.website_requirements,payment:x.payment_requirements,delivery:x.delivery_requirements,design:x.design_preferences,technical:x.technical_requirements,submission:x}
 const prods=[...(x.products||[])].sort((a:any,b:any)=>a.position-b.position)
 const paths=[x.organizations.logo_path,...prods.flatMap((p:any)=>p.product_images.map((i:any)=>i.path))].filter(Boolean)
 const [pv,dl]=paths.length?await Promise.all([s.storage.from("submissions").createSignedUrls(paths,3600),s.storage.from("submissions").createSignedUrls(paths,3600,{download:true})]):[{data:[]},{data:[]}]
 const url=(p:string,d?:boolean)=>((d?dl:pv).data||[]).find((u:any)=>u.path===p)?.signedUrl
 const Img=({p}:{p:string})=><div><a href={url(p)} target="_blank"><img src={url(p)} alt="" className="h-28 w-28 rounded-xl object-cover"/></a><a className="noprint text-xs text-forest underline" href={url(p,true)}>Download</a></div>
 const fmt=(v:any)=>Array.isArray(v)?v.join(", "):v
 return <div className="space-y-6">
 <div className="noprint"><Link href="/admin/submissions" className="text-sm text-forest underline">All submissions</Link></div>
 <div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="font-serif text-4xl text-forest-deep">{x.organizations.name}</h1><p className="mt-1 font-mono text-forest">{x.ref}</p><p className="text-sm text-forest-deep/70">Submitted {new Date(x.created_at).toLocaleString("en-IN")}</p></div><PrintButton/></div>
 {x.organizations.logo_path&&<div className="card p-5"><p className="lbl">Company logo</p><Img p={x.organizations.logo_path}/></div>}
 {STEPS.map((st,n)=>n===2?<section key={n} className="card p-6"><h2 className="mb-4 font-serif text-2xl text-forest-deep">Products ({prods.length})</h2><div className="space-y-5">{prods.map((p:any)=><div key={p.id} className="rounded-2xl border border-beige-dark p-4 [break-inside:avoid]"><h3 className="font-medium text-forest-deep">{p.name}</h3>
  <p className="text-sm text-forest-deep/80">{[p.category,p.weight_size,p.variants,p.stock,p.sku&&`SKU ${p.sku}`].filter(Boolean).join(" · ")}</p>
  <p className="text-sm">{p.original_price!=null&&<s className="mr-2 text-forest-deep/50">₹{p.original_price}</s>}<b>₹{p.selling_price}</b>{p.discount_pct!=null&&` (${p.discount_pct}% off)`}</p>
  {p.description&&<p className="mt-2 text-sm">{p.description}</p>}
  <div className="mt-3 flex flex-wrap gap-3">{p.product_images.map((i:any)=><Img key={i.id} p={i.path}/>)}</div></div>)}</div></section>
 :<section key={n} className="card p-6 [break-inside:avoid]"><h2 className="mb-3 font-serif text-2xl text-forest-deep">{st.title}</h2><dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">{st.fields.filter(f=>f.t!=="logo").map(f=>{const v=fmt(rec[f.g]?.[f.k]);return <div key={f.g+f.k}><dt className="text-forest-deep/60">{f.l}</dt><dd>{v||"–"}</dd></div>})}</dl></section>)}</div>}
