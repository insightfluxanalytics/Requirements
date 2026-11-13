import Link from "next/link"
import { requireAdmin } from "@/lib/supabase/server"
import { logout } from "../actions"
export default async function L({children}:{children:React.ReactNode}){
 await requireAdmin()
 return <div><header className="noprint border-b border-beige-dark bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
  <div className="flex items-center gap-6"><img src="/logo.jpeg" alt="InsightFlux" className="h-10 w-auto rounded"/><nav className="flex gap-4 text-sm text-forest-deep"><Link href="/admin/dashboard">Dashboard</Link><Link href="/admin/submissions">Submissions</Link></nav></div>
  <form action={logout}><button className="btn-ghost !py-1.5 text-sm">Log out</button></form></div></header>
  <main className="mx-auto max-w-6xl px-5 py-8">{children}</main></div>}
