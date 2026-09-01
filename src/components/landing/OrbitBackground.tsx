import React from "react";
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
} from "../icons/AIIcons";

interface OrbitNodeProps {
  children: React.ReactNode;
  className?: string;
  tooltip?: string;
}

function OrbitNode({ children, className = "", tooltip }: OrbitNodeProps) {
  return (
    <div
      className={`absolute group z-10 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-115 hover:border-violet-500/60 dark:hover:border-violet-400/60 hover:shadow-[0_0_25px_rgba(139,92,246,0.25)] cursor-pointer select-none ${className}`}
    >
      <div className="flex items-center justify-center p-2.5 transition-transform duration-300 group-hover:scale-105">
        {children}
      </div>
      {tooltip && (
        <div className="absolute -bottom-8 px-2.5 py-1 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-40">
          {tooltip}
        </div>
      )}
    </div>
  );
}

export function OrbitBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center -z-0">
      {/* Ambient background glow in dark mode */}
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-transparent blur-3xl rounded-full pointer-events-none" />

      {/* Concentric Orbit Rings */}
      <div className="relative w-full h-full max-w-[1400px] flex items-center justify-center">
        {/* Ring 1 (Innermost) */}
        <div className="absolute w-[440px] h-[440px] rounded-full border border-zinc-200/60 dark:border-white/[0.08]" />

        {/* Ring 2 */}
        <div className="absolute w-[680px] h-[680px] rounded-full border border-zinc-200/60 dark:border-white/[0.07]" />

        {/* Ring 3 */}
        <div className="absolute w-[940px] h-[940px] rounded-full border border-zinc-200/50 dark:border-white/[0.06]" />

        {/* Ring 4 */}
        <div className="absolute w-[1220px] h-[1220px] rounded-full border border-zinc-200/40 dark:border-white/[0.05]" />

        {/* Ring 5 (Outermost) */}
        <div className="absolute w-[1520px] h-[1520px] rounded-full border border-zinc-200/30 dark:border-white/[0.04]" />

        {/* Interactive Floating AI Badges placed along orbits */}
        <div className="pointer-events-auto w-full h-full relative max-w-[1240px] mx-auto min-h-[640px]">
          {/* Top-Left: OpenAI */}
          <OrbitNode
            className="left-[18%] sm:left-[21%] top-[17%] sm:top-[19%]"
            tooltip="OpenAI (GPT-4o, o3-mini)"
          >
            <OpenAIIcon className="w-6 h-6 text-zinc-900 dark:text-white" />
          </OrbitNode>

          {/* Far-Left: Anthropic */}
          <OrbitNode
            className="left-[6%] sm:left-[11%] top-[34%] sm:top-[36%]"
            tooltip="Anthropic (Claude 3.5 Sonnet)"
          >
            <AnthropicIcon className="w-7 h-7" />
          </OrbitNode>

          {/* Bottom-Left Mid: Meta */}
          <OrbitNode
            className="left-[19%] sm:left-[23%] top-[49%] sm:top-[51%]"
            tooltip="Meta (Llama 3.3 70B)"
          >
            <MetaIcon className="w-6 h-6" />
          </OrbitNode>

          {/* Far Bottom-Left: Google */}
          <OrbitNode
            className="left-[4%] sm:left-[8%] top-[58%] sm:top-[60%]"
            tooltip="Google (Search & AI)"
          >
            <GoogleGIcon className="w-6 h-6" />
          </OrbitNode>

          {/* Bottom-Left Inner: Mistral AI */}
          <OrbitNode
            className="left-[23%] sm:left-[27%] top-[70%] sm:top-[73%]"
            tooltip="Mistral AI (Codestral, Large 2)"
          >
            <MistralIcon className="w-6 h-6" />
          </OrbitNode>

          {/* Top-Right: Gemini */}
          <OrbitNode
            className="right-[18%] sm:right-[22%] top-[17%] sm:top-[19%]"
            tooltip="Google Gemini (1.5 Pro, Flash)"
          >
            <GeminiIcon className="w-full h-full" />
          </OrbitNode>

          {/* Far-Right: xAI */}
          <OrbitNode
            className="right-[6%] sm:right-[11%] top-[34%] sm:top-[37%]"
            tooltip="xAI (Grok 2)"
          >
            <XAIIcon className="w-5 h-5 text-zinc-900 dark:text-white" />
          </OrbitNode>

          {/* Mid-Right: DeepSeek */}
          <OrbitNode
            className="right-[19%] sm:right-[24%] top-[48%] sm:top-[50%]"
            tooltip="DeepSeek (V3 & R1)"
          >
            <DeepSeekIcon className="w-7 h-7" />
          </OrbitNode>

          {/* Far Bottom-Right: Hugging Face */}
          <OrbitNode
            className="right-[4%] sm:right-[8%] top-[58%] sm:top-[60%]"
            tooltip="Hugging Face Open Models"
          >
            <HuggingFaceIcon className="w-7 h-7" />
          </OrbitNode>

          {/* Bottom-Right Inner: Perplexity */}
          <OrbitNode
            className="right-[22%] sm:right-[24%] top-[70%] sm:top-[72%]"
            tooltip="Perplexity (Sonar Search)"
          >
            <PerplexityIcon className="w-6 h-6" />
          </OrbitNode>
        </div>
      </div>
    </div>
  );
}
