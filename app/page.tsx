import Wizard from "@/components/Wizard"
export default function Home(){return <main>
<section className="bg-forest-deep text-beige">
 <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
  <p className="mb-6 text-sm text-forest-mist/80">Alif Naturalist – Website Requirement Portal</p>
  <h1 className="max-w-3xl font-serif text-5xl leading-[1.05] md:text-7xl">Let&apos;s Build Your Digital Store.</h1>
  <p className="mt-6 max-w-xl text-lg text-beige/80">Share your business requirements and let us create an exceptional online shopping experience.</p>
  <a href="#start" className="mt-10 inline-flex rounded-full bg-beige px-8 py-3 font-medium text-forest-deep transition hover:bg-white">Start Your Project</a>
 </div></section>
<section id="start" className="mx-auto max-w-4xl scroll-mt-6 px-4 py-12"><Wizard/></section>
<footer className="mx-auto flex max-w-4xl flex-col items-center gap-2 px-6 pb-12 text-center text-sm text-forest-deep/70">
 <img src="/logo.jpeg" alt="InsightFlux Analytics" className="h-24 w-auto rounded-2xl"/>
 <span>Developed by InsightFlux Analytics &amp; Software Solutions</span><span>AI-Powered Insights. Smarter Decisions.</span></footer>
</main>}
