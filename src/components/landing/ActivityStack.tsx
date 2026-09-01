import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { AnthropicIcon } from "../icons/AIIcons";

export function ActivityStack() {
  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto pt-6 pb-2 select-none">
      {/* Diffuse Soft Glow behind cards */}
      <div className="absolute -bottom-6 w-72 h-32 bg-blue-400/25 dark:bg-indigo-500/20 blur-3xl rounded-full pointer-events-none -z-10" />

      {/* Card 1 (Top / Front) */}
      <div className="relative z-30 w-full max-w-[320px] sm:max-w-[340px] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl px-4 py-3 border border-zinc-100/90 dark:border-zinc-800 shadow-[0_12px_32px_-6px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_32px_-6px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Sneha"
            className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-zinc-700 flex-shrink-0"
          />
          <div className="min-w-0 flex-1 text-left">
            <p className="text-[13px] leading-tight text-zinc-700 dark:text-zinc-200">
              <span className="font-semibold text-zinc-900 dark:text-white">Sneha</span> merged{" "}
              <span className="font-semibold text-zinc-900 dark:text-white">2 conversations</span>
            </p>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 truncate">
              8 min ago • Python Backend Setup + DB Design
            </p>
          </div>
        </div>
      </div>

      {/* Card 2 (Middle) */}
      <div className="relative z-20 w-[94%] max-w-[305px] sm:max-w-[325px] -mt-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-zinc-100/80 dark:border-zinc-800/80 shadow-[0_10px_28px_-6px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-0.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#F06543] flex items-center justify-center text-white font-black text-xs flex-shrink-0 shadow-sm">
            AI
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-[13px] leading-tight text-zinc-700 dark:text-zinc-200">
              Switched to{" "}
              <span className="font-semibold text-zinc-900 dark:text-white">Claude 3.5 Sonnet</span>
            </p>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
              2 min ago
            </p>
          </div>
        </div>
      </div>

      {/* Card 3 (Bottom) */}
      <div className="relative z-10 w-[88%] max-w-[285px] sm:max-w-[305px] -mt-2 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-zinc-100/70 dark:border-zinc-800/70 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.2)] transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-[13px] leading-tight font-semibold text-zinc-900 dark:text-white">
              Image added to memory
            </p>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 truncate">
              5 min ago • architecture.png
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
