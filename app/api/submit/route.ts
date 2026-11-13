import { NextResponse } from "next/server"
import { randomBytes, randomUUID } from "crypto"
import { svc } from "@/lib/supabase/server"
import { STEPS, TABLE } from "@/lib/form"
export const runtime="nodejs"
const OK=["image/jpeg","image/png","image/webp"],MAX=5*1024*1024
const clean=(v:any)=>Array.isArray(v)?v.map(String).slice(0,40):(v===undefined||v===null||String(v).trim()===""?null:String(v).slice(0,4000))
const num=(v:any)=>{const n=parseFloat(v);return isFinite(n)&&n>=0?n:null}
const bad=(m:string,s=400)=>NextResponse.json({error:m},{status:s})
export async function POST(req:Request){
 const fd=await req.formData()
 if(fd.get("hp")) return NextResponse.json({ref:"OK"})
 let body:any;try{body=JSON.parse(String(fd.get("payload")))}catch{return bad("Invalid request")}
 const {data,products}=body;const g=(grp:string,k:string)=>data?.[grp]?.[k]
 if(!String(g("organizations","name")||"").trim()||!String(g("organizations","founder_name")||"").trim()||!String(g("contacts","mobile")||"").trim()||!/^\S+@\S+\.\S+$/.test(g("contacts","email")||""))return bad("Please complete all required fields.")
 if(!Array.isArray(products)||!products.length||products.length>500||products.some((p:any)=>!String(p.name||"").trim()))return bad("Each product needs a name.")
 const logo=fd.get("logo") as File|null
 const imgs:File[][]=products.map((_:any,j:number)=>fd.getAll(`img_${j}`) as File[])
 for(const f of [logo,...imgs.flat()]) if(f&&typeof f!=="string"&&(!OK.includes(f.type)||f.size>MAX))return bad("Images must be JPG, PNG or WebP under 5 MB.")
 // whitelist columns from the shared form config
 const cols:Record<string,Record<string,any>>={}
 STEPS.forEach(s=>s.fields.forEach(f=>{if(f.t==="logo")return;(cols[TABLE[f.g]]??={})[f.k]=clean(g(f.g,f.k))}))
 const db=svc(),ref="ALN-"+Date.now().toString(36).toUpperCase()+randomBytes(2).toString("hex").toUpperCase()
 const up=async(f:File)=>{const ext=f.type.split("/")[1];const path=`${ref}/${randomUUID()}.${ext}`;const {error}=await db.storage.from("submissions").upload(path,Buffer.from(await f.arrayBuffer()),{contentType:f.type});if(error)throw error;return path}
 let orgId:string|undefined
 try{
  const logoPath=logo&&typeof logo!=="string"&&logo.size?await up(logo):null
  const {data:org,error:e1}=await db.from("organizations").insert({...cols.organizations,logo_path:logoPath}).select("id").single();if(e1)throw e1;orgId=org.id
  const {data:sub,error:e2}=await db.from("submissions").insert({...cols.submissions,ref,organization_id:orgId}).select("id").single();if(e2)throw e2
  for(const t of ["contacts","website_requirements","payment_requirements","delivery_requirements","design_preferences","technical_requirements"]){
   const row:any={...cols[t],submission_id:sub.id};if(t==="contacts")row.organization_id=orgId
   const {error}=await db.from(t).insert(row);if(error)throw error}
  for(let j=0;j<products.length;j++){const p=products[j]
   const {data:pr,error}=await db.from("products").insert({submission_id:sub.id,organization_id:orgId,position:j,name:clean(p.name),category:clean(p.category),description:clean(p.description),original_price:num(p.original_price),selling_price:num(p.selling_price),discount_pct:num(p.discount_pct),weight_size:clean(p.weight_size),variants:clean(p.variants),stock:clean(p.stock),sku:clean(p.sku)}).select("id").single();if(error)throw error
   for(const f of imgs[j].slice(0,10)){const path=await up(f);const {error:e}=await db.from("product_images").insert({product_id:pr.id,path});if(e)throw e}}
  return NextResponse.json({ref})
 }catch(e){console.error(e);if(orgId)await db.from("organizations").delete().eq("id",orgId)
  return bad("We could not save your submission. Please try again.",500)}}
