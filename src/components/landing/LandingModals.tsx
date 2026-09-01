import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, Sparkles, Zap, Shield, GitMerge, Layers, Brain, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeaturesModal({ isOpen, onClose }: ModalProps) {
  const featureList = [
    {
      icon: GitMerge,
      title: "Chat Merging & Cross-Memory",
      desc: "Merge two or more separate chat threads into one unified vector context. Query across multiple projects simultaneously.",
    },
    {
      icon: Layers,
      title: "Multi-Model 'Hopping'",
      desc: "Switch between GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, DeepSeek V3, and Llama 3.3 seamlessly without losing thread state.",
    },
    {
      icon: Brain,
      title: "Semantic Vector RAG",
      desc: "Powered by Gemini multilingual embeddings and Supabase pgvector for persistent, instant contextual recall.",
    },
    {
      icon: Sparkles,
      title: "Multimodal Vision Context",
      desc: "Upload diagrams, wireframes, or screenshots. Vision models extract semantic captions and save them directly into chat memory.",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8">
        <DialogHeader>
          <div className="w-10 h-10 rounded-2xl bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <DialogTitle className="text-2xl font-bold text-zinc-900 dark:text-white">
            Built for AI Power Users
          </DialogTitle>
          <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-sm">
            Discover why developers, researchers, and creators use Brain Hop as their daily driver.
          </DialogDescription>
        </DialogHeader>

        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          {featureList.map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <item.icon className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <h4 className="font-semibold text-sm text-zinc-900 dark:text-white">{item.title}</h4>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="rounded-full">
            Close
          </Button>
          <Button asChild className="rounded-full bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950">
            <Link to="/signup">
              Try It Free <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PricingModal({ isOpen, onClose }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-zinc-900 dark:text-white text-center">
            Simple, Transparent Pricing
          </DialogTitle>
          <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-sm text-center">
            Start for free and scale as you grow. No hidden fees.
          </DialogDescription>
        </DialogHeader>

        <div className="grid sm:grid-cols-2 gap-6 mt-6">
          {/* Free Tier */}
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Free Tier</span>
              <div className="flex items-baseline gap-1 mt-2 mb-4">
                <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">$0</span>
                <span className="text-xs text-zinc-400">/ forever</span>
              </div>
              <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Access to Top OpenRouter Free Models</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Gemini Semantic Vector Search</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Unlimited Chat Merges</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Cloud History Persistence</li>
              </ul>
            </div>
            <Button asChild className="w-full mt-6 rounded-full" variant="outline">
              <Link to="/signup">Get Started Free</Link>
            </Button>
          </div>

          {/* Pro Tier */}
          <div className="p-6 rounded-2xl border-2 border-violet-600 dark:border-violet-500 bg-violet-50/20 dark:bg-violet-950/20 flex flex-col justify-between relative shadow-md">
            <div className="absolute -top-3 right-6 bg-violet-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              Most Popular
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">Pro Workspace</span>
              <div className="flex items-baseline gap-1 mt-2 mb-4">
                <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">$15</span>
                <span className="text-xs text-zinc-400">/ month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-600" /> All Free features included</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-600" /> Priority API throughput & low latency</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-600" /> Unlimited image uploads & OCR parsing</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-600" /> BYOK (Bring Your Own Keys) Support</li>
              </ul>
            </div>
            <Button asChild className="w-full mt-6 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950">
              <Link to="/signup">Start Free 14-Day Trial</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SalesModal({ isOpen, onClose }: ModalProps) {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({
      title: "Request Received!",
      description: "Our sales team will reach out to you within 24 hours.",
    });
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-zinc-900 dark:text-white">
            Talk to Our Team
          </DialogTitle>
          <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-sm">
            Learn how Brain Hop can empower your team with unified AI workspaces and shared memory.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center text-emerald-600 font-medium">
            Thank you! We will get in touch shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 mt-3">
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Work Email</label>
              <Input required type="email" placeholder="you@company.com" className="rounded-xl mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Company Size</label>
              <Input placeholder="e.g. 10-50 employees" className="rounded-xl mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Message / Requirements</label>
              <Textarea placeholder="Tell us how your team uses LLMs..." className="rounded-xl mt-1 text-xs" rows={3} />
            </div>
            <Button type="submit" className="w-full rounded-full bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950 mt-2">
              Submit Request
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function ChangelogModal({ isOpen, onClose }: ModalProps) {
  const logs = [
    {
      version: "v2.4.0",
      date: "September 2026",
      items: [
        "Added DeepSeek-V3 & DeepSeek-R1 model integrations via OpenRouter.",
        "Instant Chat Merging with pgvector similarity indexing.",
        "Brand new landing page with orbital model explorer.",
      ],
    },
    {
      version: "v2.3.0",
      date: "August 2026",
      items: [
        "Gemini 1.5 Pro and Flash multimodal vision context support.",
        "Automatic background RAG memory embedding generation.",
      ],
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white">
            Changelog & Updates
          </DialogTitle>
          <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-sm">
            What's new in Brain Hop.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-3 max-h-[360px] overflow-y-auto pr-1">
          {logs.map((log, i) => (
            <div key={i} className="border-l-2 border-violet-500 pl-3.5 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-zinc-900 dark:text-white">{log.version}</span>
                <span className="text-[11px] text-zinc-400">{log.date}</span>
              </div>
              <ul className="list-disc list-inside text-xs text-zinc-600 dark:text-zinc-300 space-y-1">
                {log.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
