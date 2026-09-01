import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  GitMerge,
  Layers,
  Brain,
  Sparkles,
  Zap,
  ShieldCheck,
  Check,
  ArrowRight,
  Copy,
  CheckCheck,
  Code2,
  Database,
  Cpu,
  Globe2,
  Terminal,
  Send,
  MessageSquare,
  Search,
  Mail,
  ExternalLink,
  Heart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  OpenAIIcon,
  AnthropicIcon,
  MetaIcon,
  GoogleGIcon,
  MistralIcon,
  GeminiIcon,
  XAIIcon,
  DeepSeekIcon,
  HuggingFaceIcon,
  PerplexityIcon,
  GitHubIcon,
} from "../icons/AIIcons";

// ==========================================
// 1. FEATURES SECTION (#features)
// ==========================================
export function FeaturesSection() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const bentoFeatures = [
    {
      icon: GitMerge,
      badge: "The Flagship Innovation",
      title: "Chat Merging & Context Fusion",
      desc: "Connect two or more isolated discussions into a unified vector space. Query across past research threads, backend setups, and API specs without prompt token degradation.",
      gradient: "from-blue-600 to-violet-600",
    },
    {
      icon: Layers,
      badge: "Zero Friction",
      title: "Instant Multi-Model 'Hopping'",
      desc: "Switch between GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, DeepSeek V3, and Llama 3.3 in the same conversation thread without page reloads.",
      gradient: "from-violet-600 to-purple-600",
    },
    {
      icon: Database,
      badge: "Hybrid Vector Search",
      title: "Google Gemini Embeddings + pgvector",
      desc: "Every message turn is automatically chunked, embedded with 1536-dim vectors, and indexed with Postgres pgvector for millisecond semantic retrieval.",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: Sparkles,
      badge: "Multimodal Vision RAG",
      title: "Automatic Visual Context Extraction",
      desc: "Drop diagrams, architecture sketches, or error screenshots. Vision models extract concise semantic captions and index them into persistent memory.",
      gradient: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <section id="features" className="relative w-full py-20 md:py-28 px-4 max-w-6xl mx-auto scroll-mt-20">
      {/* Subtle Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-violet-600/10 dark:bg-violet-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Zap className="w-3.5 h-3.5" /> Next-Gen AI Capabilities
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Engineered for users who refuse model silos.
        </h2>
        <p className="mt-4 text-zinc-500 dark:text-zinc-400 text-base sm:text-lg">
          Everything you need to break out of single-model boundaries and work with interconnected memory.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {bentoFeatures.map((feat, idx) => (
          <div
            key={idx}
            className="group relative rounded-3xl border border-zinc-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:border-violet-500/40 dark:hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-white/[0.06] flex items-center justify-center text-zinc-900 dark:text-white group-hover:scale-110 transition-transform">
                <feat.icon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-3 py-1 rounded-full border border-zinc-200/60 dark:border-white/[0.06] bg-zinc-50/50 dark:bg-white/[0.02]">
                {feat.badge}
              </span>
            </div>

            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2.5">
              {feat.title}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {feat.desc}
            </p>

            {/* Interactive Mock Preview in First Bento */}
            {idx === 0 && (
              <div className="mt-6 rounded-2xl border border-zinc-200/60 dark:border-white/[0.06] bg-zinc-50/80 dark:bg-zinc-950/60 p-4 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-2 border-b border-zinc-200/60 dark:border-white/[0.06] pb-2">
                  <span>POST /api/rag/merge_chats</span>
                  <span className="text-emerald-500 font-semibold">200 OK</span>
                </div>
                <p className="text-violet-600 dark:text-violet-400 font-semibold">
                  Merged: &quot;Postgres pgvector setup&quot; + &quot;Express API Auth&quot;
                </p>
                <p className="text-zinc-400 dark:text-zinc-500 mt-1">
                  14 memory vectors indexed into new workspace ID.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ==========================================
// 2. MODELS EXPLORER SECTION (#models)
// ==========================================
export function ModelsSection() {
  const [filter, setFilter] = useState<"all" | "reasoning" | "multimodal" | "opensource">("all");

  const modelsList = [
    {
      id: "anthropic/claude-3.5-sonnet",
      name: "Claude 3.5 Sonnet",
      provider: "Anthropic",
      icon: AnthropicIcon,
      category: "multimodal",
      badge: "Industry Favorite",
      context: "200K Tokens",
      speed: "Fast (75 t/s)",
      desc: "Unmatched coding intuition, nuanced reasoning, and deep document parsing.",
    },
    {
      id: "openai/gpt-4o",
      name: "GPT-4o",
      provider: "OpenAI",
      icon: OpenAIIcon,
      category: "multimodal",
      badge: "Frontier Flagship",
      context: "128K Tokens",
      speed: "Ultra Fast (95 t/s)",
      desc: "Omni-modal reasoning across complex instructions, math, and code generation.",
    },
    {
      id: "deepseek/deepseek-r1",
      name: "DeepSeek-R1",
      provider: "DeepSeek",
      icon: DeepSeekIcon,
      category: "reasoning",
      badge: "Chain of Thought",
      context: "64K Tokens",
      speed: "Deliberate (45 t/s)",
      desc: "Open frontier reasoning model matching top proprietary logic benchmarks.",
    },
    {
      id: "google/gemini-1.5-pro",
      name: "Gemini 1.5 Pro",
      provider: "Google",
      icon: GoogleGIcon,
      category: "multimodal",
      badge: "Massive Context",
      context: "2M Tokens",
      speed: "Fast (60 t/s)",
      desc: "Incredible two-million token context window for analyzing full repositories.",
    },
    {
      id: "meta-llama/llama-3.3-70b-instruct",
      name: "Llama 3.3 70B",
      provider: "Meta",
      icon: MetaIcon,
      category: "opensource",
      badge: "Open Powerhouse",
      context: "128K Tokens",
      speed: "Instant (120 t/s)",
      desc: "Meta's flagship open-weights model fine-tuned for high-precision workflows.",
    },
    {
      id: "mistralai/mistral-large-2",
      name: "Mistral Large 2",
      provider: "Mistral AI",
      icon: MistralIcon,
      category: "opensource",
      badge: "Multilingual King",
      context: "128K Tokens",
      speed: "Ultra Fast (80 t/s)",
      desc: "Top-tier multilingual code generation and structured JSON outputs.",
    },
  ];

  const filtered = filter === "all" ? modelsList : modelsList.filter((m) => m.category === filter);

  return (
    <section id="models" className="relative w-full py-20 md:py-28 px-4 max-w-6xl mx-auto scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Cpu className="w-3.5 h-3.5" /> Unified Model Gateway
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Every leading model, one unified click away.
        </h2>
        <p className="mt-4 text-zinc-500 dark:text-zinc-400 text-base sm:text-lg">
          Switch models mid-stream based on task requirements—from heavy mathematical reasoning to lightning code autocompletion.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {[
            { id: "all", label: "All Models" },
            { id: "reasoning", label: "Frontier Reasoning" },
            { id: "multimodal", label: "Multimodal Titans" },
            { id: "opensource", label: "Open Source Giants" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as typeof filter)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filter === tab.id
                  ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm"
                  : "bg-zinc-100 dark:bg-white/[0.05] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((model) => {
          const Icon = model.icon;
          return (
            <div
              key={model.id}
              className="rounded-3xl border border-zinc-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] flex flex-col justify-between hover:border-violet-500/40 transition-all hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-white/[0.08] flex items-center justify-center p-2">
                    <Icon className="w-6 h-6 text-zinc-900 dark:text-white" />
                  </div>
                  <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                    {model.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  {model.name}
                </h3>
                <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 mb-3">
                  by {model.provider}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {model.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-400">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">{model.context}</span>
                <span>{model.speed}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ==========================================
// 3. PRICING SECTION (#pricing)
// ==========================================
export function PricingSection() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="relative w-full py-20 md:py-28 px-4 max-w-6xl mx-auto scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <ShieldCheck className="w-3.5 h-3.5" /> Predictable & Transparent
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Simple pricing for creators & teams.
        </h2>
        <p className="mt-4 text-zinc-500 dark:text-zinc-400 text-base sm:text-lg">
          Start for free forever with free-tier models and vector storage, or upgrade for unlimited high-speed frontier routing.
        </p>

        {/* Annual / Monthly Toggle */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <span className={`text-sm font-semibold ${!annual ? "text-zinc-900 dark:text-white" : "text-zinc-400"}`}>
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className="w-12 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 p-0.5 relative transition-colors cursor-pointer"
          >
            <div
              className={`w-5 h-5 rounded-full bg-violet-600 transition-transform ${
                annual ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-sm font-semibold flex items-center gap-1.5 ${annual ? "text-zinc-900 dark:text-white" : "text-zinc-400"}`}>
            Annual <span className="text-[10px] uppercase font-bold text-emerald-500 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">Save 20%</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Tier 1: Free */}
        <div className="rounded-3xl border border-zinc-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl p-8 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Free Tier</span>
            <div className="flex items-baseline gap-1 mt-3 mb-6">
              <span className="text-4xl font-extrabold text-zinc-900 dark:text-white">$0</span>
              <span className="text-xs text-zinc-400">/ forever</span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
              Ideal for personal exploration, experimentation, and free-tier open models.
            </p>
            <ul className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300">
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Access to OpenRouter free models</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Gemini multilingual vector embeddings</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Unlimited chat merging</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Persistent Supabase history</li>
            </ul>
          </div>
          <Button asChild className="w-full mt-8 rounded-full" variant="outline">
            <Link to="/signup">Get Started Free</Link>
          </Button>
        </div>

        {/* Tier 2: Pro (Highlighted) */}
        <div className="rounded-3xl border-2 border-violet-600 dark:border-violet-500 bg-violet-500/[0.03] dark:bg-violet-950/[0.15] backdrop-blur-xl p-8 flex flex-col justify-between relative shadow-[0_12px_40px_rgba(139,92,246,0.15)]">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-md">
            Most Popular
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">Pro Workspace</span>
            <div className="flex items-baseline gap-1 mt-3 mb-6">
              <span className="text-4xl font-extrabold text-zinc-900 dark:text-white">
                ${annual ? "12" : "15"}
              </span>
              <span className="text-xs text-zinc-400">/ month</span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
              For power users, researchers, and developers requiring frontier reasoning daily.
            </p>
            <ul className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300">
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0" /> <strong>All Free features</strong> included</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0" /> Claude 3.5 Sonnet & GPT-4o access</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0" /> Unlimited vision image uploads & OCR</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0" /> Priority API throughput & zero queue delay</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0" /> BYOK (Bring Your Own Keys) Support</li>
            </ul>
          </div>
          <Button asChild className="w-full mt-8 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 shadow-md">
            <Link to="/signup">Start Free 14-Day Trial</Link>
          </Button>
        </div>

        {/* Tier 3: Team / Enterprise */}
        <div className="rounded-3xl border border-zinc-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl p-8 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Team & Enterprise</span>
            <div className="flex items-baseline gap-1 mt-3 mb-6">
              <span className="text-4xl font-extrabold text-zinc-900 dark:text-white">
                ${annual ? "32" : "39"}
              </span>
              <span className="text-xs text-zinc-400">/ seat / mo</span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
              For teams requiring centralized vector memory vaults and strict organizational compliance.
            </p>
            <ul className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300">
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Shared team memory workspaces</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Role-based access controls (RBAC)</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Custom enterprise SLA & dedicated VPC</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Centralized billing & SOC2 compliance</li>
            </ul>
          </div>
          <Button asChild className="w-full mt-8 rounded-full" variant="outline">
            <a href="#contact">Contact Us</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 4. DOCS & QUICKSTART SECTION (#docs)
// ==========================================
export function DocsSection() {
  const [activeTab, setActiveTab] = useState<"quickstart" | "merging" | "architecture">("quickstart");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const codeSnippet = `// Example: Merging 2 conversations via Brain Hop API
const response = await fetch("https://api.brainhop.app/api/rag/merge_chats", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + userSessionToken,
  },
  body: JSON.stringify({
    user_id: user.id,
    new_chat_id: "merged-vault-01",
    merge_chat_ids: ["chat-react-ui", "chat-db-schema"]
  })
});

const result = await response.json();
console.log("Memory successfully clustered & merged:", result.status);`;

  const copyCode = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="docs" className="relative w-full py-20 md:py-28 px-4 max-w-6xl mx-auto scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Terminal className="w-3.5 h-3.5" /> Developer & User Guides
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Built with transparent, modular architecture.
        </h2>
        <p className="mt-4 text-zinc-500 dark:text-zinc-400 text-base sm:text-lg">
          Explore how Brain Hop orchestrates embedding pipelines, semantic clustering, and dynamic LLM routing.
        </p>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {[
            { id: "quickstart", label: "Quick Start Guide" },
            { id: "merging", label: "Chat Merging Logic" },
            { id: "architecture", label: "RAG & Vector Stack" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm"
                  : "bg-zinc-100 dark:bg-white/[0.05] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Container */}
      <div className="rounded-3xl border border-zinc-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
        {activeTab === "quickstart" && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-white/[0.06]">
              <div className="w-8 h-8 rounded-full bg-violet-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                1
              </div>
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">Create Workspace</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Sign in with Supabase auth and start a fresh chat thread. Your messages are automatically indexed into vector memory.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-white/[0.06]">
              <div className="w-8 h-8 rounded-full bg-violet-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                2
              </div>
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">Hop Between Models</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Use the top dropdown to switch from Claude 3.5 Sonnet to GPT-4o or DeepSeek R1 whenever you need different capabilities.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-white/[0.06]">
              <div className="w-8 h-8 rounded-full bg-violet-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                3
              </div>
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">Merge Multiple Threads</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Select checkbox mode in the sidebar, choose two or more discussions, and click Merge to fuse their semantic context.
              </p>
            </div>
          </div>
        )}

        {activeTab === "merging" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-zinc-500 dark:text-zinc-400">
                // Vector Clustering & RPC Execution
              </span>
              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy snippet"}
              </button>
            </div>
            <pre className="p-5 rounded-2xl bg-zinc-950 text-zinc-200 font-mono text-xs overflow-x-auto leading-relaxed border border-white/10">
              <code>{codeSnippet}</code>
            </pre>
          </div>
        )}

        {activeTab === "architecture" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="p-5 rounded-2xl bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-white/[0.06]">
              <Globe2 className="w-6 h-6 text-violet-600 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white">React 18 + Vite</h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">Single-page UI with Tailwind & Shadcn atoms.</p>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-white/[0.06]">
              <Database className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Supabase pgvector</h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">Cosine similarity retrieval & RLS isolation.</p>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-white/[0.06]">
              <Brain className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Gemini Embeddings</h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">1536-dimensional multilingual vectors.</p>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-white/[0.06]">
              <Cpu className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white">OpenRouter API</h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">Zero-latency dynamic model routing gateway.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ==========================================
// 5. CHANGELOG SECTION (#changelog)
// ==========================================
export function ChangelogSection() {
  const updates = [
    {
      version: "v2.4.0",
      date: "September 2026",
      tag: "Latest Release",
      title: "DeepSeek R1 & Single-Page Scrollable Experience",
      points: [
        "Integrated DeepSeek-V3 and DeepSeek-R1 reasoning models via OpenRouter.",
        "Engineered smooth single-page navigation and elevated obsidian dark mode.",
        "Optimized pgvector indexing latency by 45% for multi-chat context merges.",
      ],
    },
    {
      version: "v2.3.0",
      date: "August 2026",
      tag: "Major Update",
      title: "Multimodal Vision Context & Gemini 1.5 Integration",
      points: [
        "Enabled automatic visual captioning for uploaded diagrams and mockups.",
        "Introduced Gemini 1.5 Pro two-million token context window support.",
        "Added instant floating snippet menu for highlight-and-save workflows.",
      ],
    },
    {
      version: "v2.2.0",
      date: "July 2026",
      tag: "Core Engine",
      title: "Supabase pgvector Migration & Zero-Local Overhead",
      points: [
        "Replaced heavy local PyTorch runtimes with cloud-native Supabase pgvector.",
        "Enabled end-to-end user-scoped memory isolation with Postgres Row-Level Security.",
      ],
    },
  ];

  return (
    <section id="changelog" className="relative w-full py-20 md:py-28 px-4 max-w-4xl mx-auto scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Code2 className="w-3.5 h-3.5" /> Continuous Innovation
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Changelog & Product Evolution
        </h2>
        <p className="mt-4 text-zinc-500 dark:text-zinc-400 text-base sm:text-lg">
          We ship new model integrations, memory clustering improvements, and UI enhancements every week.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative pl-6 sm:pl-8 border-l border-zinc-200 dark:border-white/[0.08] space-y-10">
        {updates.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-white dark:bg-zinc-900 border-2 border-violet-600 dark:border-violet-400 shadow-sm" />

            <div className="rounded-3xl border border-zinc-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-7 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-extrabold text-base text-zinc-900 dark:text-white">{item.version}</span>
                  <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                    {item.tag}
                  </span>
                </div>
                <span className="text-xs text-zinc-400 dark:text-zinc-500">{item.date}</span>
              </div>

              <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 mb-3">
                {item.title}
              </h3>

              <ul className="space-y-2">
                {item.points.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    <Check className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ==========================================
// 6. CONTACT & OPEN SOURCE SECTION (#contact)
// ==========================================
export function ContactSection() {
  const { toast } = useToast();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const emailAddress = "siddharthakhandelwal9@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopiedEmail(true);
    toast({
      title: "Email copied to clipboard!",
      description: emailAddress,
    });
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section id="contact" className="relative w-full py-20 md:py-28 px-4 max-w-4xl mx-auto scroll-mt-20">
      <div className="rounded-3xl border border-zinc-200/80 dark:border-white/[0.08] bg-gradient-to-b from-white/90 to-zinc-50/70 dark:from-zinc-900/80 dark:to-zinc-950/90 backdrop-blur-xl p-8 sm:p-12 shadow-medium">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Heart className="w-3.5 h-3.5" /> Community & Open Source
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Get in touch & contribute.
          </h2>
          <p className="mt-3 text-zinc-500 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
            Brain Hop is built in the open. Reach out for collaborations, feedback, questions, or contribute code to the repository.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Card 1: Direct Email */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-white/[0.08] flex flex-col justify-between shadow-sm hover:border-violet-500/40 transition-all">
            <div>
              <div className="w-11 h-11 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
                Direct Email
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                Have a question, feedback, or partnership inquiry? Drop an email directly.
              </p>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200/60 dark:border-white/[0.06] font-mono text-xs text-zinc-800 dark:text-zinc-200 break-all select-all">
                {emailAddress}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-6">
              <Button
                asChild
                className="flex-1 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 text-xs font-semibold shadow-sm"
              >
                <a href={`mailto:${emailAddress}`}>
                  <Mail className="w-3.5 h-3.5 mr-1.5" /> Send Email
                </a>
              </Button>
              <Button
                variant="outline"
                onClick={handleCopyEmail}
                className="rounded-full text-xs font-semibold px-3"
              >
                {copiedEmail ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>

          {/* Card 2: GitHub Open Source */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-white/[0.08] flex flex-col justify-between shadow-sm hover:border-violet-500/40 transition-all">
            <div>
              <div className="w-11 h-11 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center mb-4">
                <GitHubIcon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
                GitHub Repository
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                Help build the next generation of AI workspaces. Star, fork, and submit pull requests.
              </p>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200/60 dark:border-white/[0.06] font-mono text-xs text-zinc-800 dark:text-zinc-200 break-all">
                github.com/Brain-Hop
              </div>
            </div>

            <Button
              asChild
              className="w-full mt-6 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 text-xs font-semibold shadow-sm"
            >
              <a href="https://github.com/Brain-Hop/" target="_blank" rel="noopener noreferrer">
                <GitHubIcon className="w-3.5 h-3.5 mr-2" /> Contribute on GitHub <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-70" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 7. FOOTER SECTION
// ==========================================
export function FooterSection() {
  return (
    <footer className="w-full border-t border-zinc-200/80 dark:border-white/[0.06] bg-white/40 dark:bg-zinc-950/60 backdrop-blur-xl py-12 px-4 select-none">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src="/brain_hop.png"
              alt="Brain Hop"
              className="w-7 h-10 object-cover object-top -mt-0.5"
            />
          </div>
          <span className="font-bold text-base tracking-tight text-zinc-900 dark:text-white">
            Brain<span className="ml-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Hop</span>
          </span>
        </div>

        {/* Scroll Nav Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <a href="#features" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Features</a>
          <a href="#models" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Models</a>
          <a href="#pricing" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Pricing</a>
          <a href="#docs" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Docs</a>
          <a href="#changelog" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Changelog</a>
          <a href="#contact" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Contact</a>
        </div>

        {/* Copyright */}
        <div className="text-xs text-zinc-400 dark:text-zinc-500">
          © 2026 Brain Hop Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
