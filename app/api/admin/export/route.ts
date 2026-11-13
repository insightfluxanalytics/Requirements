import ExcelJS from "exceljs"
import { requireAdmin } from "@/lib/supabase/server"
import { STEPS } from "@/lib/form"
export const runtime="nodejs";export const dynamic="force-dynamic"
export async function GET(){
 const s=await requireAdmin()
 const {data}=await s.from("submissions").select("*,organizations(*),contacts(*),website_requirements(*),payment_requirements(*),delivery_requirements(*),design_preferences(*),technical_requirements(*),products(*)").order("created_at",{ascending:false})
 const wb=new ExcelJS.Workbook(),a=wb.addWorksheet("Submissions"),p=wb.addWorksheet("Products")
 const fields=STEPS.flatMap(st=>st.fields).filter(f=>f.t!=="logo")
 const map=(x:any):any=>({organizations:x.organizations,contacts:x.contacts,website:x.website_requirements,payment:x.payment_requirements,delivery:x.delivery_requirements,design:x.design_preferences,technical:x.technical_requirements,submission:x})
 a.columns=[{header:"Submission ID",key:"ref",width:22},{header:"Submitted",key:"at",width:20},...fields.map(f=>({header:f.l,key:f.g+f.k,width:24}))]
 p.columns=["Submission ID","Organization","Product","Category","Original price","Selling price","Discount %","Weight/Size","Variants","Stock","SKU","Description"].map(h=>({header:h,width:20}))
 for(const x of data||[]){const m=map(x),row:any={ref:x.ref,at:new Date(x.created_at).toLocaleString("en-IN")}
  fields.forEach(f=>{const v=m[f.g]?.[f.k];row[f.g+f.k]=Array.isArray(v)?v.join(", "):v});a.addRow(row)
  for(const q of x.products||[])p.addRow([x.ref,x.organizations?.name,q.name,q.category,q.original_price,q.selling_price,q.discount_pct,q.weight_size,q.variants,q.stock,q.sku,q.description])}
 ;[a,p].forEach(w=>w.getRow(1).font={bold:true})
 const buf=await wb.xlsx.writeBuffer()
 return new Response(buf,{headers:{"Content-Type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","Content-Disposition":`attachment; filename="alif-submissions.xlsx"`,"Cache-Control":"no-store"}})}
