import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";
import { ArrowRight, BrainCircuit, GitMerge, Layers3, Network } from "lucide-react";

const features = [
  { icon: Network, title: "Follow the thread", text: "Keep every line of thought visible, from a quick question to a deep research trail." },
  { icon: Layers3, title: "Choose the right mind", text: "Move between capable models without breaking the flow of your work." },
  { icon: GitMerge, title: "Connect what matters", text: "Merge separate conversations into a shared context when ideas begin to overlap." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-subtle overflow-hidden">
      <Navbar />
      <main>
        <section className="container mx-auto px-4 pt-20 pb-24 md:pt-28">
          <div className="grid gap-14 lg:grid-cols-[1.08fr_.92fr] items-center max-w-6xl mx-auto">
            <div className="space-y-7">
              <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground"><BrainCircuit className="h-4 w-4 text-primary" /> A connected AI workspace</p>
              <h1 className="text-5xl md:text-7xl font-semibold tracking-[-.055em] leading-[.96]">Think in paths,<br /><span className="text-primary">not prompts.</span></h1>
              <p className="max-w-xl text-lg md:text-xl leading-relaxed text-muted-foreground">Brain Hop helps you move between models, preserve useful context, and connect conversations when a single thread is not enough.</p>
              <div className="flex flex-wrap gap-3 pt-2"><Button size="lg" asChild className="rounded-full px-6"><Link to="/signup">Start a workspace <ArrowRight className="ml-2 h-4 w-4" /></Link></Button><Button size="lg" variant="outline" asChild className="rounded-full px-6"><Link to="/login">Continue thinking</Link></Button></div>
            </div>
            <div className="relative min-h-[380px] rounded-[2rem] border border-border bg-card/80 shadow-medium p-6 overflow-hidden">
              <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "radial-gradient(hsl(var(--border)) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
              <div className="relative h-full flex items-center justify-center">
                <div className="absolute h-48 w-48 rounded-full border border-primary/30 bg-primary/10" /><div className="absolute h-28 w-28 rounded-full border border-accent/70 bg-accent/20" />
                <div className="absolute top-14 left-8 rounded-2xl border border-border bg-background/90 p-4 shadow-soft text-sm"><p className="font-medium">Research thread</p><p className="text-xs text-muted-foreground mt-1">Claude · 12 notes</p></div>
                <div className="absolute bottom-12 right-6 rounded-2xl border border-border bg-background/90 p-4 shadow-soft text-sm"><p className="font-medium">Product ideas</p><p className="text-xs text-muted-foreground mt-1">Gemini · merged</p></div>
                <div className="relative z-10 rounded-2xl bg-primary text-primary-foreground p-5 shadow-medium"><GitMerge className="h-8 w-8" /><p className="mt-3 text-sm font-medium">Shared context</p></div>
              </div>
            </div>
          </div>
        </section>
        <section className="container mx-auto px-4 pb-24"><div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-4">{features.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-3xl border border-border bg-card/75 p-7 shadow-soft"><div className="mb-8 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><Icon className="h-5 w-5" /></div><h2 className="text-xl font-semibold">{title}</h2><p className="mt-3 leading-relaxed text-muted-foreground">{text}</p></article>)}</div></section>
      </main>
      <footer className="border-t border-border py-8"><div className="container mx-auto px-4 flex justify-between text-sm text-muted-foreground"><span>Brain Hop</span><span>© 2026</span></div></footer>
    </div>
  );
}
