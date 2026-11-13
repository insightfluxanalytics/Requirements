import "./globals.css"
import { Fraunces, Figtree } from "next/font/google"
const serif=Fraunces({subsets:["latin"],variable:"--font-serif"}),sans=Figtree({subsets:["latin"],variable:"--font-sans"})
export const metadata={title:"Alif Naturalist – Website Requirement Portal",description:"Share your e-commerce website requirements with InsightFlux Analytics & Software Solutions."}
export default function L({children}:{children:React.ReactNode}){return <html lang="en" className={`${serif.variable} ${sans.variable}`}><body>{children}</body></html>}
