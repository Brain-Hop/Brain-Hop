import React from "react";
import {
  OpenAIIcon,
  GoogleGIcon,
  MetaIcon,
  MistralIcon,
  PerplexityIcon,
  HuggingFaceIcon,
  DeepSeekIcon,
} from "../icons/AIIcons";

export function PartnerLogos() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 pt-10 pb-12 select-none">
      <p className="text-center text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-8 tracking-normal">
        Trusted by 200,000+ users worldwide
      </p>

      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 opacity-85 hover:opacity-100 transition-opacity">
        {/* OpenAI */}
        <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors">
          <OpenAIIcon className="w-5 h-5 text-current" />
          <span className="font-semibold text-sm tracking-tight">OpenAI</span>
        </div>

        {/* Anthropic */}
        <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors">
          <div className="w-4 h-4 rounded bg-zinc-800 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-black text-[10px]">
            A
          </div>
          <span className="font-semibold text-sm tracking-tight">Anthropic</span>
        </div>

        {/* Google */}
        <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors">
          <GoogleGIcon className="w-4 h-4" />
          <span className="font-semibold text-sm tracking-tight">Google</span>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors">
          <MetaIcon className="w-5 h-5" />
          <span className="font-semibold text-sm tracking-tight">Meta</span>
        </div>

        {/* Mistral AI */}
        <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors">
          <MistralIcon className="w-4 h-4" />
          <span className="font-semibold text-sm tracking-tight">Mistral AI</span>
        </div>

        {/* Perplexity */}
        <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors">
          <PerplexityIcon className="w-4 h-4" />
          <span className="font-semibold text-sm tracking-tight">Perplexity</span>
        </div>

        {/* Hugging Face */}
        <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors">
          <HuggingFaceIcon className="w-5 h-5 text-base" />
          <span className="font-semibold text-sm tracking-tight">Hugging Face</span>
        </div>

        {/* DeepSeek */}
        <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors">
          <DeepSeekIcon className="w-5 h-5" />
          <span className="font-semibold text-sm tracking-tight">DeepSeek</span>
        </div>
      </div>
    </div>
  );
}
